// Default installer configuration
// These are used when no custom installer config is found
const DEFAULT_INSTALLER_CONFIG = {
  pricePerWatt: 3.0,        // $ per watt installed
  minSystemSize: 4,          // kW
  maxSystemSize: 20,         // kW
  laborCost: 5000,           // flat $ labor
  permitCost: 1200,          // flat $ permits & engineering
  inverterCost: 2500,        // flat $ inverter
  profitMargin: 0.25,        // 25%
  batteries: {
    none: { label: "No battery", cost: 0 },
    one: { label: "1 Battery (Tesla Powerwall)", cost: 11500 },
    two: { label: "2 Batteries (Tesla Powerwall)", cost: 23000 },
  },
  roofSurcharges: {
    asphalt: 0,
    metal: 500,
    tile: 1500,
    flat: 800,
  },
  equipment: {
    basic: { label: "Basic (JinkoSolar)", pricePerWatt: 2.5 },
    standard: { label: "Standard (Qcells)", pricePerWatt: 2.8 },
    premium: { label: "Premium (SunPower)", pricePerWatt: 3.4 },
  },
  federalTaxCredit: 0.30,    // 30% ITC
  panelWattage: 400,          // watts per panel
  panelAreaM2: 2,             // m² per panel
  systemName: "Solar Calculator",
  companyName: "",
  primaryColor: "#f59e0b",
  accentColor: "#1e40af",
};

// Electricity rates by state ($/kWh) — EIA 2024 averages
const STATE_ELECTRICITY_RATES = {
  AL: 0.134, AK: 0.226, AZ: 0.134, AR: 0.112, CA: 0.320,
  CO: 0.143, CT: 0.249, DE: 0.143, FL: 0.145, GA: 0.131,
  HI: 0.380, ID: 0.104, IL: 0.136, IN: 0.133, IA: 0.118,
  KS: 0.128, KY: 0.112, LA: 0.108, ME: 0.229, MD: 0.157,
  MA: 0.261, MI: 0.180, MN: 0.145, MS: 0.115, MO: 0.117,
  MT: 0.116, NE: 0.109, NV: 0.115, NH: 0.228, NJ: 0.174,
  NM: 0.135, NY: 0.217, NC: 0.124, ND: 0.106, OH: 0.145,
  OK: 0.110, OR: 0.118, PA: 0.155, RI: 0.262, SC: 0.135,
  SD: 0.113, TN: 0.121, TX: 0.140, UT: 0.107, VT: 0.207,
  VA: 0.140, WA: 0.104, WV: 0.111, WI: 0.175, WY: 0.102,
  DC: 0.162,
};

// Peak sun hours by state — annual daily average
const STATE_SUN_HOURS = {
  AL: 4.5, AK: 2.5, AZ: 6.5, AR: 4.5, CA: 5.5,
  CO: 5.5, CT: 4.2, DE: 4.2, FL: 5.5, GA: 4.8,
  HI: 6.0, ID: 4.8, IL: 4.2, IN: 4.2, IA: 4.5,
  KS: 5.2, KY: 4.2, LA: 5.0, ME: 4.0, MD: 4.5,
  MA: 4.2, MI: 4.0, MN: 4.5, MS: 5.0, MO: 4.8,
  MT: 4.8, NE: 5.0, NV: 6.5, NH: 4.0, NJ: 4.5,
  NM: 6.5, NY: 4.2, NC: 4.8, ND: 4.8, OH: 4.0,
  OK: 5.5, OR: 4.0, PA: 4.2, RI: 4.2, SC: 4.8,
  SD: 5.0, TN: 4.5, TX: 5.5, UT: 5.5, VT: 4.0,
  VA: 4.5, WA: 3.5, WV: 4.0, WI: 4.2, WY: 5.5,
  DC: 4.5,
};

module.exports = { DEFAULT_INSTALLER_CONFIG, STATE_ELECTRICITY_RATES, STATE_SUN_HOURS };
