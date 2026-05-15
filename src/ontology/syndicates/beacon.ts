import { Syndicate } from "./types";

export const BeaconSyndicate5067: Syndicate = {
  id: "SYN-5067",
  name: "Beacon Specialty Syndicate 5067",
  managingAgent: "Beacon Underwriting Group",
  stampCapacity: 310_000_000,
  yearOfAccount: 2026,
  ratings: { "S&P": "A+", "AM Best": "A+" },
  classes: {
    "marine.hull": {
      role: "lead-capable",
      appetite: {
        vesselAgeMax: 18,
        vesselValueRange: [8_000_000, 100_000_000],
        excludedFlags: ["KP", "IR", "SY"],
        excludedTradingAreas: ["sanctioned-CU", "sanctioned-IR", "sanctioned-KP", "sanctioned-SY"],
        surveyMaxAgeMonths: 30,
        leadLineSize: 0.175,
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
          underwriter: 3_000_000,
          manager: 12_000_000,
          board: 100_000_000,
        },
        vesselTypes: [
          "bulk carrier",
          "tanker",
          "container",
          "general cargo",
          "ro-ro",
        ],
        baseRatePercent: 0.66,
      },
      performance: {
        historicalBindRate: 0.39,
        averageDaysToQuote: 3,
        mostCommonDeclineReasons: ["loss severity", "trading area"],
      },
    },
  },
  notes: "Strong technical underwriting; pragmatic on age threshold given good loss record.",
};
