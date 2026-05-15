import { Syndicate } from "./types";

export const CovenantSyndicate4421: Syndicate = {
  id: "SYN-4421",
  name: "Covenant Specialty Syndicate 4421",
  managingAgent: "Covenant Lloyd's",
  stampCapacity: 220_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A", "AM Best": "A" },
  classes: {
    "marine.hull": {
      role: "lead-capable",
      appetite: {
        vesselAgeMax: 16,
        vesselValueRange: [6_000_000, 85_000_000],
        excludedFlags: ["KP", "IR", "SY"],
        excludedTradingAreas: [
          "sanctioned-CU",
          "sanctioned-IR",
          "sanctioned-KP",
          "sanctioned-SY",
          "high-risk-RU",
        ],
        surveyMaxAgeMonths: 24,
        leadLineSize: 0.125,
        followLineSize: 0.05,
        minimumClassification: [
          "Lloyd's Register",
          "DNV",
          "ABS",
          "BV",
          "NK",
          "KR",
          "CCS",
          "RINA",
        ],
        preferredWordings: ["LMA5395", "LMA5396"],
        excludedWordings: [],
        bindAuthority: {
          underwriter: 2_250_000,
          manager: 9_000_000,
          board: 75_000_000,
        },
        vesselTypes: ["bulk carrier", "tanker", "container", "general cargo"],
        baseRatePercent: 0.67,
      },
      performance: {
        historicalBindRate: 0.36,
        averageDaysToQuote: 3,
        mostCommonDeclineReasons: ["survey age", "loss history"],
      },
    },
  },
};
