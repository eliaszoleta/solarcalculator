// ─── Homepage FAQ content ───────────────────────────────────────────────────
// General solar-cost questions shown on the homepage FAQ section (content
// carried over from the previous inline array in SEOContent.js, with a few
// numbers corrected against what the calculator itself actually computes —
// see the accuracy-audit commit message for specifics). Also reused on the
// new /solar-cost/:state pages.

const FAQS = [
  {
    q: 'How accurate is this solar calculator?',
    a: 'Our estimates are 80–90% accurate compared to real installer quotes. On a typical $25,000 system, that means your estimate is within $2,500–$5,000 of what an installer would actually propose — close enough to know whether solar makes financial sense and to spot an overpriced quote. We use real irradiance data from the NREL PVWatts API for your exact ZIP code, EIA electricity rates by state, and a current market installation rate of $2.80/watt all-in. For a final price, you\'ll still need a site visit from a certified installer.',
  },
  {
    q: 'How much does solar save on average?',
    a: 'The average US homeowner saves roughly $1,300–$1,800 in the first year with solar on a typical system sized to a $150/month bill. Because utility rates tend to rise over time (our calculator assumes 4%/year), those savings compound — over 30 years that adds up to roughly $74,000–$101,000. The exact amount depends heavily on your state\'s electricity rate, sunlight hours, and system size.',
  },
  {
    q: 'What happened to the 30% federal solar tax credit?',
    a: "The 30% federal residential solar tax credit (the Residential Clean Energy Credit, IRC Section 25D) ended for any system placed in service after December 31, 2025, repealed by the One Big Beautiful Bill Act with no phase-down. If you install in 2026 or later as a homeowner who buys or finances your system, there's no federal credit to claim. State, utility, and local incentives weren't affected by this change and still vary by location — check what's available where you live. Leased or PPA systems may still see some benefit passed through by the installer, who can claim a separate commercial credit.",
  },
  {
    q: 'How long does it take for solar to pay itself off?',
    a: 'Payback period varies widely by state — from as fast as 7–8 years in high-electricity-rate states like California and Hawaii, up to 17–20 years in low-rate states like Washington. Most homeowners fall somewhere around 10–14 years. These run longer than they used to now that the federal residential tax credit has ended — state and utility incentives, where available, can shorten it. After payback, all solar production is essentially free electricity.',
  },
  {
    q: 'Do I need a battery for solar panels?',
    a: 'Most grid-tied solar systems don\'t require a battery. Without one, your home uses solar during the day and draws from the grid at night. A Tesla Powerwall adds $11,500 to your system cost (two Powerwalls: $23,000) for backup power during outages and higher self-consumption — see our battery cost breakdown for details.',
  },
  {
    q: 'How many solar panels does an average home need?',
    a: 'A typical US home using 10,000 kWh per year needs a 4–9 kW solar system depending on your state\'s sun hours, which is roughly 10–24 panels (400W each). Sunnier states need smaller systems for the same usage. Our calculator automatically sizes the system for your specific usage and location.',
  },
  {
    q: 'Does my roof need to face south for solar?',
    a: 'South-facing roofs are ideal, but east or west-facing roofs still produce about 85% of a south-facing system\'s output. North-facing or heavily shaded roofs produce significantly less. Our calculator accounts for this in the "roof sun exposure" step.',
  },
  {
    q: 'What are my solar financing options?',
    a: 'The four main solar financing options are: (1) Cash purchase — lowest total cost, full ownership. (2) Solar loan — own the system, pay over time; solar loans in the broader market typically run 4–8% APR over 5–20 years (our calculator estimates a representative 25-year loan at 5.99% APR for its monthly payment figures). (3) Solar lease — $0 down, no ownership. (4) PPA (Power Purchase Agreement) — pay per kWh produced, often below your utility rate. The federal residential tax credit that used to favor cash/loan ownership ended in 2025, so compare financing mainly on monthly payment and total cost now rather than who "keeps the credit."',
  },
  {
    q: 'What solar incentives are available in 2026?',
    a: "The federal 30% residential tax credit ended for systems placed in service after December 31, 2025, so it's no longer part of the estimate. What's still available varies by state and utility: net metering credits, state rebates (NY-Sun, SMART in Massachusetts, SGIP in California), property tax exemptions, and sales tax exemptions. Check with a local installer or your state energy office for what applies where you live.",
  },
  {
    q: 'How does net metering work with solar panels?',
    a: 'Net metering lets you earn bill credits for excess solar electricity you send to the grid. When your panels produce more than you use (typically midday), the surplus flows to the grid and your meter runs backward. At night or on cloudy days you draw from the grid and use those credits. With full retail net metering, your annual electricity bill can drop to near $0. Over 40 states have net metering laws, though credit rates vary by utility.',
  },
];

export function getAllFaqs() {
  return FAQS;
}
