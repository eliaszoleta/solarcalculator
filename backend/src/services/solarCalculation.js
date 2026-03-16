const axios = require('axios');
const { DEFAULT_INSTALLER_CONFIG, STATE_ELECTRICITY_RATES, STATE_SUN_HOURS } = require('../config/defaults');

/**
 * Convert ZIP code to lat/lon using OpenStreetMap Nominatim (free, no key required)
 */
async function geocodeZip(zip) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        postalcode: zip,
        country: 'US',
        format: 'json',
        limit: 1,
      },
      headers: { 'User-Agent': 'SolarCalculator/1.0' },
      timeout: 8000,
    });
    if (response.data && response.data.length > 0) {
      const { lat, lon, display_name } = response.data[0];
      // Extract state abbreviation from display name
      const stateMatch = display_name.match(/,\s*([A-Z]{2}),\s*United States/);
      const state = stateMatch ? stateMatch[1] : null;
      return { lat: parseFloat(lat), lon: parseFloat(lon), state, display_name };
    }
  } catch (err) {
    console.warn('Geocoding failed:', err.message);
  }
  return null;
}

/**
 * Get solar production data from NREL PVWatts API
 * Requires NREL_API_KEY environment variable
 */
async function getPVWattsData({ lat, lon, systemSizeKw, tilt = 20, azimuth = 180 }) {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey || apiKey === 'DEMO_KEY') {
    return null; // Will use fallback
  }

  try {
    const response = await axios.get('https://developer.nrel.gov/api/pvwatts/v8.json', {
      params: {
        api_key: apiKey,
        lat,
        lon,
        system_capacity: systemSizeKw,
        azimuth,
        tilt,
        array_type: 1,   // Fixed roof mount
        module_type: 0,  // Standard
        losses: 14,      // Default system losses %
      },
      timeout: 10000,
    });
    const data = response.data;
    if (data.outputs) {
      return {
        annualKwh: Math.round(data.outputs.ac_annual),
        monthlyKwh: data.outputs.ac_monthly.map(Math.round),
        capacityFactor: data.outputs.capacity_factor,
        source: 'pvwatts',
      };
    }
  } catch (err) {
    console.warn('PVWatts API failed:', err.message);
  }
  return null;
}

/**
 * Fallback solar production estimate using state sun hours
 */
function estimateSolarProduction(systemSizeKw, state, shadingFactor = 1.0) {
  const sunHours = STATE_SUN_HOURS[state] || 4.5;
  // Apply shading loss
  const effectiveSunHours = sunHours * shadingFactor;
  // Apply typical system losses (~14%)
  const annualKwh = Math.round(systemSizeKw * effectiveSunHours * 365 * 0.86);
  return {
    annualKwh,
    monthlyKwh: distributeMonthly(annualKwh),
    capacityFactor: null,
    source: 'estimate',
    sunHoursUsed: effectiveSunHours,
  };
}

// Distribute annual kWh across months with seasonal variation
function distributeMonthly(annualKwh) {
  // Relative seasonal weights (higher in summer)
  const weights = [0.06, 0.07, 0.09, 0.10, 0.11, 0.11, 0.11, 0.10, 0.09, 0.08, 0.06, 0.06];
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => Math.round((w / total) * annualKwh));
}

/**
 * Calculate shading factor from roof exposure input
 */
function getShadingFactor(sunExposure) {
  const factors = {
    full: 1.0,
    partial: 0.85,
    mostly_shade: 0.65,
  };
  return factors[sunExposure] || 1.0;
}

/**
 * Core calculation engine
 * Takes user inputs + installer config and returns full estimate
 */
