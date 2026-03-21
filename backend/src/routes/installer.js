const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { DEFAULT_INSTALLER_CONFIG } = require('../config/defaults');
const { computeSubscriptionStatus } = require('./subscription');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fallback file path for when service role key is not configured
const DATA_FILE = path.join(__dirname, '../../data/installer-configs.json');

// --- Supabase helpers ---

function dbHeaders() {
  const key = SERVICE_KEY();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

async function dbGet(installerId) {
  const res = await axios.get(
    `${SUPABASE_URL}/rest/v1/installer_configs?installer_id=eq.${encodeURIComponent(installerId)}&select=config`,
    { headers: dbHeaders() }
  );
  return res.data?.[0]?.config || null;
}

async function dbUpsert(installerId, config) {
  await axios.post(
    `${SUPABASE_URL}/rest/v1/installer_configs`,
    { installer_id: installerId, config, updated_at: new Date().toISOString() },
    { headers: { ...dbHeaders(), Prefer: 'resolution=merge-duplicates' } }
  );
}

// --- File-based fallback (used when SUPABASE_SERVICE_ROLE_KEY is not set) ---

function fileLoad() {
  try {
    return new Map(Object.entries(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))));
  } catch {
    return new Map();
  }
}

function fileSave(map) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(Object.fromEntries(map), null, 2), 'utf8');
}

const fileCache = fileLoad();

// --- Unified get/save ---

async function getInstallerConfig(installerId) {
  if (SERVICE_KEY()) {
    return (await dbGet(installerId)) || null;
  }
  return fileCache.get(installerId) || null;
}

async function saveInstallerConfig(installerId, config) {
  if (SERVICE_KEY()) {
    await dbUpsert(installerId, config);
  } else {
    fileCache.set(installerId, config);
    fileSave(fileCache);
  }
}

// --- Routes ---

// GET /api/installer/:id
router.get('/:id', async (req, res) => {
  try {
    let config = await getInstallerConfig(req.params.id);
    if (!config) {
      // First access — initialise config with trial start
      config = {
        ...DEFAULT_INSTALLER_CONFIG,
        subscription: {
          trialStartedAt: new Date().toISOString(),
          status: 'trialing',
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          currentPeriodEnd: null,
        },
      };
      await saveInstallerConfig(req.params.id, config);
    } else if (!config.subscription?.trialStartedAt) {
      // Existing account without trial date — backfill
      config.subscription = {
        ...(config.subscription || {}),
        trialStartedAt: new Date().toISOString(),
        status: config.subscription?.status || 'trialing',
      };
      await saveInstallerConfig(req.params.id, config);
    }
    res.json({ success: true, data: config });
  } catch (err) {
    console.error('Failed to load installer config:', err.message);
    res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
  }
});

// PUT /api/installer/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const allowedFields = [
    'minSystemSize', 'maxSystemSize', 'pricePerWatt', 'serviceStates', 'batteries',
    'roofSurcharges', 'federalTaxCredit', 'panelWattage',
    'systemName', 'companyName', 'primaryColor', 'accentColor', 'formBgColor',
    'frameHeight',
    'ctaHeadline', 'ctaSubtext', 'ctaButtonText', 'ctaPhone', 'ctaButtonUrl',
  ];

  try {
    const current = (await getInstallerConfig(id)) || { ...DEFAULT_INSTALLER_CONFIG };
    const updated = { ...current };

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updated[field] = updates[field];
      }
    }

    await saveInstallerConfig(id, updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to save installer config:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save settings' });
  }
});

// POST /api/installer
router.post('/', async (req, res) => {
  const id = `inst_${Date.now()}`;
  const config = { ...DEFAULT_INSTALLER_CONFIG, ...req.body, id };
  try {
    await saveInstallerConfig(id, config);
    res.status(201).json({ success: true, data: { id, config } });
  } catch (err) {
    console.error('Failed to create installer config:', err.message);
    res.status(500).json({ success: false, error: 'Failed to create config' });
  }
});

// GET /api/installer/:id/public
router.get('/:id/public', async (req, res) => {
  try {
    const config = (await getInstallerConfig(req.params.id)) || DEFAULT_INSTALLER_CONFIG;
    const { companyName, systemName, primaryColor, accentColor, formBgColor, frameHeight, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates } = config;
    const sub = computeSubscriptionStatus(config);
    res.json({ success: true, data: { companyName, systemName, primaryColor, accentColor, formBgColor, frameHeight, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates, paused: !sub.active, trialDaysLeft: sub.daysLeft } });
  } catch (err) {
    console.error('Failed to load public config:', err.message);
    res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
  }
});

// GET /api/installer/:id/defaults
router.get('/:id/defaults', (req, res) => {
  res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
});

module.exports = router;
module.exports.getInstallerConfig = getInstallerConfig;
