const express = require('express');
const router = express.Router();
const { calculateSolarEstimate } = require('../services/solarCalculation');

// POST /api/calculate
router.post('/', async (req, res) => {
  const { monthlyBill, zip, state, homeType, sunExposure, battery, equipmentTier, roofType, installerConfig } = req.body;

  // Validate required inputs
  const errors = [];
  if (!monthlyBill || isNaN(monthlyBill) || monthlyBill < 20 || monthlyBill > 2000) {
    errors.push('monthlyBill must be between 20 and 2000');
  }
  if (!state && !zip) {
    errors.push('state or zip is required');
  }
  if (!['full', 'partial', 'mostly_shade'].includes(sunExposure)) {
    errors.push('sunExposure must be full, partial, or mostly_shade');
  }
  if (!['none', 'one', 'two'].includes(battery)) {
    errors.push('battery must be none, one, or two');
  }
  if (!['basic', 'standard', 'premium'].includes(equipmentTier)) {
    errors.push('equipmentTier must be basic, standard, or premium');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const result = await calculateSolarEstimate(
      {
        monthlyBill: parseFloat(monthlyBill),
        zip: zip || null,
        state: state || null,
        homeType: homeType || 'house',
        sunExposure,
        battery,
        equipmentTier,
        roofType: roofType || 'asphalt',
      },
      installerConfig || {}
    );
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Calculation error:', err);
    res.status(500).json({ success: false, error: 'Calculation failed. Please try again.' });
  }
});

// GET /api/calculate/rates — return electricity rates and sun hours for frontend dropdowns
router.get('/rates', (req, res) => {
  const { STATE_ELECTRICITY_RATES, STATE_SUN_HOURS } = require('../config/defaults');
  res.json({ success: true, data: { rates: STATE_ELECTRICITY_RATES, sunHours: STATE_SUN_HOURS } });
});

module.exports = router;
