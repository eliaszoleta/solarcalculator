const express = require('express');
const router = express.Router();
const { DEFAULT_INSTALLER_CONFIG } = require('../config/defaults');

// In-memory store for demo purposes
// In production, replace with a database
const installerConfigs = new Map();

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
    'pricePerWatt', 'minSystemSize', 'maxSystemSize', 'laborCost',
    'permitCost', 'inverterCost', 'profitMargin', 'batteries',
    'roofSurcharges', 'equipment', 'federalTaxCredit', 'panelWattage',
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
  res.json({ success: true, data: updated });
});

// POST /api/installer — create new installer config
router.post('/', (req, res) => {
  const id = `inst_${Date.now()}`;
  const config = { ...DEFAULT_INSTALLER_CONFIG, ...req.body, id };
  installerConfigs.set(id, config);
  res.status(201).json({ success: true, data: { id, config } });
});

// GET /api/installer/:id/public — return branding-only config (no auth required, safe for embed)
router.get('/:id/public', (req, res) => {
  const config = installerConfigs.get(req.params.id) || DEFAULT_INSTALLER_CONFIG;
  const { companyName, systemName, primaryColor, accentColor, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl } = config;
  res.json({ success: true, data: { companyName, systemName, primaryColor, accentColor, ctaHeadline, ctaSubtext, ctaButtonText, ctaPhone, ctaButtonUrl } });
});

// GET /api/installer/:id/defaults — return default config template
router.get('/:id/defaults', (req, res) => {
  res.json({ success: true, data: DEFAULT_INSTALLER_CONFIG });
});

module.exports = router;
module.exports.installerConfigs = installerConfigs;
