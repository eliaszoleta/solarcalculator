// Lets a logged-in installer email one freshly-computed internal estimate
// to a customer -- the "Run an Estimate" dashboard tab's "Email to Customer"
// button. Separate from POST /api/calculate's public flow: that path saves
// a lead and is meant for a stranger finding the embedded widget on the
// installer's own site; this one is the installer looking at their own
// number and choosing to send it to someone, so nothing is saved as a lead.
//
// Re-runs calculateSolarEstimate() server-side from the raw inputs against
// the installer's real saved pricing config, instead of trusting a
// client-supplied result object -- so the emailed numbers are always the
// authoritative calculation, not whatever the browser happened to have.
const express = require('express');
const router = express.Router();
const { calculateSolarEstimate } = require('../services/solarCalculation');
const { getInstallerConfig } = require('./installer');
const { sendSolarEstimateEmail } = require('../services/email');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/estimate-share
router.post('/', async (req, res) => {
  const installerId = req.user.id;
  const {
    to, clientName, monthlyBill, zip, state, homeType,
    sunExposure, roofType, battery, equipmentTier,
  } = req.body || {};
  const trimmedClientName = (clientName || '').trim().slice(0, 100) || null;

  if (!to || !EMAIL_RE.test(to)) return res.status(400).json({ success: false, error: 'A valid email address is required' });
  if (!monthlyBill || isNaN(monthlyBill) || monthlyBill < 20 || monthlyBill > 2000) {
    return res.status(400).json({ success: false, error: 'monthlyBill must be between 20 and 2000' });
  }
  if (!zip && !state) return res.status(400).json({ success: false, error: 'zip or state is required' });
  if (!['full', 'partial', 'mostly_shade'].includes(sunExposure)) {
    return res.status(400).json({ success: false, error: 'sunExposure must be full, partial, or mostly_shade' });
  }
  if (!['none', 'one', 'two'].includes(battery)) {
    return res.status(400).json({ success: false, error: 'battery must be none, one, or two' });
  }

  try {
    const installerConfig = (await getInstallerConfig(installerId)) || {};
    const result = await calculateSolarEstimate(
      {
        monthlyBill: parseFloat(monthlyBill),
        zip: zip || null,
        state: state || null,
        homeType: homeType || 'house',
        sunExposure,
        battery,
        equipmentTier: equipmentTier || 'standard',
        roofType: roofType || 'asphalt',
      },
      installerConfig
    );

    const sent = await sendSolarEstimateEmail({
      to,
      clientName: trimmedClientName,
      result,
      installerConfig,
    });

    if (!sent) return res.status(502).json({ success: false, error: 'Failed to send the email. Please try again in a moment.' });
    res.json({ success: true });
  } catch (err) {
    console.error('estimate-share error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to share this estimate' });
  }
});

module.exports = router;
