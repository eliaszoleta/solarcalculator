const express = require('express');
const router = express.Router();
const { getInstallerConfig, saveInstallerConfig } = require('./installer');

const STRIPE_SECRET_KEY = () => process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = () => process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_PRICE_ID = () => process.env.STRIPE_PRICE_ID;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function getStripe() {
  const key = STRIPE_SECRET_KEY();
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return require('stripe')(key);
}

// POST /api/subscription/checkout — create Stripe checkout session
router.post('/checkout', async (req, res) => {
  const installerId = req.user.id;
  const priceId = STRIPE_PRICE_ID();
  if (!priceId) return res.status(500).json({ success: false, error: 'Stripe pricing not configured' });

  try {
    const stripe = getStripe();
    const config = (await getInstallerConfig(installerId)) || {};
    const existingCustomerId = config.subscription?.stripeCustomerId;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: existingCustomerId || undefined,
      customer_email: existingCustomerId ? undefined : req.user.email,
      metadata: { installerId },
      success_url: `${FRONTEND_URL}/installer?subscribed=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/installer?tab=subscription`,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Failed to create checkout session' });
  }
});

// POST /api/subscription/portal — create Stripe customer portal session
router.post('/portal', async (req, res) => {
  const installerId = req.user.id;
  try {
    const stripe = getStripe();
    const config = (await getInstallerConfig(installerId)) || {};
    const customerId = config.subscription?.stripeCustomerId;
    if (!customerId) return res.status(400).json({ success: false, error: 'No Stripe customer found. Please subscribe first.' });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/installer?tab=subscription`,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Stripe portal error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to open billing portal. Please try again.' });
  }
});

// GET /api/subscription/status — get subscription status for the logged-in installer
router.get('/status', async (req, res) => {
  const installerId = req.user.id;
  try {
    const config = (await getInstallerConfig(installerId)) || {};
    const status = computeSubscriptionStatus(config);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get subscription status' });
  }
});

// POST /api/subscription/verify-checkout — verify a completed Stripe checkout session.
// Called by frontend on return from Stripe so activation doesn't depend solely on the webhook.
router.post('/verify-checkout', async (req, res) => {
  const installerId = req.user.id;
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId is required' });

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (session.metadata?.installerId !== installerId) {
      return res.status(403).json({ success: false, error: 'Session does not belong to this account' });
    }

    const config = (await getInstallerConfig(installerId)) || {};

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return res.json({ success: true, data: computeSubscriptionStatus(config) });
    }

    const sub = session.subscription;
    config.subscription = {
      ...(config.subscription || {}),
      stripeCustomerId: session.customer,
      stripeSubscriptionId: typeof sub === 'string' ? sub : sub?.id,
      status: 'active',
      currentPeriodEnd: sub?.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
    };
    await saveInstallerConfig(installerId, config);

    res.json({ success: true, data: computeSubscriptionStatus(config) });
  } catch (err) {
    console.error('verify-checkout error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to verify checkout session' });
  }
});

// --- Webhook event handler ---

async function handleStripeEvent(event) {
  const stripe = getStripe();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode !== 'subscription') break;
      const installerId = session.metadata?.installerId;
      if (!installerId) {
        console.error('Webhook checkout.session.completed: missing installerId in metadata');
        break;
      }
      try {
        console.log(`Webhook: checkout.session.completed for installer ${installerId}, session ${session.id}`);
        // Retrieve full session with subscription expanded (same approach as verify-checkout)
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['subscription'],
        });
        console.log(`Webhook: retrieved session, subscription status: ${fullSession.subscription?.status}`);
        const config = (await getInstallerConfig(installerId)) || {};
        const sub = fullSession.subscription;
        config.subscription = {
          ...(config.subscription || {}),
          stripeCustomerId: fullSession.customer,
          stripeSubscriptionId: typeof sub === 'string' ? sub : sub?.id,
          status: 'active',
          currentPeriodEnd: sub && typeof sub !== 'string'
            ? new Date(sub.current_period_end * 1000).toISOString()
            : (config.subscription?.currentPeriodEnd || null),
        };
        await saveInstallerConfig(installerId, config);
        console.log(`Webhook: activated installer ${installerId}`);
      } catch (err) {
        console.error(`Webhook checkout.session.completed failed for installer ${installerId}:`, err.message, err.stack);
        throw err;
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      try {
        const installerId = await findInstallerByCustomer(sub.customer);
        if (!installerId) break;
        const config = (await getInstallerConfig(installerId)) || {};
        config.subscription = {
          ...(config.subscription || {}),
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          stripeSubscriptionId: sub.id,
        };
        await saveInstallerConfig(installerId, config);
        console.log(`Webhook: updated subscription status to "${sub.status}" for installer ${installerId}`);
      } catch (err) {
        console.error(`Webhook customer.subscription.updated failed for customer ${sub.customer}:`, err.message);
        throw err;
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      try {
        const installerId = await findInstallerByCustomer(sub.customer);
        if (!installerId) break;
        const config = (await getInstallerConfig(installerId)) || {};
        config.subscription = {
          ...(config.subscription || {}),
          status: 'canceled',
          stripeSubscriptionId: sub.id,
        };
        await saveInstallerConfig(installerId, config);
        console.log(`Webhook: canceled subscription for installer ${installerId}`);
      } catch (err) {
        console.error(`Webhook customer.subscription.deleted failed for customer ${sub.customer}:`, err.message);
        throw err;
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      if (!invoice.subscription) break;
      try {
        const installerId = await findInstallerByCustomer(invoice.customer);
        if (!installerId) break;
        const config = (await getInstallerConfig(installerId)) || {};
        config.subscription = {
          ...(config.subscription || {}),
          status: 'past_due',
        };
        await saveInstallerConfig(installerId, config);
        console.log(`Webhook: marked past_due for installer ${installerId}`);
      } catch (err) {
        console.error(`Webhook invoice.payment_failed failed for customer ${invoice.customer}:`, err.message);
        throw err;
      }
      break;
    }
  }
}

// Looks up installer by stripeCustomerId in Supabase
const axios = require('axios');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

async function findInstallerByCustomer(customerId) {
  if (!SERVICE_KEY()) return null;
  try {
    const res = await axios.get(
      `${SUPABASE_URL}/rest/v1/installer_configs?select=installer_id&config->subscription->>stripeCustomerId=eq.${encodeURIComponent(customerId)}`,
      { headers: { apikey: SERVICE_KEY(), Authorization: `Bearer ${SERVICE_KEY()}` } }
    );
    return res.data?.[0]?.installer_id || null;
  } catch (err) {
    console.error('findInstallerByCustomer error:', err.message);
    return null;
  }
}

// Compute the effective subscription status from stored config.
// Handles all Stripe statuses: active, canceled, past_due, unpaid, trialing, etc.
function computeSubscriptionStatus(config) {
  const sub = config.subscription || {};
  const TRIAL_DAYS = 30;
  const trialStart = sub.trialStartedAt ? new Date(sub.trialStartedAt) : null;

  // If a Stripe subscription exists, its status is authoritative
  if (sub.stripeSubscriptionId) {
    if (sub.status === 'active') {
      return {
        active: true,
        status: 'active',
        daysLeft: null,
        currentPeriodEnd: sub.currentPeriodEnd || null,
        stripeCustomerId: sub.stripeCustomerId || null,
        stripeSubscriptionId: sub.stripeSubscriptionId,
      };
    }
    if (sub.status === 'past_due' || sub.status === 'unpaid') {
      return {
        active: false,
        status: 'past_due',
        daysLeft: null,
        currentPeriodEnd: sub.currentPeriodEnd || null,
        stripeCustomerId: sub.stripeCustomerId || null,
        stripeSubscriptionId: sub.stripeSubscriptionId,
      };
    }
    if (sub.status === 'canceled') {
      return {
        active: false,
        status: 'canceled',
        daysLeft: null,
        currentPeriodEnd: sub.currentPeriodEnd || null,
        stripeCustomerId: sub.stripeCustomerId || null,
        stripeSubscriptionId: sub.stripeSubscriptionId,
      };
    }
    // Any other Stripe status (incomplete, paused, etc.) — treat as inactive
    return {
      active: false,
      status: sub.status || 'inactive',
      daysLeft: null,
      currentPeriodEnd: sub.currentPeriodEnd || null,
      stripeCustomerId: sub.stripeCustomerId || null,
      stripeSubscriptionId: sub.stripeSubscriptionId,
    };
  }

  // No Stripe subscription yet — check free trial
  if (trialStart) {
    const daysElapsed = (Date.now() - trialStart.getTime()) / (1000 * 60 * 60 * 24);
    if (daysElapsed < TRIAL_DAYS) {
      return {
        active: true,
        status: 'trialing',
        daysLeft: Math.ceil(TRIAL_DAYS - daysElapsed),
        currentPeriodEnd: null,
        stripeCustomerId: sub.stripeCustomerId || null,
        stripeSubscriptionId: null,
      };
    }
    return {
      active: false,
      status: 'expired',
      daysLeft: 0,
      currentPeriodEnd: null,
      stripeCustomerId: sub.stripeCustomerId || null,
      stripeSubscriptionId: null,
    };
  }

  // No trial record yet — fresh account, 30-day trial starts now
  return {
    active: true,
    status: 'trialing',
    daysLeft: TRIAL_DAYS,
    currentPeriodEnd: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  };
}

// Raw webhook handler — registered before express.json() in index.js
async function webhookHandler(req, res) {
  const secret = STRIPE_WEBHOOK_SECRET();
  let event;
  try {
    if (secret) {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], secret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  try {
    await handleStripeEvent(event);
    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err.message);
    // Return the actual error so it shows up in Stripe's dashboard delivery log
    res.status(500).send(`Webhook handler failed: ${err.message}`);
  }
}

module.exports = router;
module.exports.computeSubscriptionStatus = computeSubscriptionStatus;
module.exports.webhookHandler = webhookHandler;
