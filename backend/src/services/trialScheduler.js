// Scans every installer config once per run (there's no per-installer cron
// or webhook for any of these -- see each function below) to find accounts
// due for a lifecycle email, or a scheduled account deletion whose grace
// period has elapsed. Called on an hourly setInterval from index.js, same
// pattern as cleanestimator's trialScheduler.js.
const { listAllInstallerConfigs, saveInstallerConfig, executeAccountDeletion } = require('../routes/installer');
const { sendTrialCheckinEmail, sendActivationReminderEmail } = require('./email');

const DAY_MS = 24 * 60 * 60 * 1000;

// Day-7 "have you run your first estimate yet?" check-in. Handles both a
// legacy no-card trial (trialStartedAt set, never touched Stripe) and the
// current Stripe-managed trial (stripeSubscriptionId + status==='trialing'
// + currentPeriodEnd), since the two compute "days elapsed" differently.
// Sent once, deduped via trialCheckin1EmailSentAt.
async function checkTrialReminders() {
  let rows;
  try {
    rows = await listAllInstallerConfigs();
  } catch (err) {
    console.warn('checkTrialReminders: failed to list installer configs:', err.message);
    return;
  }

  for (const { installerId, config } of rows) {
    const sub = config?.subscription;
    if (!sub || !config?.email || sub.trialCheckin1EmailSentAt) continue;

    let daysElapsed = null;
    if (sub.stripeSubscriptionId && sub.status === 'trialing' && sub.currentPeriodEnd) {
      // A 30-day Stripe trial's start is 30 days before its end.
      daysElapsed = 30 - (new Date(sub.currentPeriodEnd).getTime() - Date.now()) / DAY_MS;
    } else if (!sub.stripeSubscriptionId && sub.trialStartedAt) {
      daysElapsed = (Date.now() - new Date(sub.trialStartedAt).getTime()) / DAY_MS;
    }
    if (daysElapsed === null || daysElapsed < 7 || daysElapsed > 30) continue;

    try {
      await sendTrialCheckinEmail({ to: config.email, companyName: config.companyName });
      config.subscription.trialCheckin1EmailSentAt = new Date().toISOString();
      await saveInstallerConfig(installerId, config);
    } catch (err) {
      console.warn(`checkTrialReminders: failed for installer ${installerId}:`, err.message);
    }
  }
}

// Nudges accounts that signed up but never finished the Stripe checkout
// step (status stays 'requires_trial_setup' until they do), 12+ hours
// after the config row was first created. Sent once, deduped via
// activationReminderEmailSentAt.
async function checkActivationReminders() {
  let rows;
  try {
    rows = await listAllInstallerConfigs();
  } catch (err) {
    console.warn('checkActivationReminders: failed to list installer configs:', err.message);
    return;
  }

  const CUTOFF_MS = 12 * 60 * 60 * 1000;
  for (const { installerId, config } of rows) {
    const sub = config?.subscription;
    if (!sub || !config?.email || sub.activationReminderEmailSentAt) continue;
    if (sub.status !== null && sub.status !== undefined) continue; // already past requires_trial_setup
    if (sub.trialType !== 'stripe') continue; // legacy no-card accounts don't need this nudge
    if (!config.createdAt) continue; // no timestamp to compare against -- skip rather than guess
    if (Date.now() - new Date(config.createdAt).getTime() < CUTOFF_MS) continue;

    try {
      await sendActivationReminderEmail({ to: config.email, companyName: config.companyName });
      config.subscription.activationReminderEmailSentAt = new Date().toISOString();
      await saveInstallerConfig(installerId, config);
    } catch (err) {
      console.warn(`checkActivationReminders: failed for installer ${installerId}:`, err.message);
    }
  }
}

// Finalizes account deletions whose 30-day grace period (set by
// POST /api/installer/account/schedule-deletion) has elapsed.
async function checkPendingDeletions() {
  let rows;
  try {
    rows = await listAllInstallerConfigs();
  } catch (err) {
    console.warn('checkPendingDeletions: failed to list installer configs:', err.message);
    return;
  }

  for (const { installerId, config } of rows) {
    if (!config?.pendingDeletionAt) continue;
    if (new Date(config.pendingDeletionAt).getTime() > Date.now()) continue;
    try {
      await executeAccountDeletion(installerId);
      console.log(`checkPendingDeletions: deleted installer ${installerId} (grace period elapsed)`);
    } catch (err) {
      console.warn(`checkPendingDeletions: failed to delete installer ${installerId}:`, err.message);
    }
  }
}

module.exports = { checkTrialReminders, checkActivationReminders, checkPendingDeletions };
