import { Syndicate } from "./types";

export const SalientSyndicate3892: Syndicate = {
  id: "SYN-3892",
  name: "Salient Marine Syndicate 3892",
  managingAgent: "Salient Lloyd's Underwriting",
  stampCapacity: 175_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A", "AM Best": "A-" },
  classes: {
    "marine.hull": {
      role: "lead-capable",
      appetite: {
        vesselAgeMax: 17,
        vesselValueRange: [4_000_000, 70_000_000],
        excludedFlags: ["BZ", "KH", "KP", "IR", "TG"],
        excludedTradingAreas: ["sanctioned-CU", "sanctioned-IR", "sanctioned-KP", "sanctioned-SY"],
        surveyMaxAgeMonths: 24,
        leadLineSize: 0.10,
        followLineSize: 0.04,
        minimumClassification: [
          "Lloyd's Register",
          "DNV",
          "ABS",
          "BV",
          "NK",
          "KR",
        ],
        preferredWordings: ["LMA5395"],
        excludedWordings: ["LMA5418"],
        bindAuthority: {
          underwriter: 1_500_000,
          manager: 6_500_000,
          board: 50_000_000,
        },
        vesselTypes: ["bulk carrier", "tanker", "general cargo"],
        baseRatePercent: 0.71,
      },
      performance: {
        historicalBindRate: 0.34,
        averageDaysToQuote: 4,
        mostCommonDeclineReasons: ["loss frequency", "survey age", "operator"],
      },
    },
  },
};
