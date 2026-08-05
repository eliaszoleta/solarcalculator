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
    q: 'What is the 30% federal solar tax credit?',
    a: 'The Investment Tax Credit (ITC) lets you deduct 30% of your total solar installation cost from your federal income taxes. For a $20,000 system, you\'d get a $6,000 tax credit, reducing your net cost to $14,000. This applies to systems installed through 2032. The credit is claimed when you file your taxes — it\'s not an instant discount at purchase.',
  },
  {
    q: 'How long does it take for solar to pay itself off?',
    a: 'Payback period varies widely by state — from as fast as 5–6 years in high-electricity-rate states like California and Hawaii, up to 12–14 years in low-rate states like Washington. Most homeowners fall somewhere around 7–10 years. After payback, all solar production is essentially free electricity.',
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
    a: 'The four main solar financing options are: (1) Cash purchase — lowest total cost, full ownership. (2) Solar loan — own the system, keep the 30% tax credit, pay over time; solar loans in the broader market typically run 4–8% APR over 5–20 years (our calculator estimates a representative 25-year loan at 5.99% APR for its monthly payment figures). (3) Solar lease — $0 down, no ownership, no tax credits. (4) PPA (Power Purchase Agreement) — pay per kWh produced, often below your utility rate. Most homeowners choose a solar loan to maximize savings while keeping upfront cost low.',
  },
  {
    q: 'What solar incentives are available in 2026?',
    a: 'The 30% federal Investment Tax Credit (ITC) is the biggest incentive — it reduces your tax bill by 30% of the total installation cost for systems installed through 2032. On top of that, most states offer additional programs: net metering credits, state rebates (NY-Sun, SMART in Massachusetts, SGIP in California), property tax exemptions, and sales tax exemptions. Our calculator includes the ITC in all estimates automatically.',
  },
  {
    q: 'How does net metering work with solar panels?',
    a: 'Net metering lets you earn bill credits for excess solar electricity you send to the grid. When your panels produce more than you use (typically midday), the surplus flows to the grid and your meter runs backward. At night or on cloudy days you draw from the grid and use those credits. With full retail net metering, your annual electricity bill can drop to near $0. Over 40 states have net metering laws, though credit rates vary by utility.',
  },
];

export function getAllFaqs() {
  return FAQS;
}
