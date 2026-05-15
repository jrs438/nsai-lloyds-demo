import { Syndicate } from "./types";

export const MeridianSyndicate4017: Syndicate = {
  id: "SYN-4017",
  name: "Meridian Hull Syndicate 4017",
  managingAgent: "Meridian Underwriting",
  stampCapacity: 240_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A", "AM Best": "A" },
  classes: {
    "marine.hull": {
      role: "follow-only",
      appetite: {
        vesselAgeMax: 18,
        vesselValueRange: [5_000_000, 90_000_000],
        excludedFlags: ["KP", "IR", "SY"],
        excludedTradingAreas: ["sanctioned-CU", "sanctioned-IR", "sanctioned-KP", "sanctioned-SY"],
        surveyMaxAgeMonths: 30,
        leadLineSize: 0,
        followLineSize: 0.06,
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
          underwriter: 1_500_000,
          manager: 6_000_000,
          board: 45_000_000,
        },
        vesselTypes: [
          "bulk carrier",
          "tanker",
          "container",
          "general cargo",
          "offshore",
        ],
        baseRatePercent: 0.66,
      },
      performance: {
        historicalBindRate: 0.62,
        averageDaysToQuote: 1,
        mostCommonDeclineReasons: ["pricing inadequacy", "wording variance"],
      },
    },
  },
  notes: "Reliable follower with broad appetite; quick to commit once lead established.",
};
