export interface MarineHullAppetite {
  vesselAgeMax: number;
  vesselValueRange: [number, number];
  excludedFlags: string[];
  excludedTradingAreas: string[];
  surveyMaxAgeMonths: number;
  leadLineSize: number;
  followLineSize: number;
  minimumClassification: string[];
  preferredWordings: string[];
  excludedWordings: string[];
  bindAuthority: {
    underwriter: number;
    manager: number;
    board: number;
  };
  vesselTypes: string[];
  hullMaterialsExcluded?: string[];
  baseRatePercent: number;
}

export interface ClassPerformance {
  historicalBindRate: number;
  averageDaysToQuote: number;
  mostCommonDeclineReasons: string[];
}

export interface Syndicate {
  id: string;
  name: string;
  managingAgent: string;
  stampCapacity: number;
  yearOfAccount: number;
  ratings: { "S&P"?: string; "AM Best"?: string };
  classes: {
    "marine.hull"?: {
      role: "lead-capable" | "follow-only";
      appetite: MarineHullAppetite;
      performance: ClassPerformance;
    };
  };
  treaties?: {
    quotaShare?: { cession: number; partner: string };
    surplus?: { lines: number; partner: string };
  };
  aggregateLimits?: Record<string, number>;
  notes?: string;
}
