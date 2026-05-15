import type { SyndicatePortfolio, BoundRisk } from "./types";

// Realistic synthetic marine hull portfolio for Mercator Syndicate 2891.
// 2026 YOA, mid-year snapshot as of 2026-05-15.

const RISKS: BoundRisk[] = [
  // Asia-Pacific concentration
  { policyId: "MR2891-2026-0017", insured: "Pacific Maritime Holdings", vesselName: "MV Coral Sea", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 38_500_000, premium: 254_100, rate: 0.66, line: 0.15, inceptionDate: "2026-01-15", expiryDate: "2027-01-15", status: "bound" },
  { policyId: "MR2891-2026-0023", insured: "Asia Star Tankers Pte", vesselName: "MT Asia Star V", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery", "iv"], sumInsured: 52_000_000, premium: 358_800, rate: 0.69, line: 0.20, inceptionDate: "2026-01-22", expiryDate: "2027-01-22", status: "bound" },
  { policyId: "MR2891-2026-0031", insured: "Yangtze River Shipping", vesselName: "MV River Pearl", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 41_200_000, premium: 263_680, rate: 0.64, line: 0.175, inceptionDate: "2026-02-04", expiryDate: "2027-02-04", status: "bound" },
  { policyId: "MR2891-2026-0042", insured: "Singapore Shipping Pte", vesselName: "MV Lion City", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery", "iv"], sumInsured: 67_500_000, premium: 472_500, rate: 0.70, line: 0.20, inceptionDate: "2026-02-18", expiryDate: "2027-02-18", status: "bound" },
  { policyId: "MR2891-2026-0058", insured: "Korean Eastern Lines", vesselName: "MV Busan Pioneer", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 44_800_000, premium: 295_680, rate: 0.66, line: 0.175, inceptionDate: "2026-03-03", expiryDate: "2027-03-03", status: "bound" },
  { policyId: "MR2891-2026-0067", insured: "Pacific Maritime Holdings", vesselName: "MV Coral Star", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 36_900_000, premium: 236_160, rate: 0.64, line: 0.15, inceptionDate: "2026-03-12", expiryDate: "2027-03-12", status: "bound" },
  { policyId: "MR2891-2026-0089", insured: "Hong Kong Maritime Co", vesselName: "MV Victoria Harbour", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery", "iv"], sumInsured: 58_300_000, premium: 408_100, rate: 0.70, line: 0.20, inceptionDate: "2026-04-08", expiryDate: "2027-04-08", status: "bound" },

  // North Atlantic
  { policyId: "MR2891-2026-0011", insured: "Northern Star Tankers AS", vesselName: "MT Aurora", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery", "iv"], sumInsured: 42_000_000, premium: 277_200, rate: 0.66, line: 0.175, inceptionDate: "2026-01-08", expiryDate: "2027-01-08", status: "bound" },
  { policyId: "MR2891-2026-0019", insured: "Maersk Line A/S (subsid)", vesselName: "MV Esbjerg", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 71_000_000, premium: 461_500, rate: 0.65, line: 0.20, inceptionDate: "2026-01-19", expiryDate: "2027-01-19", status: "bound" },
  { policyId: "MR2891-2026-0028", insured: "Atlantic Crossing Shipping", vesselName: "MV Atlantic Voyager", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 48_500_000, premium: 320_100, rate: 0.66, line: 0.175, inceptionDate: "2026-02-01", expiryDate: "2027-02-01", status: "bound" },
  { policyId: "MR2891-2026-0036", insured: "Northern Star Tankers AS", vesselName: "MT Borealis", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery", "iv"], sumInsured: 39_000_000, premium: 257_400, rate: 0.66, line: 0.175, inceptionDate: "2026-02-11", expiryDate: "2027-02-11", status: "bound" },
  { policyId: "MR2891-2026-0049", insured: "Hamilton Maritime Group", vesselName: "MV Hamilton Pride", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 33_500_000, premium: 214_400, rate: 0.64, line: 0.15, inceptionDate: "2026-02-22", expiryDate: "2027-02-22", status: "bound" },
  { policyId: "MR2891-2026-0061", insured: "Halifax Shipping Inc", vesselName: "MV Halifax Star", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 28_200_000, premium: 178_660, rate: 0.633, line: 0.125, inceptionDate: "2026-03-08", expiryDate: "2027-03-08", status: "bound" },
  { policyId: "MR2891-2026-0078", insured: "Bergen Tankers AS", vesselName: "MT Bergen Glory", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery", "iv"], sumInsured: 56_700_000, premium: 380_790, rate: 0.672, line: 0.20, inceptionDate: "2026-03-29", expiryDate: "2027-03-29", status: "bound" },

  // Mediterranean / Black Sea
  { policyId: "MR2891-2026-0024", insured: "Hellenic Lines SA", vesselName: "MV Acropolis", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery"], sumInsured: 35_400_000, premium: 233_640, rate: 0.66, line: 0.15, inceptionDate: "2026-01-26", expiryDate: "2027-01-26", status: "bound" },
  { policyId: "MR2891-2026-0044", insured: "Mediterranean Shipping Co", vesselName: "MV Marseille", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery", "iv"], sumInsured: 48_100_000, premium: 317_460, rate: 0.66, line: 0.175, inceptionDate: "2026-02-19", expiryDate: "2027-02-19", status: "bound" },
  { policyId: "MR2891-2026-0066", insured: "Turkish Maritime Lines", vesselName: "MV Bosphorus", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery"], sumInsured: 31_200_000, premium: 209_040, rate: 0.67, line: 0.15, inceptionDate: "2026-03-11", expiryDate: "2027-03-11", status: "bound" },
  { policyId: "MR2891-2026-0091", insured: "Adriatic Shipping doo", vesselName: "MV Dubrovnik", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery"], sumInsured: 27_800_000, premium: 178_120, rate: 0.64, line: 0.125, inceptionDate: "2026-04-10", expiryDate: "2027-04-10", status: "bound" },

  // US Gulf / Caribbean
  { policyId: "MR2891-2026-0014", insured: "Texas Gulf Shipping LLC", vesselName: "MV Houston Star", class: "marine.hull.bluewater", zone: "us-gulf", peril: ["hull", "machinery"], sumInsured: 46_800_000, premium: 308_880, rate: 0.66, line: 0.175, inceptionDate: "2026-01-12", expiryDate: "2027-01-12", status: "bound" },
  { policyId: "MR2891-2026-0033", insured: "Crowley Maritime (sub)", vesselName: "MT Crowley Discovery", class: "marine.hull.bluewater", zone: "us-gulf", peril: ["hull", "machinery", "iv"], sumInsured: 53_400_000, premium: 363_120, rate: 0.68, line: 0.20, inceptionDate: "2026-02-05", expiryDate: "2027-02-05", status: "bound" },
  { policyId: "MR2891-2026-0054", insured: "New Orleans Shipping Co", vesselName: "MV NOLA Pride", class: "marine.hull.bluewater", zone: "us-gulf", peril: ["hull", "machinery"], sumInsured: 38_700_000, premium: 251_550, rate: 0.65, line: 0.15, inceptionDate: "2026-02-28", expiryDate: "2027-02-28", status: "bound" },
  { policyId: "MR2891-2026-0073", insured: "Caribbean Lines Ltd", vesselName: "MV Kingston Trader", class: "marine.hull.bluewater", zone: "us-gulf", peril: ["hull", "machinery"], sumInsured: 25_200_000, premium: 161_280, rate: 0.64, line: 0.125, inceptionDate: "2026-03-19", expiryDate: "2027-03-19", status: "bound" },

  // South America
  { policyId: "MR2891-2026-0027", insured: "Brazilian Iron Carriers SA", vesselName: "MV Rio Pioneer", class: "marine.hull.bluewater", zone: "south-america", peril: ["hull", "machinery"], sumInsured: 61_500_000, premium: 412_050, rate: 0.67, line: 0.20, inceptionDate: "2026-01-30", expiryDate: "2027-01-30", status: "bound" },
  { policyId: "MR2891-2026-0047", insured: "Andean Shipping SA", vesselName: "MV Valparaíso", class: "marine.hull.bluewater", zone: "south-america", peril: ["hull", "machinery"], sumInsured: 32_400_000, premium: 213_840, rate: 0.66, line: 0.15, inceptionDate: "2026-02-21", expiryDate: "2027-02-21", status: "bound" },
  { policyId: "MR2891-2026-0069", insured: "Brazilian Iron Carriers SA", vesselName: "MV Salvador", class: "marine.hull.bluewater", zone: "south-america", peril: ["hull", "machinery"], sumInsured: 58_800_000, premium: 388_080, rate: 0.66, line: 0.20, inceptionDate: "2026-03-14", expiryDate: "2027-03-14", status: "bound" },

  // West Africa
  { policyId: "MR2891-2026-0038", insured: "Lagos Maritime Ltd", vesselName: "MV Lagos Trader", class: "marine.hull.bluewater", zone: "west-africa", peril: ["hull", "machinery"], sumInsured: 22_400_000, premium: 156_800, rate: 0.70, line: 0.125, inceptionDate: "2026-02-13", expiryDate: "2027-02-13", status: "bound" },
  { policyId: "MR2891-2026-0084", insured: "West African Shipping Co", vesselName: "MV Accra Express", class: "marine.hull.bluewater", zone: "west-africa", peril: ["hull", "machinery"], sumInsured: 19_800_000, premium: 142_560, rate: 0.72, line: 0.125, inceptionDate: "2026-03-31", expiryDate: "2027-03-31", status: "bound" },

  // Brown-water / Coastal
  { policyId: "MR2891-2026-0008", insured: "Coastal Carriers Inc", vesselName: "MV Coastal One", class: "marine.hull.brownwater", zone: "us-gulf", peril: ["hull", "machinery"], sumInsured: 8_500_000, premium: 51_000, rate: 0.60, line: 0.10, inceptionDate: "2026-01-05", expiryDate: "2027-01-05", status: "bound" },
  { policyId: "MR2891-2026-0020", insured: "Mississippi River Logistics", vesselName: "Pusher Boat Memphis", class: "marine.hull.brownwater", zone: "us-gulf", peril: ["hull", "machinery"], sumInsured: 6_200_000, premium: 38_440, rate: 0.62, line: 0.10, inceptionDate: "2026-01-20", expiryDate: "2027-01-20", status: "bound" },
  { policyId: "MR2891-2026-0045", insured: "Rhine Inland Shipping GmbH", vesselName: "Tugboat Köln", class: "marine.hull.brownwater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 5_400_000, premium: 33_480, rate: 0.62, line: 0.10, inceptionDate: "2026-02-19", expiryDate: "2027-02-19", status: "bound" },
  { policyId: "MR2891-2026-0072", insured: "Yangtze Inland Shipping", vesselName: "River Towboat 14", class: "marine.hull.brownwater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 4_800_000, premium: 30_240, rate: 0.63, line: 0.10, inceptionDate: "2026-03-17", expiryDate: "2027-03-17", status: "bound" },

  // Tankers / Energy
  { policyId: "MR2891-2026-0015", insured: "VLCC Holdings (Marshall)", vesselName: "MT Crude Pioneer", class: "marine.hull.bluewater", zone: "middle-east", peril: ["hull", "machinery", "iv"], sumInsured: 89_500_000, premium: 644_400, rate: 0.72, line: 0.20, inceptionDate: "2026-01-13", expiryDate: "2027-01-13", status: "bound" },
  { policyId: "MR2891-2026-0029", insured: "Gulf Tanker Holdings", vesselName: "MT Gulf Pioneer", class: "marine.hull.bluewater", zone: "middle-east", peril: ["hull", "machinery", "iv"], sumInsured: 76_200_000, premium: 533_400, rate: 0.70, line: 0.20, inceptionDate: "2026-02-02", expiryDate: "2027-02-02", status: "bound" },
  { policyId: "MR2891-2026-0056", insured: "Arabian Tanker Co", vesselName: "MT Riyadh Star", class: "marine.hull.bluewater", zone: "middle-east", peril: ["hull", "machinery", "iv"], sumInsured: 82_400_000, premium: 568_560, rate: 0.69, line: 0.20, inceptionDate: "2026-03-01", expiryDate: "2027-03-01", status: "bound" },
  { policyId: "MR2891-2026-0081", insured: "Eastern Mediterranean Tankers", vesselName: "MT Eilat", class: "marine.hull.bluewater", zone: "middle-east", peril: ["hull", "machinery"], sumInsured: 54_300_000, premium: 358_380, rate: 0.66, line: 0.175, inceptionDate: "2026-03-27", expiryDate: "2027-03-27", status: "bound" },

  // Container
  { policyId: "MR2891-2026-0022", insured: "Trans-Pacific Container Line", vesselName: "MV TPC Pioneer", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery", "iv"], sumInsured: 95_000_000, premium: 665_000, rate: 0.70, line: 0.20, inceptionDate: "2026-01-25", expiryDate: "2027-01-25", status: "bound" },
  { policyId: "MR2891-2026-0048", insured: "Hapag-Lloyd (sub. JV)", vesselName: "MV Hamburg Pride", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery", "iv"], sumInsured: 102_000_000, premium: 693_600, rate: 0.68, line: 0.20, inceptionDate: "2026-02-23", expiryDate: "2027-02-23", status: "bound" },
  { policyId: "MR2891-2026-0070", insured: "Evergreen Marine (sub.)", vesselName: "MV Evergreen Glory", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery", "iv"], sumInsured: 88_500_000, premium: 619_500, rate: 0.70, line: 0.20, inceptionDate: "2026-03-15", expiryDate: "2027-03-15", status: "bound" },

  // Specialty
  { policyId: "MR2891-2026-0035", insured: "Offshore Support Services Ltd", vesselName: "OSV Atlantic Tide", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 26_400_000, premium: 192_720, rate: 0.73, line: 0.125, inceptionDate: "2026-02-09", expiryDate: "2027-02-09", status: "bound" },
  { policyId: "MR2891-2026-0063", insured: "North Sea Drilling Services", vesselName: "OSV North Star", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 31_500_000, premium: 233_100, rate: 0.74, line: 0.125, inceptionDate: "2026-03-09", expiryDate: "2027-03-09", status: "bound" },

  // 2025 renewals to be lapsed
  { policyId: "MR2891-2025-0042", insured: "Pacific Maritime Holdings", vesselName: "MV Coral Aurora", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 35_500_000, premium: 230_750, rate: 0.65, line: 0.15, inceptionDate: "2025-06-15", expiryDate: "2026-06-15", status: "bound", notes: "Up for renewal 2026-06-15" },
  { policyId: "MR2891-2025-0067", insured: "Atlantic Crossing Shipping", vesselName: "MV Atlantic Trader", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 44_000_000, premium: 290_400, rate: 0.66, line: 0.175, inceptionDate: "2025-07-01", expiryDate: "2026-07-01", status: "bound", notes: "Up for renewal 2026-07-01" },
  { policyId: "MR2891-2025-0089", insured: "Mediterranean Shipping Co", vesselName: "MV Genoa", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery"], sumInsured: 38_900_000, premium: 256_740, rate: 0.66, line: 0.175, inceptionDate: "2025-08-12", expiryDate: "2026-08-12", status: "bound", notes: "Up for renewal 2026-08-12" },
  { policyId: "MR2891-2025-0102", insured: "Northern Star Tankers AS", vesselName: "MT Polaris", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery", "iv"], sumInsured: 41_500_000, premium: 273_900, rate: 0.66, line: 0.175, inceptionDate: "2025-09-01", expiryDate: "2026-09-01", status: "bound", notes: "Up for renewal 2026-09-01" },
  { policyId: "MR2891-2025-0115", insured: "Hellenic Lines SA", vesselName: "MV Olympia", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery"], sumInsured: 34_200_000, premium: 222_300, rate: 0.65, line: 0.15, inceptionDate: "2025-10-01", expiryDate: "2026-10-01", status: "bound", notes: "Up for renewal 2026-10-01" },
  { policyId: "MR2891-2025-0128", insured: "VLCC Holdings (Marshall)", vesselName: "MT Crude Voyager", class: "marine.hull.bluewater", zone: "middle-east", peril: ["hull", "machinery", "iv"], sumInsured: 87_000_000, premium: 608_000, rate: 0.70, line: 0.20, inceptionDate: "2025-11-01", expiryDate: "2026-11-01", status: "bound", notes: "Up for renewal 2026-11-01" },

  // Additional bound risks for portfolio depth
  { policyId: "MR2891-2026-0093", insured: "Korean Eastern Lines", vesselName: "MV Incheon Star", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery"], sumInsured: 42_100_000, premium: 277_860, rate: 0.66, line: 0.175, inceptionDate: "2026-04-12", expiryDate: "2027-04-12", status: "bound" },
  { policyId: "MR2891-2026-0098", insured: "Bergen Tankers AS", vesselName: "MT Trondheim", class: "marine.hull.bluewater", zone: "north-atlantic", peril: ["hull", "machinery"], sumInsured: 47_300_000, premium: 307_450, rate: 0.65, line: 0.175, inceptionDate: "2026-04-20", expiryDate: "2027-04-20", status: "bound" },
  { policyId: "MR2891-2026-0104", insured: "Mediterranean Shipping Co", vesselName: "MV Naples", class: "marine.hull.bluewater", zone: "mediterranean", peril: ["hull", "machinery"], sumInsured: 39_600_000, premium: 257_400, rate: 0.65, line: 0.175, inceptionDate: "2026-04-28", expiryDate: "2027-04-28", status: "bound" },
  { policyId: "MR2891-2026-0112", insured: "Hong Kong Maritime Co", vesselName: "MV Kowloon", class: "marine.hull.bluewater", zone: "asia-pacific", peril: ["hull", "machinery", "iv"], sumInsured: 64_800_000, premium: 447_120, rate: 0.69, line: 0.20, inceptionDate: "2026-05-08", expiryDate: "2027-05-08", status: "bound" },
];

const totalSI = RISKS.reduce((s, r) => s + r.sumInsured, 0);
const totalPrem = RISKS.reduce((s, r) => s + r.premium, 0);

// Aggregate by zone
const zoneMap = new Map<string, { si: number; prem: number; count: number }>();
for (const r of RISKS) {
  const cur = zoneMap.get(r.zone) ?? { si: 0, prem: 0, count: 0 };
  zoneMap.set(r.zone, {
    si: cur.si + r.sumInsured,
    prem: cur.prem + r.premium,
    count: cur.count + 1,
  });
}

const ZONE_LIMITS: Record<string, number> = {
  "asia-pacific": 600_000_000,
  "north-atlantic": 550_000_000,
  mediterranean: 300_000_000,
  "us-gulf": 350_000_000,
  "south-america": 250_000_000,
  "west-africa": 150_000_000,
  "middle-east": 400_000_000,
};

const zoneAggregates = Array.from(zoneMap.entries()).map(([zone, agg]) => ({
  zone,
  sumInsured: agg.si,
  premium: agg.prem,
  riskCount: agg.count,
  limit: ZONE_LIMITS[zone] ?? 200_000_000,
  utilization: agg.si / (ZONE_LIMITS[zone] ?? 200_000_000),
}));

// Aggregate by class
const classMap = new Map<string, { si: number; prem: number; count: number; rateSum: number }>();
for (const r of RISKS) {
  const cur = classMap.get(r.class) ?? { si: 0, prem: 0, count: 0, rateSum: 0 };
  classMap.set(r.class, {
    si: cur.si + r.sumInsured,
    prem: cur.prem + r.premium,
    count: cur.count + 1,
    rateSum: cur.rateSum + r.rate,
  });
}
const classAggregates = Array.from(classMap.entries()).map(([cls, agg]) => ({
  class: cls,
  sumInsured: agg.si,
  premium: agg.prem,
  riskCount: agg.count,
  averageRate: agg.rateSum / agg.count,
}));

export const MercatorPortfolio: SyndicatePortfolio = {
  syndicateId: "SYN-2891",
  syndicateName: "Mercator Syndicate 2891",
  yearOfAccount: 2026,
  stampCapacity: 420_000_000,
  asOfDate: "2026-05-15",
  bookSummary: {
    totalRisks: RISKS.length,
    totalSumInsured: totalSI,
    totalPremium: totalPrem,
    averageRate: totalPrem / totalSI,
    capacityUtilization: totalPrem / 420_000_000,
  },
  risks: RISKS,
  zoneAggregates,
  classAggregates,
  treaties: {
    quotaShare: {
      cession: 0.25,
      reinsurer: "Munich Re Group",
      premiumCeded: totalPrem * 0.25,
    },
    surplus: {
      lines: 9,
      reinsurer: "Swiss Re / Hannover Re panel",
    },
    excessOfLoss: [
      {
        layer: "Layer 1",
        attachment: 50_000_000,
        limit: 50_000_000,
        reinsurer: "Lloyd's panel (mixed)",
        premiumCession: 0,
        status: "below-attachment",
        currentExposure: 0,
      },
      {
        layer: "Layer 2",
        attachment: 100_000_000,
        limit: 150_000_000,
        reinsurer: "Hannover / Munich panel",
        premiumCession: 0,
        status: "below-attachment",
        currentExposure: 0,
      },
      {
        layer: "Layer 3",
        attachment: 250_000_000,
        limit: 250_000_000,
        reinsurer: "Berkshire Hathaway Re",
        premiumCession: 0,
        status: "below-attachment",
        currentExposure: 0,
      },
    ],
  },
};
