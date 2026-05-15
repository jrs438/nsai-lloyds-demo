import { Syndicate } from "./types";

export const IroncladSyndicate3412: Syndicate = {
  id: "SYN-3412",
  name: "Ironclad Marine Syndicate 3412",
  managingAgent: "Ironclad Managing Agency",
  stampCapacity: 195_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A", "AM Best": "A" },
  classes: {
    "marine.hull": {
      role: "lead-capable",
      appetite: {
        vesselAgeMax: 12,
        vesselValueRange: [10_000_000, 60_000_000],
        excludedFlags: ["BZ", "KH", "KP", "IR", "MN", "TG"],
        excludedTradingAreas: [
          "sanctioned-CU",
          "sanctioned-IR",
          "sanctioned-KP",
          "sanctioned-SY",
          "high-risk-GOA",
        ],
        surveyMaxAgeMonths: 18,
        leadLineSize: 0.125,
        followLineSize: 0.04,
        minimumClassification: ["Lloyd's Register", "DNV", "ABS", "BV"],
        preferredWordings: ["LMA5395"],
        excludedWordings: [],
        bindAuthority: {
          underwriter: 1_750_000,
          manager: 7_500_000,
          board: 60_000_000,
        },
        vesselTypes: ["bulk carrier", "tanker", "container"],
        baseRatePercent: 0.62,
      },
      performance: {
        historicalBindRate: 0.28,
        averageDaysToQuote: 4,
        mostCommonDeclineReasons: ["vessel age", "class society", "flag state"],
      },
    },
  },
  notes: "Conservative appetite; favors first-class IACS members and modern tonnage only.",
};
