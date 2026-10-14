const axios = require('axios');

// "Email to Customer" on the installer dashboard's internal "Run an
// Estimate" tab. Sends via Resend (a transactional email API) for the same
// reason cleanestimator does: purpose-built for "app sends transactional
// email" rather than raw SMTP (often blocked on platforms like Railway).
//
// Styled plain (no gradient blocks, no big colored CTA buttons) so it reads
// like a quote/receipt instead of a marketing email -- that's what keeps
// transactional mail out of Gmail's Promotions tab.
const RESEND_API_BASE = 'https://api.resend.com';

function fmtDollar(n) {
  return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(n || 0));
}

function buildText({ clientName, result, installerConfig }) {
  const { system, incentives, savings } = result;
  const company = installerConfig?.companyName || 'Solar Cost Predictor';
  const lines = [];
  lines.push(`Solar Savings Estimate${clientName ? ` for ${clientName}` : ''}`, '');
  lines.push(`System size: ${system.sizeKw} kW (${system.panelCount} panels)`);
  lines.push(`Estimated installed cost: ${fmtDollar(incentives.netCostLow)} – ${fmtDollar(incentives.netCostHigh)}`);
  lines.push(`Monthly savings: ${fmtDollar(savings.monthly)}/mo`);
  lines.push(`Annual savings: ${fmtDollar(savings.annual)}`);
  lines.push(`30-year savings: ${fmtDollar(savings.thirtyYear)}`);
  lines.push(`Payback period: ${savings.paybackYears ? `${savings.paybackYears} years` : 'N/A'}`);
  lines.push('');
  if (installerConfig?.ctaPhone) lines.push(`Questions? Call ${company} at ${installerConfig.ctaPhone}.`);
  else lines.push(`Questions? Contact ${company}.`);
  lines.push('', 'This estimate is for informational purposes only. Actual prices vary based on a full site assessment.');
  return lines.join('\n');
}

function buildHtml({ clientName, result, installerConfig }) {
  const { system, incentives, savings } = result;
  const company = installerConfig?.companyName || 'Solar Cost Predictor';
  const row = (label, value) => `<tr><td style="padding:6px 0;color:#555555;font-size:13px;">${label}</td><td style="padding:6px 0;color:#111111;font-size:13px;font-weight:600;text-align:right;">${value}</td></tr>`;

  return `
    <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#111111;">
      <p style="font-size:15px;margin:0 0 4px;">Solar Savings Estimate</p>
      ${clientName ? `<p style="font-size:13px;color:#666666;margin:0 0 16px;">For: <strong style="color:#111111;">${clientName}</strong></p>` : '<div style="margin-bottom:16px;"></div>'}
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #eeeeee;border-bottom:1px solid #eeeeee;">
        ${row('System size', `${system.sizeKw} kW (${system.panelCount} panels)`)}
        ${row('Installed cost', `${fmtDollar(incentives.netCostLow)} – ${fmtDollar(incentives.netCostHigh)}`)}
        ${row('Monthly savings', `${fmtDollar(savings.monthly)}/mo`)}
        ${row('Annual savings', fmtDollar(savings.annual))}
        ${row('30-year savings', fmtDollar(savings.thirtyYear))}
        ${row('Payback period', savings.paybackYears ? `${savings.paybackYears} years` : 'N/A')}
      </table>
      <p style="font-size:13px;color:#555555;margin:16px 0 0;">
        ${installerConfig?.ctaPhone ? `Questions? Call ${company} at ${installerConfig.ctaPhone}.` : `Questions? Contact ${company}.`}
      </p>
      <p style="font-size:11px;color:#999999;margin:20px 0 0;line-height:1.5;">
        This estimate is for informational purposes only. Actual prices vary based on a full site assessment.
      </p>
    </div>
  `;
}

async function sendSolarEstimateEmail({ to, clientName, result, installerConfig, replyTo }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('sendSolarEstimateEmail skipped: Resend not configured (RESEND_API_KEY)');
    return false;
  }

  const brandName = installerConfig?.companyName || 'Solar Cost Predictor';
  const fromAddress = RESEND_FROM_EMAIL || 'info@solarcostpredictor.com';

  try {
    await axios.post(
      `${RESEND_API_BASE}/emails`,
      {
        from: `${brandName} <${fromAddress}>`,
        to: [to],
        reply_to: replyTo || undefined,
        subject: clientName ? `Solar estimate for ${clientName}` : 'Your solar savings estimate is ready',
        html: buildHtml({ clientName, result, installerConfig }),
        text: buildText({ clientName, result, installerConfig }),
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.warn('sendSolarEstimateEmail failed:', err.response?.data ? JSON.stringify(err.response.data) : err.message);
    return false;
  }
}

module.exports = { sendSolarEstimateEmail };
