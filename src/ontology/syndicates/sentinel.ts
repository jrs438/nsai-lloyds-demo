import { Syndicate } from "./types";

export const SentinelSyndicate6248: Syndicate = {
  id: "SYN-6248",
  name: "Sentinel Marine Syndicate 6248",
  managingAgent: "Sentinel Managing Agency",
  stampCapacity: 165_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A-", "AM Best": "A-" },
  classes: {
    "marine.hull": {
      role: "follow-only",
      appetite: {
        vesselAgeMax: 14,
        vesselValueRange: [3_000_000, 50_000_000],
        excludedFlags: ["BZ", "KH", "KP", "IR", "MN", "TG", "VC"],
        excludedTradingAreas: [
          "sanctioned-CU",
          "sanctioned-IR",
          "sanctioned-KP",
          "sanctioned-SY",
          "high-risk-RU",
          "high-risk-GOA",
        ],
        surveyMaxAgeMonths: 18,
        leadLineSize: 0,
        followLineSize: 0.035,
        minimumClassification: ["Lloyd's Register", "DNV", "ABS"],
        preferredWordings: ["LMA5395"],
        excludedWordings: ["LMA5418"],
        bindAuthority: {
          underwriter: 1_000_000,
          manager: 4_000_000,
          board: 35_000_000,
        },
        vesselTypes: ["bulk carrier", "tanker", "container"],
        baseRatePercent: 0.72,
      },
      performance: {
        historicalBindRate: 0.55,
        averageDaysToQuote: 2,
        mostCommonDeclineReasons: ["flag state", "vessel age", "class society"],
      },
    },
  },
  notes: "Smaller follow-only player; very strict standards.",
};
