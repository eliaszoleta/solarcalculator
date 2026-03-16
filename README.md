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

Installers can configure via `/installer` dashboard:
- Price per watt + profit margin
- Labor, permit, inverter costs
- Roof type surcharges
- Battery pricing
- Equipment tier labels & pricing
- Company branding

## Production Notes

- Replace in-memory config store with a real database (PostgreSQL recommended)
- Add authentication for installer dashboard (JWT or session-based)
- Set up proper CORS for production domain
- Consider adding PVWatts caching to reduce API calls
