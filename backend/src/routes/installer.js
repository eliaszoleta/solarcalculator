const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DEFAULT_INSTALLER_CONFIG } = require('../config/defaults');

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

// Used by trialScheduler.js, which has to scan every installer's config to
// find the ones due for an activation reminder, a trial check-in, or a
// scheduled deletion -- there's no per-installer webhook/cron for any of
// those, so it has to look across all rows each pass.
async function listAllInstallerConfigs() {
  if (!SERVICE_KEY()) return [];
  const res = await axios.get(
    `${SUPABASE_URL}/rest/v1/installer_configs?select=installer_id,config`,
    { headers: dbHeaders() }
  );
  return (res.data || []).map(row => ({ installerId: row.installer_id, config: row.config }));
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
      // First access — new account requires Stripe checkout to start 30-day trial (CC required)
      // email is captured here (not just at signup) so the trial/activation
      // scheduler and lifecycle emails have somewhere to send to without a
      // separate Supabase admin lookup per account.
      config = {
        ...DEFAULT_INSTALLER_CONFIG,
        email: req.user.email,
        createdAt: new Date().toISOString(),
        subscription: {
          trialType: 'stripe',
          status: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          currentPeriodEnd: null,
        },
      };
      await saveInstallerConfig(req.params.id, config);
    } else if (!config.email) {
      // Backfill for accounts created before `email` was captured here.
      config.email = req.user.email;
      await saveInstallerConfig(req.params.id, config);
    }
    if (!config.subscription?.trialStartedAt && config.subscription?.trialType !== 'stripe') {
      // Legacy backfill: existing accounts missing trialStartedAt (keep 30-day free trial)
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
    'borderRadius', 'frameHeight', 'fontFamily',
    'ctaHeadline', 'ctaSubtext', 'ctaButtonText', 'ctaPhone', 'ctaButtonUrl',
    'customSteps',
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
    const { companyName, systemName, primaryColor, accentColor, formBgColor, borderRadius, frameHeight, fontFamily, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates, customSteps } = config;
    const { computeSubscriptionStatus } = require('./subscription');
    const sub = computeSubscriptionStatus(config);
    res.json({ success: true, data: { companyName, systemName, primaryColor, accentColor, formBgColor, borderRadius, frameHeight, fontFamily, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates, customSteps, paused: !sub.active, trialDaysLeft: sub.daysLeft } });
  } catch (err) {
    console.error('Failed to load public config:', err.message);
    res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
  }
});

// GET /api/installer/:id/defaults
router.get('/:id/defaults', (req, res) => {
  res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
});

// GET /api/installer/:id/api-key — return current API key (masked) or generate one
router.get('/:id/api-key', async (req, res) => {
  try {
    const config = (await getInstallerConfig(req.params.id)) || { ...DEFAULT_INSTALLER_CONFIG };
    if (!config.apiKey) {
      config.apiKey = `sk_${crypto.randomBytes(24).toString('hex')}`;
      await saveInstallerConfig(req.params.id, config);
    }
    res.json({ success: true, data: { apiKey: config.apiKey } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve API key' });
  }
});

// POST /api/installer/:id/api-key/regenerate — generate a fresh API key
router.post('/:id/api-key/regenerate', async (req, res) => {
  try {
    const config = (await getInstallerConfig(req.params.id)) || { ...DEFAULT_INSTALLER_CONFIG };
    config.apiKey = `sk_${crypto.randomBytes(24).toString('hex')}`;
    await saveInstallerConfig(req.params.id, config);
    res.json({ success: true, data: { apiKey: config.apiKey } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to regenerate API key' });
  }
});

// Actually performs the delete -- leads, config, then the Supabase auth
// user last (so a failure partway through never leaves an auth user with
// no way to look up their own now-deleted data). Called both by the
// scheduler once an account's grace period elapses, and available for a
// future admin "delete now" override if one is ever added.
async function executeAccountDeletion(installerId) {
  if (!SERVICE_KEY()) return;
  await axios.delete(
    `${SUPABASE_URL}/rest/v1/leads?installer_id=eq.${encodeURIComponent(installerId)}`,
    { headers: dbHeaders() }
  ).catch(e => console.warn('Delete leads warning:', e.message));

  await axios.delete(
    `${SUPABASE_URL}/rest/v1/installer_configs?installer_id=eq.${encodeURIComponent(installerId)}`,
    { headers: dbHeaders() }
  ).catch(e => console.warn('Delete config warning:', e.message));

  await axios.delete(
    `${SUPABASE_URL}/auth/v1/admin/users/${installerId}`,
    { headers: { apikey: SERVICE_KEY(), Authorization: `Bearer ${SERVICE_KEY()}` } }
  );
}

// POST /api/installer/feedback — "Before you go" cancellation feedback,
// submitted (optionally) before an installer is redirected to the Stripe
// Billing Portal. Both fields optional; an all-empty submission is a
// no-op. Fails open on any DB error -- a failed/empty feedback save
// should never block billing.
router.post('/feedback', async (req, res) => {
  const installerId = req.user.id;
  const reason = (req.body?.reason || '').trim().slice(0, 200) || null;
  const note = (req.body?.note || '').trim().slice(0, 2000) || null;
  if (!reason && !note) return res.json({ success: true, skipped: true });

  try {
    if (SERVICE_KEY()) {
      await axios.post(
        `${SUPABASE_URL}/rest/v1/cancellation_feedback`,
        { installer_id: installerId, reason, note },
        { headers: dbHeaders() }
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.warn('Save cancellation feedback warning:', err.message);
    res.json({ success: true }); // fails open -- never blocks the billing redirect
  }
});

// POST /api/installer/account/schedule-deletion — 30-day grace period,
// mirrors cleanestimator's account deletion: the calculator pauses
// immediately (ActivationGate-equivalent on the frontend checks
// pendingDeletionAt), but nothing is actually deleted until the grace
// period elapses, so a change of mind just means canceling the schedule.
router.post('/account/schedule-deletion', async (req, res) => {
  const installerId = req.user.id;
  try {
    const config = (await getInstallerConfig(installerId)) || { ...DEFAULT_INSTALLER_CONFIG };
    const scheduledFor = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    config.pendingDeletionAt = scheduledFor;
    await saveInstallerConfig(installerId, config);
    const { sendAccountDeletionScheduledEmail } = require('../services/email');
    const email = config.email || req.user.email;
    if (email) sendAccountDeletionScheduledEmail({ to: email, companyName: config.companyName, scheduledFor }).catch(() => {});
    res.json({ success: true, data: { pendingDeletionAt: scheduledFor } });
  } catch (err) {
    console.error('Schedule deletion error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to schedule account deletion. Please try again.' });
  }
});

// POST /api/installer/account/cancel-deletion
router.post('/account/cancel-deletion', async (req, res) => {
  const installerId = req.user.id;
  try {
    const config = (await getInstallerConfig(installerId)) || {};
    delete config.pendingDeletionAt;
    await saveInstallerConfig(installerId, config);
    res.json({ success: true });
  } catch (err) {
    console.error('Cancel deletion error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to cancel account deletion. Please try again.' });
  }
});

module.exports = router;
module.exports.getInstallerConfig = getInstallerConfig;
module.exports.saveInstallerConfig = saveInstallerConfig;
module.exports.dbHeaders = dbHeaders;
module.exports.listAllInstallerConfigs = listAllInstallerConfigs;
module.exports.executeAccountDeletion = executeAccountDeletion;
