require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const calculateRouter = require('./routes/calculate');
const installerRouter = require('./routes/installer');
const authRouter = require('./routes/auth');
const subscriptionRouter = require('./routes/subscription');
const leadsRouter = require('./routes/leads');
const estimateShareRouter = require('./routes/estimateShare');
const { requireAuth } = require('./middleware/auth');
const { checkTrialReminders, checkActivationReminders, checkPendingDeletions } = require('./services/trialScheduler');
const { getInstallerConfig } = require('./routes/installer');
const { computeSubscriptionStatus } = require('./routes/subscription');
const { DEFAULT_INSTALLER_CONFIG } = require('./config/defaults');

const app = express();
const PORT = process.env.PORT || 3001;

// Security. crossOriginResourcePolicy is explicitly set to 'cross-origin'
// here -- helmet() with no options defaults it to 'same-origin', which
// sets Cross-Origin-Resource-Policy: same-origin on every response. That
// header is enforced by the browser completely independently of CORS: it
// blocked the frontend from reading /api/calculate's response even with
// the CORS fix in place and correct Access-Control-Allow-Origin headers,
// because this is a split-deployment API (frontend on Vercel, backend on
// Railway) where the frontend is ALWAYS a different origin than this
// backend -- there's no same-origin page ever served from here for the
// default to protect. Chrome's DevTools mislabels this exact failure
// mode under the same generic "CORS error" status as an actual CORS
// failure, which is why the real cause took this long to find.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Public embed routes — allow any origin (widget is embedded on installer sites)
const publicCors = cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'] });
app.use('/api/calculate', publicCors);
app.use('/api/installer/:id/public', publicCors);
// Leads API — open CORS, authenticated by API key
app.use('/api/leads', publicCors);

// All other routes — restrict to known origins. Scoped with a path check
// (instead of a bare app.use(cors(...)), which has no path and therefore
// runs on EVERY request, including the public ones above) -- a path-less
// CORS middleware here previously ran again on /api/calculate and
// /api/leads right after their own open-origin middleware, and could
// override the "allow any origin" policy those routes actually need
// (the whole point of them: a widget embedded on an installer's own site,
// a domain that will never be in this hardcoded allowlist). This is what
// caused a hard CORS error in the browser on the public calculator.
const isPublicCorsRoute = (path) =>
  path.startsWith('/api/calculate') || path.startsWith('/api/leads') || /^\/api\/installer\/[^/]+\/public/.test(path);
const restrictedCors = cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/,
    'https://solarcostpredictor.com',
    'https://www.solarcostpredictor.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
app.use((req, res, next) => {
  if (isPublicCorsRoute(req.path)) return next();
  return restrictedCors(req, res, next);
});

// Rate limiting — 60 req/min per IP
app.use('/api/calculate', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stripe webhook — raw body MUST come BEFORE express.json()
app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), subscriptionRouter.webhookHandler);

app.use(express.json({ limit: '10kb' }));

// Auth routes
app.use('/api/auth', authRouter);

// Calculation routes
app.use('/api/calculate', calculateRouter);

// Public installer config (no auth) — registered BEFORE the auth-protected router
app.get('/api/installer/:id/public', async (req, res) => {
  try {
    const config = (await getInstallerConfig(req.params.id)) || DEFAULT_INSTALLER_CONFIG;
    const { companyName, systemName, primaryColor, accentColor, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates } = config;
    const sub = computeSubscriptionStatus(config);
    res.json({ success: true, data: { companyName, systemName, primaryColor, accentColor, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates, paused: !sub.active, trialDaysLeft: sub.daysLeft } });
  } catch {
    res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
  }
});

// Login-error disambiguation (AuthPage.js) -- Supabase returns a generic
// 400 "Invalid login credentials" for both a wrong password AND a
// nonexistent account, by design (a login form shouldn't itself reveal
// which emails are registered). This lookup is what lets the login screen
// give a more specific, still safe-to-show message. Unauthenticated by
// necessity -- it runs before the person has a session -- so it must stay
// registered ahead of the requireAuth-protected /api/installer mount below.
// NOTE: verify this against a real Supabase project once SUPABASE_URL /
// SUPABASE_SERVICE_ROLE_KEY are actually configured -- the GoTrue admin
// API's exact `email` filter support has varied across versions.
app.get('/api/installer/check-email-exists', async (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!email || !serviceKey) return res.json({ success: true, exists: true }); // fail toward the safer, more generic message
  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
    const { data } = await axios.get(`${supabaseUrl}/auth/v1/admin/users`, {
      params: { email },
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const users = Array.isArray(data) ? data : data?.users || [];
    const exists = users.some(u => (u.email || '').toLowerCase() === email);
    res.json({ success: true, exists });
  } catch (err) {
    console.warn('check-email-exists lookup failed:', err.message);
    res.json({ success: true, exists: true });
  }
});

// Auth-protected routes
app.use('/api/installer', requireAuth, installerRouter);
app.use('/api/subscription', requireAuth, subscriptionRouter);

// Leads API — API key authenticated (no session required)
app.use('/api/leads', leadsRouter);

// Internal "Run an Estimate" tab — email a freshly-computed estimate to a
// customer. Session-authenticated (the installer themselves), not API-key.
app.use('/api/estimate-share', requireAuth, estimateShareRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Lifecycle email + account-deletion scheduler. A plain setInterval, not a
// real cron, since this runs as a single always-on Railway service -- each
// check also runs once immediately at boot so a restart doesn't leave a
// due reminder waiting up to an hour.
const HOUR_MS = 60 * 60 * 1000;
function runScheduledChecks() {
  checkTrialReminders().catch(err => console.error('checkTrialReminders failed:', err.message));
  checkActivationReminders().catch(err => console.error('checkActivationReminders failed:', err.message));
  checkPendingDeletions().catch(err => console.error('checkPendingDeletions failed:', err.message));
}
runScheduledChecks();
setInterval(runScheduledChecks, HOUR_MS);

app.listen(PORT, () => {
  console.log(`Solar Calculator API running on port ${PORT}`);
});

module.exports = app;
