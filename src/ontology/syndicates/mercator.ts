import { Syndicate } from "./types";

export const MercatorSyndicate2891: Syndicate = {
  id: "SYN-2891",
  name: "Mercator Syndicate 2891",
  managingAgent: "Mercator Underwriters Ltd",
  stampCapacity: 420_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A+", "AM Best": "A+" },
  classes: {
    "marine.hull": {
      role: "lead-capable",
      appetite: {
        vesselAgeMax: 20,
        vesselValueRange: [3_000_000, 120_000_000],
        excludedFlags: ["KP", "IR", "SY"],
        excludedTradingAreas: ["sanctioned-CU", "sanctioned-IR", "sanctioned-KP", "sanctioned-SY"],
        surveyMaxAgeMonths: 30,
        leadLineSize: 0.20,
        followLineSize: 0.075,
        minimumClassification: [
          "Lloyd's Register",
          "DNV",
          "ABS",
          "BV",
          "NK",
          "KR",
          "CCS",
          "RINA",
          "IRS",
        ],
        preferredWordings: ["LMA5395", "LMA5396"],
        excludedWordings: [],
        bindAuthority: {
          underwriter: 4_000_000,
          manager: 15_000_000,
          board: 120_000_000,
        },
        vesselTypes: [
          "bulk carrier",
          "tanker",
          "container",
          "general cargo",
          "offshore",
          "tug",
          "barge",
        ],
        baseRatePercent: 0.68,
      },
      performance: {
        historicalBindRate: 0.51,
        averageDaysToQuote: 2,
        mostCommonDeclineReasons: ["loss frequency", "trading area"],
      },
    },
  },
  notes:
    "Broader appetite than typical leads; willing to consider older tonnage with strong management.",
};
