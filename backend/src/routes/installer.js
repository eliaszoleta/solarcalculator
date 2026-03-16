const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { DEFAULT_INSTALLER_CONFIG } = require('../config/defaults');

const DATA_FILE = path.join(__dirname, '../../data/installer-configs.json');

// Load persisted configs from disk, fall back to empty object on first run
function loadConfigs() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return new Map(Object.entries(JSON.parse(raw)));
  } catch {
    return new Map();
  }
}

function saveConfigs(map) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(Object.fromEntries(map), null, 2), 'utf8');
}

const installerConfigs = loadConfigs();

// GET /api/installer/:id — get installer config
router.get('/:id', (req, res) => {
  const config = installerConfigs.get(req.params.id) || DEFAULT_INSTALLER_CONFIG;
  res.json({ success: true, data: config });
});

// PUT /api/installer/:id — update installer config
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Only allow updating known config fields
  const allowedFields = [
    'minSystemSize', 'maxSystemSize', 'pricePerWatt', 'serviceStates', 'batteries',
    'roofSurcharges', 'federalTaxCredit', 'panelWattage',
    'systemName', 'companyName', 'primaryColor', 'accentColor',
    'ctaHeadline', 'ctaSubtext', 'ctaButtonText', 'ctaPhone', 'ctaButtonUrl',
  ];

  const current = installerConfigs.get(id) || { ...DEFAULT_INSTALLER_CONFIG };
  const updated = { ...current };

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updated[field] = updates[field];
    }
  }

  installerConfigs.set(id, updated);
  saveConfigs(installerConfigs);
  res.json({ success: true, data: updated });
});

// POST /api/installer — create new installer config
router.post('/', (req, res) => {
  const id = `inst_${Date.now()}`;
  const config = { ...DEFAULT_INSTALLER_CONFIG, ...req.body, id };
  installerConfigs.set(id, config);
  saveConfigs(installerConfigs);
  res.status(201).json({ success: true, data: { id, config } });
});

// GET /api/installer/:id/public — return branding-only config (no auth required, safe for embed)
router.get('/:id/public', (req, res) => {
  const config = installerConfigs.get(req.params.id) || DEFAULT_INSTALLER_CONFIG;
  const { companyName, systemName, primaryColor, accentColor, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates } = config;
  res.json({ success: true, data: { companyName, systemName, primaryColor, accentColor, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl, serviceStates } });
});

// GET /api/installer/:id/defaults — return default config template
router.get('/:id/defaults', (req, res) => {
  res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
});

module.exports = router;
module.exports.installerConfigs = installerConfigs;
