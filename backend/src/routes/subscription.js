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
    if (!customerId) return res.status(400).json({ success: false, error: 'No active subscription found' });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/installer?tab=subscription`,
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Stripe portal error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to open billing portal' });
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

// POST /api/subscription/verify-checkout — verify a completed Stripe checkout session
// Called by frontend on return from Stripe when webhook may not have fired yet
router.post('/verify-checkout', async (req, res) => {
  const installerId = req.user.id;
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId is required' });

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    // Verify this session belongs to this installer
    if (session.metadata?.installerId !== installerId) {
      return res.status(403).json({ success: false, error: 'Session does not belong to this account' });
    }

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      const config = (await getInstallerConfig(installerId)) || {};
      return res.json({ success: true, data: computeSubscriptionStatus(config) });
    }

    // Session is paid — update config if not already active
    const config = (await getInstallerConfig(installerId)) || {};
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


async function handleStripeEvent(event) {
  const stripe = getStripe();
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode !== 'subscription') break;
      const installerId = session.metadata?.installerId;
      if (!installerId) break;
      const config = (await getInstallerConfig(installerId)) || {};
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      config.subscription = {
        ...(config.subscription || {}),
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        status: 'active',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      };
      await saveInstallerConfig(installerId, config);
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const installerId = await findInstallerByCustomer(sub.customer);
      if (!installerId) break;
      const config = (await getInstallerConfig(installerId)) || {};
      config.subscription = {
        ...(config.subscription || {}),
        status: sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'canceled' : sub.status,
        currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
        stripeSubscriptionId: sub.id,
      };
      await saveInstallerConfig(installerId, config);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const installerId = await findInstallerByCustomer(sub.customer);
      if (!installerId) break;
      const config = (await getInstallerConfig(installerId)) || {};
      config.subscription = {
        ...(config.subscription || {}),
        status: 'canceled',
        stripeSubscriptionId: sub.id,
      };
      await saveInstallerConfig(installerId, config);
      break;
    }
  }
}

// Looks up installer by stripeCustomerId — used in webhook handlers
const axios = require('axios');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

async function findInstallerByCustomer(customerId) {
  if (!SERVICE_KEY()) return null;
  try {
    const res = await axios.get(
      `${SUPABASE_URL}/rest/v1/installer_configs?select=installer_id,config&config->subscription->>stripeCustomerId=eq.${customerId}`,
      { headers: { apikey: SERVICE_KEY(), Authorization: `Bearer ${SERVICE_KEY()}` } }
    );
    return res.data?.[0]?.installer_id || null;
  } catch {
    return null;
  }
}

// Exported utility used by installer routes
function computeSubscriptionStatus(config) {
  const sub = config.subscription || {};
  const TRIAL_DAYS = 30;
  const trialStart = sub.trialStartedAt ? new Date(sub.trialStartedAt) : null;

  if (sub.status === 'active') {
    return {
      active: true,
      status: 'active',
      daysLeft: null,
      currentPeriodEnd: sub.currentPeriodEnd || null,
      stripeCustomerId: sub.stripeCustomerId || null,
    };
  }

  if (trialStart) {
    const daysElapsed = (Date.now() - trialStart.getTime()) / (1000 * 60 * 60 * 24);
    if (daysElapsed < TRIAL_DAYS) {
      return {
        active: true,
        status: 'trialing',
        daysLeft: Math.ceil(TRIAL_DAYS - daysElapsed),
        currentPeriodEnd: null,
        stripeCustomerId: sub.stripeCustomerId || null,
      };
    }
    return {
      active: false,
      status: 'expired',
      daysLeft: 0,
      currentPeriodEnd: null,
      stripeCustomerId: sub.stripeCustomerId || null,
    };
  }

  // No trial record yet — treat as fresh trial
  return {
    active: true,
    status: 'trialing',
    daysLeft: TRIAL_DAYS,
    currentPeriodEnd: null,
    stripeCustomerId: null,
  };
}

// Exported raw webhook handler (needs raw body, registered before express.json in index.js)
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
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  try {
    await handleStripeEvent(event);
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    res.status(500).send('Webhook handler failed');
  }
}

module.exports = router;
module.exports.computeSubscriptionStatus = computeSubscriptionStatus;
module.exports.webhookHandler = webhookHandler;
