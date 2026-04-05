require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const calculateRouter = require('./routes/calculate');
const installerRouter = require('./routes/installer');
const authRouter = require('./routes/auth');
const subscriptionRouter = require('./routes/subscription');
const leadsRouter = require('./routes/leads');
const { requireAuth } = require('./middleware/auth');
const { getInstallerConfig } = require('./routes/installer');
const { computeSubscriptionStatus } = require('./routes/subscription');
const { DEFAULT_INSTALLER_CONFIG } = require('./config/defaults');

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());

// Public embed routes — allow any origin (widget is embedded on installer sites)
const publicCors = cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'] });
app.use('/api/calculate', publicCors);
app.use('/api/installer/:id/public', publicCors);
// Leads API — open CORS, authenticated by API key
app.use('/api/leads', publicCors);

// All other routes — restrict to known origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/,
    'https://mysolarwidget.com',
    'https://www.mysolarwidget.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

// Auth-protected routes
app.use('/api/installer', requireAuth, installerRouter);
app.use('/api/subscription', requireAuth, subscriptionRouter);

// Leads API — API key authenticated (no session required)
app.use('/api/leads', leadsRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Solar Calculator API running on port ${PORT}`);
});

module.exports = app;
