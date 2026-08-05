// ─── State solar cost data ──────────────────────────────────────────────────
// Mirrors backend/src/config/defaults.js (STATE_ELECTRICITY_RATES,
// STATE_SUN_HOURS) and replicates the exact formula from
// backend/src/services/solarCalculation.js's fallback (non-PVWatts) path, so
// state pages stay consistent with what the calculator itself quotes.
// Update all three files together if pricing/formula assumptions change.
//
// IMPORTANT: unlike the roofing/cleaning sibling apps, this calculator has NO
// state-based installed-cost multiplier — pricePerWatt ($2.80) is a single
// flat national constant (see defaults.js). What genuinely varies by state is
// the RECOMMENDED SYSTEM SIZE (driven by each state's electricity rate, which
// determines how many kWh a given monthly bill implies, and its sun hours),
// and therefore the total cost, savings, and payback period that follow from
// that different system size — not a "roofing costs more in California" style
// multiplier. Don't reintroduce that framing when writing copy against this data.

const STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', electricityRate: 0.134, sunHours: 4.5 },
  { code: 'AK', name: 'Alaska', slug: 'alaska', electricityRate: 0.226, sunHours: 2.5 },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', electricityRate: 0.134, sunHours: 6.5 },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', electricityRate: 0.112, sunHours: 4.5 },
  { code: 'CA', name: 'California', slug: 'california', electricityRate: 0.320, sunHours: 5.5 },
  { code: 'CO', name: 'Colorado', slug: 'colorado', electricityRate: 0.143, sunHours: 5.5 },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', electricityRate: 0.249, sunHours: 4.2 },
  { code: 'DE', name: 'Delaware', slug: 'delaware', electricityRate: 0.143, sunHours: 4.2 },
  { code: 'DC', name: 'Washington DC', slug: 'washington-dc', electricityRate: 0.162, sunHours: 4.5 },
  { code: 'FL', name: 'Florida', slug: 'florida', electricityRate: 0.145, sunHours: 5.5 },
  { code: 'GA', name: 'Georgia', slug: 'georgia', electricityRate: 0.131, sunHours: 4.8 },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', electricityRate: 0.380, sunHours: 6.0 },
  { code: 'ID', name: 'Idaho', slug: 'idaho', electricityRate: 0.104, sunHours: 4.8 },
  { code: 'IL', name: 'Illinois', slug: 'illinois', electricityRate: 0.136, sunHours: 4.2 },
  { code: 'IN', name: 'Indiana', slug: 'indiana', electricityRate: 0.133, sunHours: 4.2 },
  { code: 'IA', name: 'Iowa', slug: 'iowa', electricityRate: 0.118, sunHours: 4.5 },
  { code: 'KS', name: 'Kansas', slug: 'kansas', electricityRate: 0.128, sunHours: 5.2 },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', electricityRate: 0.112, sunHours: 4.2 },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', electricityRate: 0.108, sunHours: 5.0 },
  { code: 'ME', name: 'Maine', slug: 'maine', electricityRate: 0.229, sunHours: 4.0 },
  { code: 'MD', name: 'Maryland', slug: 'maryland', electricityRate: 0.157, sunHours: 4.5 },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', electricityRate: 0.261, sunHours: 4.2 },
  { code: 'MI', name: 'Michigan', slug: 'michigan', electricityRate: 0.180, sunHours: 4.0 },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', electricityRate: 0.145, sunHours: 4.5 },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', electricityRate: 0.115, sunHours: 5.0 },
  { code: 'MO', name: 'Missouri', slug: 'missouri', electricityRate: 0.117, sunHours: 4.8 },
  { code: 'MT', name: 'Montana', slug: 'montana', electricityRate: 0.116, sunHours: 4.8 },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', electricityRate: 0.109, sunHours: 5.0 },
  { code: 'NV', name: 'Nevada', slug: 'nevada', electricityRate: 0.115, sunHours: 6.5 },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', electricityRate: 0.228, sunHours: 4.0 },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', electricityRate: 0.174, sunHours: 4.5 },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', electricityRate: 0.135, sunHours: 6.5 },
  { code: 'NY', name: 'New York', slug: 'new-york', electricityRate: 0.217, sunHours: 4.2 },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', electricityRate: 0.124, sunHours: 4.8 },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', electricityRate: 0.106, sunHours: 4.8 },
  { code: 'OH', name: 'Ohio', slug: 'ohio', electricityRate: 0.145, sunHours: 4.0 },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', electricityRate: 0.110, sunHours: 5.5 },
  { code: 'OR', name: 'Oregon', slug: 'oregon', electricityRate: 0.118, sunHours: 4.0 },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', electricityRate: 0.155, sunHours: 4.2 },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', electricityRate: 0.262, sunHours: 4.2 },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', electricityRate: 0.135, sunHours: 4.8 },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', electricityRate: 0.113, sunHours: 5.0 },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', electricityRate: 0.121, sunHours: 4.5 },
  { code: 'TX', name: 'Texas', slug: 'texas', electricityRate: 0.140, sunHours: 5.5 },
  { code: 'UT', name: 'Utah', slug: 'utah', electricityRate: 0.107, sunHours: 5.5 },
  { code: 'VT', name: 'Vermont', slug: 'vermont', electricityRate: 0.207, sunHours: 4.0 },
  { code: 'VA', name: 'Virginia', slug: 'virginia', electricityRate: 0.140, sunHours: 4.5 },
  { code: 'WA', name: 'Washington', slug: 'washington', electricityRate: 0.104, sunHours: 3.5 },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', electricityRate: 0.111, sunHours: 4.0 },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', electricityRate: 0.175, sunHours: 4.2 },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', electricityRate: 0.102, sunHours: 5.5 },
];

