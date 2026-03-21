const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getInstallerConfig } = require('./installer');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

function dbHeaders() {
  const key = SERVICE_KEY();
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
}

// Resolve installer ID from API key by scanning installer_configs via Supabase JSONB filter
async function findInstallerByApiKey(apiKey) {
  if (!SERVICE_KEY()) return null;
  const res = await axios.get(
    `${SUPABASE_URL}/rest/v1/installer_configs?select=installer_id,config&config->>apiKey=eq.${encodeURIComponent(apiKey)}`,
    { headers: dbHeaders() }
  );
  return res.data?.[0] || null;
}

/**
 * GET /api/leads
 *
 * Returns all active leads for the authenticated installer.
 *
 * Authentication: X-API-Key: sk_... header  OR  Authorization: Bearer sk_... header
 *
 * Query params:
 *   since=<ISO date>   — only return leads created after this date (for real-time polling)
 *   limit=<number>     — max results (default 500)
 */
router.get('/', async (req, res) => {
  const apiKey =
    req.headers['x-api-key'] ||
    (req.headers.authorization?.startsWith('Bearer sk_') ? req.headers.authorization.slice(7) : null);

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required. Send it as X-API-Key header or Authorization: Bearer <key>.',
    });
  }

  try {
    // Validate API key and find the installer
    const row = await findInstallerByApiKey(apiKey);
    if (!row) {
      return res.status(401).json({ success: false, error: 'Invalid API key.' });
    }

    const installerId = row.installer_id;
    const since = req.query.since;
    const limit = Math.min(parseInt(req.query.limit) || 500, 1000);

    let url = `${SUPABASE_URL}/rest/v1/leads?select=*&installer_id=eq.${encodeURIComponent(installerId)}&deleted_at=is.null&order=created_at.desc&limit=${limit}`;
    if (since) url += `&created_at=gte.${encodeURIComponent(since)}`;

    const leadsRes = await axios.get(url, { headers: dbHeaders() });
    res.json({ success: true, installer_id: installerId, count: leadsRes.data.length, data: leadsRes.data || [] });
  } catch (err) {
    console.error('Leads API error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

module.exports = router;
