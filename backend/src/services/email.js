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

// Shared low-level sender -- every lifecycle email below (and
// sendSolarEstimateEmail above) funnels through this, so there's exactly
// one place that touches Resend's API, one place that reads the env vars,
// and one place that decides what "failed to send" means.
async function sendViaResend({ to, subject, html, text, replyTo, fromName }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn(`sendViaResend skipped ("${subject}"): Resend not configured (RESEND_API_KEY)`);
    return false;
  }
  const fromAddress = RESEND_FROM_EMAIL || 'info@solarcostpredictor.com';
  try {
    await axios.post(
      `${RESEND_API_BASE}/emails`,
      {
        from: `${fromName || 'Solar Cost Predictor'} <${fromAddress}>`,
        to: [to],
        reply_to: replyTo || undefined,
        subject,
        html,
        text,
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.warn(`sendViaResend failed ("${subject}"):`, err.response?.data ? JSON.stringify(err.response.data) : err.message);
    return false;
  }
}

async function sendSolarEstimateEmail({ to, clientName, result, installerConfig, replyTo }) {
  return sendViaResend({
    to,
    replyTo,
    fromName: installerConfig?.companyName || 'Solar Cost Predictor',
    subject: clientName ? `Solar estimate for ${clientName}` : 'Your solar savings estimate is ready',
    html: buildHtml({ clientName, result, installerConfig }),
    text: buildText({ clientName, result, installerConfig }),
  });
}

// ─── Lifecycle emails ──────────────────────────────────────────────────
// Plain, receipt-style formatting throughout (no gradient blocks, no big
// colored CTA buttons) -- the same reasoning as the estimate email above:
// this is what keeps transactional mail out of Gmail's Promotions tab.
// None of these are DB-backed/admin-editable templates -- there's no admin
// UI in this app to edit them, so hardcoding them here (same pattern as
// the estimate email) avoids building a template-management system with
// no one to use it.

function plainWrapper(bodyHtml) {
  return `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#111111;">${bodyHtml}</div>`;
}

async function sendInstallerWelcomeEmail({ to, companyName, statusLine }) {
  const greeting = companyName ? `Welcome, ${companyName}.` : 'Welcome to Solar Cost Predictor.';
  const status = statusLine || "Your 30-day free trial has started — you won't be charged until it ends.";
  const html = plainWrapper(`
    <p style="font-size:15px;margin:0 0 12px;">${greeting}</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">${status}</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 10px;">Start on the <strong>Run an Estimate</strong> tab — it prices a job against your own settings, on your screen only. When you're ready for public lead capture too, the <strong>Embed Code</strong> tab gives you a calculator widget for your website, included at no extra cost.</p>
    <p style="font-size:12px;color:#999999;margin:20px 0 0;">Questions? Just reply to this email.</p>
  `);
  const text = `${greeting}\n\n${status}\n\nStart on the Run an Estimate tab -- it prices a job against your own settings, on your screen only. When you're ready for public lead capture too, the Embed Code tab gives you a calculator widget for your website, included at no extra cost.\n\nQuestions? Just reply to this email.`;
  return sendViaResend({ to, subject: 'Your Solar Cost Predictor account is ready', html, text });
}

async function sendActivationReminderEmail({ to, companyName }) {
  const name = companyName || 'there';
  const html = plainWrapper(`
    <p style="font-size:15px;margin:0 0 12px;">Hi ${name},</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">You created a Solar Cost Predictor account, but the checkout step to start your 30-day free trial never finished — your calculator is paused until it does.</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 10px;">A card is required to start the trial, but you won't be charged until it ends, and you can cancel anytime before then.</p>
    <p style="font-size:13.5px;margin:20px 0 0;"><a href="https://www.solarcostpredictor.com/installer?tab=subscription" style="color:#1b4d3e;font-weight:600;">Finish activating your account →</a></p>
  `);
  const text = `Hi ${name},\n\nYou created a Solar Cost Predictor account, but the checkout step to start your 30-day free trial never finished -- your calculator is paused until it does.\n\nA card is required to start the trial, but you won't be charged until it ends, and you can cancel anytime before then.\n\nFinish activating your account: https://www.solarcostpredictor.com/installer?tab=subscription`;
  return sendViaResend({ to, subject: "You're one step away from your free Solar Cost Predictor trial", html, text });
}

async function sendTrialCheckinEmail({ to, companyName }) {
  const name = companyName || 'there';
  const html = plainWrapper(`
    <p style="font-size:15px;margin:0 0 12px;">Hi ${name},</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">You're a week into your Solar Cost Predictor trial — have you run your first estimate yet?</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 10px;">The <strong>Run an Estimate</strong> tab prices a real job against your own settings in under a minute, on your screen only — nothing shown to a customer unless you decide to send it.</p>
    <p style="font-size:13.5px;margin:20px 0 0;"><a href="https://www.solarcostpredictor.com/installer" style="color:#1b4d3e;font-weight:600;">Run an estimate →</a></p>
  `);
  const text = `Hi ${name},\n\nYou're a week into your Solar Cost Predictor trial -- have you run your first estimate yet?\n\nThe Run an Estimate tab prices a real job against your own settings in under a minute, on your screen only -- nothing shown to a customer unless you decide to send it.\n\nRun an estimate: https://www.solarcostpredictor.com/installer`;
  return sendViaResend({ to, subject: 'Have you run your first estimate yet?', html, text });
}

async function sendPaymentFailedEmail({ to, companyName }) {
  const name = companyName || 'there';
  const html = plainWrapper(`
    <p style="font-size:15px;margin:0 0 12px;">Hi ${name},</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">Your most recent Solar Cost Predictor payment didn't go through. Your calculator stays active for now, but please update your payment method soon to avoid an interruption.</p>
    <p style="font-size:13.5px;margin:20px 0 0;"><a href="https://www.solarcostpredictor.com/installer?tab=subscription" style="color:#1b4d3e;font-weight:600;">Update payment method →</a></p>
  `);
  const text = `Hi ${name},\n\nYour most recent Solar Cost Predictor payment didn't go through. Your calculator stays active for now, but please update your payment method soon to avoid an interruption.\n\nUpdate payment method: https://www.solarcostpredictor.com/installer?tab=subscription`;
  return sendViaResend({ to, subject: "Your Solar Cost Predictor payment didn't go through", html, text });
}

async function sendSubscriptionCanceledEmail({ to, companyName }) {
  const name = companyName || 'there';
  const html = plainWrapper(`
    <p style="font-size:15px;margin:0 0 12px;">Hi ${name},</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">Sorry to see you go — your Solar Cost Predictor subscription has ended and your calculator is now paused.</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">If something didn't work for you, we'd genuinely like to know — just reply and tell us what happened.</p>
    <p style="font-size:13.5px;margin:0;"><a href="https://www.solarcostpredictor.com/installer?tab=subscription" style="color:#1b4d3e;font-weight:600;">Restart my subscription →</a></p>
  `);
  const text = `Hi ${name},\n\nSorry to see you go -- your Solar Cost Predictor subscription has ended and your calculator is now paused.\n\nIf something didn't work for you, we'd genuinely like to know -- just reply and tell us what happened.\n\nRestart my subscription: https://www.solarcostpredictor.com/installer?tab=subscription`;
  return sendViaResend({ to, subject: 'Sorry to see you go — your Solar Cost Predictor subscription has ended', html, text });
}

async function sendAccountDeletionScheduledEmail({ to, companyName, scheduledFor }) {
  const name = companyName || 'there';
  const dateStr = scheduledFor ? new Date(scheduledFor).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'in 30 days';
  const html = plainWrapper(`
    <p style="font-size:15px;margin:0 0 12px;">Hi ${name},</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">Your Solar Cost Predictor account is scheduled for deletion on <strong>${dateStr}</strong>. Your calculator is paused immediately, but your data isn't deleted until that date.</p>
    <p style="font-size:13.5px;color:#333333;line-height:1.6;margin:0 0 16px;">Changed your mind? You can cancel the deletion anytime before then from your account settings.</p>
    <p style="font-size:13.5px;margin:0;"><a href="https://www.solarcostpredictor.com/installer?tab=settings" style="color:#1b4d3e;font-weight:600;">Cancel deletion →</a></p>
  `);
  const text = `Hi ${name},\n\nYour Solar Cost Predictor account is scheduled for deletion on ${dateStr}. Your calculator is paused immediately, but your data isn't deleted until that date.\n\nChanged your mind? You can cancel the deletion anytime before then from your account settings.\n\nCancel deletion: https://www.solarcostpredictor.com/installer?tab=settings`;
  return sendViaResend({ to, subject: 'Your Solar Cost Predictor account deletion is scheduled', html, text });
}

module.exports = {
  sendSolarEstimateEmail,
  sendInstallerWelcomeEmail,
  sendActivationReminderEmail,
  sendTrialCheckinEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCanceledEmail,
  sendAccountDeletionScheduledEmail,
};
