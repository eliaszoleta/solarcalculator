# ☀️ SolarCalc — Solar Savings & Installation Cost Calculator

A full-stack solar panel savings estimator with an embeddable widget for solar installers.

## What It Does

**For homeowners:** A step-by-step calculator that estimates:
- Recommended system size (kW)
- Total installation cost with range
- Cost after 30% federal tax credit
- Monthly and 30-year savings
- Interactive savings projection chart

**For solar installers (SaaS backend):**
- Installer dashboard to configure pricing, margins, equipment tiers
- Embeddable calculator widget for their website
- Lead capture form

## Project Structure

```
solarcalculator/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/   # Default values, state data
│   │   ├── routes/   # /api/calculate, /api/installer
│   │   └── services/ # Solar calculation engine
│   └── .env.example
└── frontend/         # React app
    └── src/
        ├── components/
        │   ├── calculator/ # Step-by-step calculator + results
        │   ├── dashboard/  # Installer dashboard
        │   └── ui/         # Header, footer, SEO content
```

## Getting Started

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure backend
```bash
cd backend
cp .env.example .env
# Optional: add NREL_API_KEY from https://developer.nrel.gov/signup/
```

### 3. Run development servers
```bash
# Terminal 1 — Backend API on :3001
npm run dev:backend

# Terminal 2 — Frontend on :3000
npm run dev:frontend
```

## Data Sources

| Data | Source | Notes |
|------|--------|-------|
| Solar production | [NREL PVWatts v8](https://developer.nrel.gov/docs/solar/pvwatts/v8/) | Free API key required. Falls back to state averages without key. |
| Electricity rates | EIA 2024 state averages | Hardcoded in `config/defaults.js` |
| Geocoding | OpenStreetMap Nominatim | Free, no key required |
| Installation costs | Industry averages | Configurable per installer |

## Key Calculation Formula

```
system_size_kw = monthly_usage_kwh / (sun_hours × 30 × shading_factor)
annual_production_kwh = system_size_kw × sun_hours × 365 × 0.86
installation_cost = system_watts × price_per_watt + labor + permits + inverter
net_cost = installation_cost × (1 - 0.30)  # 30% federal tax credit
monthly_savings = (min(production, usage) × electricity_rate) / 12
```

## SEO Strategy

The app is built for organic search traffic and AdSense monetization:
- Semantic HTML5 structure with proper heading hierarchy
- Schema.org WebApplication markup
- Keyword-targeted FAQ section (targets "solar calculator", "solar installation cost", etc.)
- State-level cost comparison table
- Canonical URL support

## Installer SaaS Features

Installers manage everything via the `/installer` dashboard:
- **Pricing Settings** — price per watt, profit margin, labor, permits, inverter, battery, roof type surcharges, equipment tiers
- **Appearance** — company name, branding colors, CTA text, phone, button URL
- **Custom Steps** — add custom questions to the calculator flow
- **Embed Code** — copy/paste script tag for their website
- **Leads** — view all submitted leads from the embedded widget
- **Subscription** — manage plan & billing

## Subscription & Billing

Billing is handled via **Stripe** with a 30-day free trial on every new account.

### How it works

| Status | Calculator |
|--------|-----------|
| Free trial (≤ 30 days) | Active |
| Trial expired, no subscription | Paused |
| Stripe subscription active | Active |
| Cancelled (at period end) | Active until period ends, then paused |
| Cancelled (immediately) | Paused |
| Past due / unpaid | Paused |

The embedded widget calls `/api/installer/:id/public` on load. If the account is inactive, it shows a "Calculator Temporarily Unavailable" screen instead.

### Required environment variables (backend)

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...           # Your monthly subscription price ID
STRIPE_WEBHOOK_SECRET=whsec_...     # From Stripe Dashboard → Webhooks
```

### Stripe webhook setup

1. In Stripe Dashboard → **Developers → Webhooks**, add endpoint:
   ```
   https://your-backend.railway.app/api/subscription/webhook
   ```
2. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
3. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET`

> **Note:** The frontend also calls `/api/subscription/verify-checkout` on return from Stripe checkout, so activation works even if the webhook is delayed.

## Environment Variables

### Backend (Railway)

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)

```
REACT_APP_API_BASE=https://your-backend.railway.app
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=...
```
