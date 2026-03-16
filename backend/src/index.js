require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const calculateRouter = require('./routes/calculate');
const installerRouter = require('./routes/installer');
const authRouter = require('./routes/auth');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/,
    'https://mysolarwidget.com',
    'https://www.mysolarwidget.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — 60 req/min per IP
app.use('/api/calculate', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/calculate', calculateRouter);
// Public read-only endpoint for embedded calculator (no auth)
app.get('/api/installer/:id/public', async (req, res) => {
  const { DEFAULT_INSTALLER_CONFIG } = require('./config/defaults');
  const { getInstallerConfig } = require('./routes/installer');
  try {
    const config = (await getInstallerConfig(req.params.id)) || DEFAULT_INSTALLER_CONFIG;
    res.json({ success: true, data: {
      companyName: config.companyName,
      ctaHeadline: config.ctaHeadline,
      ctaSubtext: config.ctaSubtext,
      ctaButtonText: config.ctaButtonText,
      ctaPhone: config.ctaPhone,
      ctaButtonUrl: config.ctaButtonUrl,
      primaryColor: config.primaryColor,
    }});
  } catch {
    res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
  }
});
app.use('/api/installer', requireAuth, installerRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Solar Calculator API running on port ${PORT}`);
});

module.exports = app;