// Same constants as backend/src/config/defaults.js DEFAULT_INSTALLER_CONFIG
const PRICE_PER_WATT = 2.8;
const FEDERAL_TAX_CREDIT = 0.30;
const MIN_SYSTEM_KW = 4;
const MAX_SYSTEM_KW = 20;
const PANEL_WATTAGE = 400;
const LOAN_APR = 0.0599;
const LOAN_TERM_MONTHS = 300; // 25 years
const UTILITY_RATE_GROWTH = 1.04; // 4%/yr, matches backend

// Representative scenario used across all state/topic pages: a $150/mo bill
// (a commonly-cited average U.S. electric bill), full sun exposure, asphalt
// roof (no surcharge), no battery — i.e. the calculator's own defaults.
const REPRESENTATIVE_MONTHLY_BILL = 150;

// Replicates backend/src/services/solarCalculation.js's fallback (non-PVWatts,
// non-geocoded) calculation path exactly, for a given state + monthly bill.
export function estimateForState(state, monthlyBill = REPRESENTATIVE_MONTHLY_BILL) {
  const electricityRate = state.electricityRate;
  const monthlyUsageKwh = monthlyBill / electricityRate;
  const annualUsageKwh = monthlyUsageKwh * 12;
  const effectiveSunHours = state.sunHours; // full sun exposure, no shading

  let systemSizeKw = (monthlyUsageKwh * 0.85) / (effectiveSunHours * 30);
  systemSizeKw = Math.max(MIN_SYSTEM_KW, Math.min(MAX_SYSTEM_KW, systemSizeKw));
  systemSizeKw = Math.round(systemSizeKw * 10) / 10;

  const annualKwh = Math.round(systemSizeKw * effectiveSunHours * 365 * 0.86);
  const panelCount = Math.ceil((systemSizeKw * 1000) / PANEL_WATTAGE);

  const equipmentCost = systemSizeKw * 1000 * PRICE_PER_WATT; // asphalt roof, no battery
  const totalCost = Math.round(equipmentCost);
  const costLow = Math.round(totalCost * 0.9);
  const costHigh = Math.round(totalCost * 1.1);

  const taxCredit = Math.round(totalCost * FEDERAL_TAX_CREDIT);
  const netCost = totalCost - taxCredit;
  const netCostLow = costLow - Math.round(costLow * FEDERAL_TAX_CREDIT);
  const netCostHigh = costHigh - Math.round(costHigh * FEDERAL_TAX_CREDIT);

  const offsetPercent = Math.min(100, Math.round((annualKwh / annualUsageKwh) * 100));
  const annualSavings = Math.round(Math.min(annualKwh, annualUsageKwh) * electricityRate);
  const monthlySavings = Math.round(annualSavings / 12);

  const loanRateMonthly = LOAN_APR / 12;
  const monthlyPayment = netCost > 0
    ? Math.round(netCost * (loanRateMonthly * Math.pow(1 + loanRateMonthly, LOAN_TERM_MONTHS)) / (Math.pow(1 + loanRateMonthly, LOAN_TERM_MONTHS) - 1))
    : 0;

  let paybackYears = null;
  if (annualSavings > 0) {
    let cumulative = 0;
    for (let i = 0; i < 30; i++) {
      cumulative += annualSavings * Math.pow(UTILITY_RATE_GROWTH, i);
      if (cumulative >= netCost) { paybackYears = i + 1; break; }
    }
  }

  return {
    systemSizeKw, panelCount, annualKwh, offsetPercent,
    totalCost, costLow, costHigh, taxCredit, netCost, netCostLow, netCostHigh,
    annualSavings, monthlySavings, monthlyPayment, paybackYears,
  };
}

function withEstimate(s) {
  return { ...s, estimate: estimateForState(s) };
}

export function getAllStates() {
  return STATES.map(withEstimate).sort((a, b) => a.name.localeCompare(b.name));
}

export function getStateBySlug(slug) {
  const s = STATES.find(st => st.slug === slug);
  return s ? withEstimate(s) : null;
}

// A representative spread of states for homepage teaser tables — mix of
// high electricity-rate (fast payback, small system) and low-rate
// (larger system, slower payback) markets, plus a few of the most populous.
export function getFeaturedStates() {
  const slugs = ['california', 'texas', 'florida', 'new-york', 'arizona', 'nevada', 'washington', 'massachusetts', 'north-carolina'];
  return slugs.map(getStateBySlug).filter(Boolean);
}

export { REPRESENTATIVE_MONTHLY_BILL, PRICE_PER_WATT, FEDERAL_TAX_CREDIT };
