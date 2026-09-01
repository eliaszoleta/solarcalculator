// ─── Solar cost topic pages ─────────────────────────────────────────────────
// Unlike the roofing/cleaning sibling apps, this calculator is a single
// product (not multiple selectable services) — these three pages are
// structured, calculator-native pricing breakdowns for the cost COMPONENTS
// a shopper searches for individually (system size, roof type, battery),
// mirroring backend/src/config/defaults.js exactly. They're deliberately
// scoped to avoid duplicating the 24 existing blog posts (which already
// cover financing, tax credits, and battery storage as long-form guides) —
// slugs and framing here target adjacent, tool-oriented search intent
// ("tesla powerwall cost") rather than the blog's educational angle
// ("how does battery storage work").

const REPRESENTATIVE_SYSTEM_KW = 6; // used as the baseline for roof-type/battery tiers

const SERVICES = [
  {
    id: 'system_size',
    slug: 'solar-system-size-cost',
    name: 'Solar Panel Cost by System Size',
    shortLabel: 'By System Size',
    tagline: 'Solar system cost scales directly with size — bigger systems cost more upfront but can offset more of your electricity usage.',
    seoTitle: 'Solar Panel Cost by System Size (kW) 2026 | Solar Cost Predictor',
    metaDescription: 'Solar panel systems cost $2.80 per watt installed. See 2026 pricing for 4kW–20kW systems, before and after the 30% federal tax credit.',
    unitType: 'flat',
    unit: 'installed cost, before tax credit',
    typicalTierIndex: 1,
    tiers: [
      { label: '4 kW (10 panels)', low: 10080, high: 12320, note: 'Minimum system size — small homes or high electricity rates' },
      { label: '6 kW (15 panels)', low: 15120, high: 18480, note: 'Typical for an average single-family home' },
      { label: '8 kW (20 panels)', low: 20160, high: 24640, note: 'Larger homes or higher usage' },
      { label: '10 kW (25 panels)', low: 25200, high: 30800, note: 'High-usage homes, pools, EV charging' },
      { label: '15 kW (38 panels)', low: 37800, high: 46200, note: 'Very high usage or multi-family' },
      { label: '20 kW (50 panels)', low: 50400, high: 61600, note: 'Maximum system size we quote' },
    ],
    bullets: [
      'Installed cost is a flat $2.80 per watt (panels, labor, inverter, permits, margin all included) before any tax credit',
      'The federal 30% tax credit reduces net cost significantly — a 6 kW system drops from $16,800 to $11,760 after the credit',
      'Most homes need a 4–10 kW system; larger homes or higher usage can require up to 20 kW, our calculator\'s maximum',
      'Panel count is based on 400W panels — a 6 kW system uses about 15 panels',
    ],
    faqs: [
      { q: 'How much does a 6 kW solar system cost?', a: 'A 6 kW system costs about $15,120–$18,480 installed ($16,800 average), or $10,584–$12,936 after the 30% federal tax credit.' },
      { q: 'How is my system size calculated?', a: 'Your recommended system size is based on your monthly electricity bill, your state\'s electricity rate and sun hours, and your roof\'s sun exposure — sized to offset about 85% of your usage.' },
      { q: 'What\'s the smallest and largest system I can get a quote for?', a: 'Our calculator quotes systems from 4 kW (minimum) to 20 kW (maximum), covering the vast majority of residential homes.' },
      { q: 'Does system size affect my payback period?', a: 'Not directly — payback depends more on your electricity rate and how much of your usage the system offsets. Smaller systems in high-rate states can pay back faster than large systems in low-rate states.' },
    ],
    relatedSlugs: ['solar-cost-by-roof-type', 'tesla-powerwall-cost'],
  },
  {
    id: 'roof_type',
    slug: 'solar-cost-by-roof-type',
    name: 'Solar Cost by Roof Type',
    shortLabel: 'By Roof Type',
    tagline: 'Your roofing material adds a small surcharge to your solar installation — mounting hardware and labor vary by roof type.',
    seoTitle: 'Solar Panel Cost by Roof Type (Asphalt, Metal, Tile, Flat) 2026 | Solar Cost Predictor',
    metaDescription: 'Roof type adds $0–$1,500 to your solar installation cost. See 2026 pricing for asphalt, metal, tile, and flat roofs on a typical 6 kW system.',
    unitType: 'flat',
    unit: `installed cost for a ${REPRESENTATIVE_SYSTEM_KW} kW system, before tax credit`,
    typicalTierIndex: 0,
    tiers: [
      { label: 'Asphalt Shingle (Most Common)', low: 16800, high: 16800, note: 'No mounting surcharge' },
      { label: 'Metal', low: 17300, high: 17300, note: '+$500 — standing-seam clamps often mount without roof penetrations' },
      { label: 'Flat', low: 17600, high: 17600, note: '+$800 — needs ballasted or tilted racking to angle panels' },
      { label: 'Tile', low: 18300, high: 18300, note: '+$1,500 — specialized flashing needed to avoid cracking tiles' },
    ],
    bullets: [
      'Asphalt shingle roofs — the most common residential roof type — have no solar mounting surcharge',
      'Metal roofs add $500: standing-seam panels often mount without any roof penetrations, which can make installation faster',
      'Flat roofs add $800 for ballasted or tilted racking systems needed to angle panels toward the sun',
      'Tile roofs add $1,500, the highest surcharge, due to specialized flashing required to avoid cracking tiles during installation',
    ],
    faqs: [
      { q: 'Does roof type affect solar installation cost?', a: 'Yes, but modestly — it adds $0–$1,500 to your total system cost depending on material. For a 6 kW system, that\'s the difference between $16,800 (asphalt) and $18,300 (tile).' },
      { q: 'Why do tile roofs cost more for solar?', a: 'Tile roofs require specialized flashing and extra care during installation to avoid cracking tiles, which adds $1,500 to a typical system.' },
      { q: 'Do metal roofs really cost less to install solar on?', a: 'Metal roofs add just $500 — since standing-seam panels can sometimes be clamped on without penetrating the roof at all.' },
      { q: 'What if I have a flat roof?', a: 'Flat roofs need ballasted or tilted racking to angle panels toward the sun for better production, which adds $800 to your system cost.' },
    ],
    relatedSlugs: ['solar-system-size-cost', 'tesla-powerwall-cost'],
  },
  {
    id: 'battery',
    slug: 'tesla-powerwall-cost',
    name: 'Tesla Powerwall Cost',
    shortLabel: 'Battery Storage',
    tagline: 'Battery backup adds resilience during outages — here\'s exactly what our calculator adds to your system cost for one or two Tesla Powerwalls.',
    seoTitle: 'Tesla Powerwall Cost 2026: Battery Storage Pricing | Solar Cost Predictor',
    metaDescription: 'A Tesla Powerwall adds $11,500 to your solar system cost (two Powerwalls: $23,000). See 2026 pricing and what backup coverage you get with each option.',
    unitType: 'flat',
    unit: 'added to your system cost, before tax credit',
    typicalTierIndex: 1,
    tiers: [
      { label: 'No Battery', low: 0, high: 0, note: 'Solar-only system — no backup power during a grid outage' },
      { label: '1 Battery (Tesla Powerwall)', low: 11500, high: 11500, note: 'Powers essential circuits during an outage; most common choice' },
      { label: '2 Batteries (Tesla Powerwall)', low: 23000, high: 23000, note: 'Whole-home backup for extended outages' },
    ],
    bullets: [
      'Our calculator adds a flat $11,500 for one Tesla Powerwall, or $23,000 for two — a fixed add-on, not a range',
      'One Powerwall (13.5 kWh) typically covers essential circuits (fridge, lights, some outlets) during a grid outage',
      'Two Powerwalls can back up most or all of a typical home\'s circuits for longer outages',
      'Battery cost is included in the same 30% federal tax credit as the rest of your system, not a separate credit',
    ],
    faqs: [
      { q: 'How much does a Tesla Powerwall cost through this calculator?', a: 'Our calculator adds a flat $11,500 for one Powerwall or $23,000 for two, on top of your solar system cost. After the 30% federal tax credit (which applies to the whole system including battery), one Powerwall\'s net add-on cost is about $8,050.' },
      { q: 'Do I need a battery with solar?', a: 'No — batteries are optional. Without one, your system still offsets your electricity bill during the day and you draw from the grid at night (net metering, where available). A battery adds backup power during outages.' },
      { q: 'Is battery storage eligible for the tax credit?', a: 'In our calculator, yes — the 30% federal credit applies to your total system cost, including any battery you add.' },
      { q: 'How many batteries do I need?', a: 'One Powerwall typically covers essential circuits during an outage. Two can back up most or all of a typical home. Your actual backup needs depend on your home\'s electrical panel and usage.' },
    ],
    relatedSlugs: ['solar-system-size-cost', 'solar-cost-by-roof-type'],
  },
];

export function getAllServices() {
  return SERVICES;
}

export function getServiceBySlug(slug) {
  return SERVICES.find(s => s.slug === slug) || null;
}

export function getRelatedServices(service) {
  return (service.relatedSlugs || [])
    .map(slug => SERVICES.find(s => s.slug === slug))
    .filter(Boolean);
}

// The "typical" headline number for a topic page — one representative tier.
export function typicalCost(service) {
  const tier = service.tiers[service.typicalTierIndex] || service.tiers[0];
  return { low: tier.low, high: tier.high };
}
