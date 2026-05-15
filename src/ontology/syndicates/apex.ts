import { Syndicate } from "./types";

export const ApexSyndicate1234: Syndicate = {
  id: "SYN-1234",
  name: "Apex Marine Syndicate 1234",
  managingAgent: "Apex Underwriting Ltd",
  stampCapacity: 285_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A+", "AM Best": "A" },
  classes: {
    "marine.hull": {
      role: "lead-capable",
      appetite: {
        vesselAgeMax: 15,
        vesselValueRange: [5_000_000, 80_000_000],
        excludedFlags: ["BZ", "KH", "KP", "IR"],
        excludedTradingAreas: ["sanctioned-CU", "sanctioned-IR", "sanctioned-KP", "sanctioned-SY"],
        surveyMaxAgeMonths: 24,
        leadLineSize: 0.15,
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
        preferredWordings: ["LMA5395"],
        excludedWordings: [],
        bindAuthority: {
          underwriter: 2_500_000,
          manager: 10_000_000,
          board: 80_000_000,
        },
        vesselTypes: ["bulk carrier", "tanker", "container", "general cargo"],
        baseRatePercent: 0.65,
      },
      performance: {
        historicalBindRate: 0.42,
        averageDaysToQuote: 3,
        mostCommonDeclineReasons: ["vessel age", "flag state", "survey age"],
      },
    },
  },
  notes: "Established marine lead market; consistent appetite for blue-water tonnage of modern vintage.",
};