async function calculateSolarEstimate(inputs, installerConfig = {}) {
  const config = { ...DEFAULT_INSTALLER_CONFIG, ...installerConfig };

  const {
    monthlyBill,       // $
    zip,
    state,             // fallback if zip geocode fails
    homeType,          // house | apartment | condo
    sunExposure,       // full | partial | mostly_shade
    battery,           // none | one | two
    equipmentTier,     // basic | standard | premium
    roofType,          // asphalt | metal | tile | flat
  } = inputs;

  // 1. Resolve electricity rate
  const electricityRate = STATE_ELECTRICITY_RATES[state] || 0.15;

  // 2. Estimate monthly usage
  const monthlyUsageKwh = monthlyBill / electricityRate;
  const annualUsageKwh = monthlyUsageKwh * 12;

  // 3. Resolve sun hours (geocode if possible for PVWatts)
  let geo = null;
  if (zip) {
    geo = await geocodeZip(zip);
  }
  const resolvedState = (geo && geo.state) || state || 'TX';
  const sunHours = STATE_SUN_HOURS[resolvedState] || 4.5;
  const shadingFactor = getShadingFactor(sunExposure);
  const effectiveSunHours = sunHours * shadingFactor;

  // 4. Calculate recommended system size
  let systemSizeKw = monthlyUsageKwh / (effectiveSunHours * 30);
  systemSizeKw = Math.max(config.minSystemSize, Math.min(config.maxSystemSize, systemSizeKw));
  systemSizeKw = Math.round(systemSizeKw * 10) / 10;

  // 5. Get solar production data (PVWatts or fallback estimate)
  let production = null;
  if (geo) {
    production = await getPVWattsData({ lat: geo.lat, lon: geo.lon, systemSizeKw });
  }
  if (!production) {
    production = estimateSolarProduction(systemSizeKw, resolvedState, shadingFactor);
  }

  // 6. Calculate panel count
  const panelCount = Math.ceil((systemSizeKw * 1000) / config.panelWattage);

  // 7. Calculate installation cost
  const tier = config.equipment[equipmentTier] || config.equipment.standard;
  const equipmentCost = systemSizeKw * 1000 * tier.pricePerWatt;
  const laborCost = config.laborCost;
  const permitCost = config.permitCost;
  const inverterCost = config.inverterCost;
  const roofSurcharge = config.roofSurcharges[roofType] || 0;
  const batteryCost = (config.batteries[battery] || config.batteries.none).cost;

  const subtotal = equipmentCost + laborCost + permitCost + inverterCost + roofSurcharge + batteryCost;
  const totalCost = Math.round(subtotal * (1 + config.profitMargin));

  // Cost range (±10%)
  const costLow = Math.round(totalCost * 0.9);
  const costHigh = Math.round(totalCost * 1.1);

  // 8. Apply federal tax credit
  const taxCredit = Math.round(totalCost * config.federalTaxCredit);
  const netCost = totalCost - taxCredit;
  const netCostLow = costLow - Math.round(costLow * config.federalTaxCredit);
  const netCostHigh = costHigh - Math.round(costHigh * config.federalTaxCredit);

  // 9. Calculate savings
  const annualSolarKwh = production.annualKwh;
  const offsetPercent = Math.min(100, Math.round((annualSolarKwh / annualUsageKwh) * 100));
  const annualSavings = Math.round(Math.min(annualSolarKwh, annualUsageKwh) * electricityRate * 12) / 12 * 12;
  const monthlySavings = Math.round(annualSavings / 12);

  // 10. Estimated financed monthly payment (25yr, 5.9% APR)
  const loanRate = 0.059 / 12;
  const loanTermMonths = 300; // 25 years
  const monthlyPayment = netCost > 0
    ? Math.round(netCost * (loanRate * Math.pow(1 + loanRate, loanTermMonths)) / (Math.pow(1 + loanRate, loanTermMonths) - 1))
    : 0;

  // 10b. Net savings after financing payment
  const netMonthlySavings = Math.max(0, monthlySavings - monthlyPayment);
  const netAnnualSavings = netMonthlySavings * 12;

  // 11. 30-year savings projection (assume 4%/yr utility increase)
  const thirtyYearSavings = Math.round(
    [...Array(30)].reduce((acc, _, i) => acc + (monthlySavings * 12) * Math.pow(1.04, i), 0)
  );

  // 12. Payback period (years)
  const paybackYears = monthlySavings > 0 ? Math.round((netCost / (monthlySavings * 12)) * 10) / 10 : null;

  // 13. 30-year savings chart data
  const savingsChart = [...Array(30)].map((_, i) => {
    const year = i + 1;
    const cumulativeSolar = [...Array(year)].reduce((acc, __, j) => acc + (monthlySavings * 12) * Math.pow(1.04, j), 0);
    return { year, cumulativeSavings: Math.round(cumulativeSolar - netCost) };
  });

  return {
    inputs: { monthlyBill, zip, state: resolvedState, homeType, sunExposure, battery, equipmentTier, roofType },
    system: {
      sizeKw: systemSizeKw,
      panelCount,
      annualProduction: annualSolarKwh,
      monthlyProduction: production.monthlyKwh,
      offsetPercent,
      dataSource: production.source,
    },
    cost: {
      total: totalCost,
      low: costLow,
      high: costHigh,
      breakdown: {
        equipment: Math.round(equipmentCost),
        labor: laborCost,
        permits: permitCost,
        inverter: inverterCost,
        roofSurcharge,
        battery: batteryCost,
        profitMargin: Math.round(subtotal * config.profitMargin),
      },
    },
    incentives: {
      federalTaxCredit: taxCredit,
      federalTaxCreditPercent: config.federalTaxCredit * 100,
      netCost,
      netCostLow,
      netCostHigh,
    },
    savings: {
      monthly: monthlySavings,
      annual: Math.round(annualSavings),
      thirtyYear: thirtyYearSavings,
      monthlyPaymentFinanced: monthlyPayment,
      netMonthlyFinanced: netMonthlySavings,
      netAnnualFinanced: netAnnualSavings,
      paybackYears,
      electricityRate,
      currentMonthlyBill: monthlyBill,
    },
    chart: savingsChart,
    equipment: {
      tier: equipmentTier,
      tierLabel: tier.label,
      batteryLabel: (config.batteries[battery] || config.batteries.none).label,
    },
  };
}

module.exports = { calculateSolarEstimate };
