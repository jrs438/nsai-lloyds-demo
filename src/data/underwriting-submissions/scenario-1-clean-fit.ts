import type { UnderwritingScenario } from "./types";

// Scenario 1: New risk that fits cleanly into the Mercator portfolio.
// A modern blue-water tanker in an underweight zone (south-america).
export const Scenario1CleanFit: UnderwritingScenario = {
  scenarioId: "UW-S1-CLEAN",
  mode: "new-risk",
  label: "Scenario 1 — Clean fit",
  shortSummary: "Modern handysize tanker · South America trading · clean record",
  storyline:
    "Broker presents a new risk that should bind without friction: a 5-year-old chemical tanker insured by a strong Norwegian operator, trading Brazil-Europe. The zone (south-america) is underweight in Mercator's portfolio. Loss record is clean. Sum insured is mid-range. The model should produce a positive recommendation with no referrals.",
  zone: "south-america",
  submission: {
    submissionId: "UW-2026-0212",
    insured: {
      name: "Norwave Tankers AS",
      domicile: "NO",
      ultimateBeneficialOwners: ["Norwave Holdings AS (Oslo)"],
    },
    broker: {
      name: "Brattle & Carmichael (Lloyd's) Ltd",
      lloydsAccredited: true,
      contactRole: "Senior Marine Account Executive",
    },
    vessel: {
      name: "MT Nordkapp",
      imoNumber: "9912438",
      type: "Tanker",
      subClass: "Handysize Chemical Tanker (IMO Type II)",
      yearBuilt: 2021,
      vesselAgeYears: 5,
      flag: "NO",
      flagState: "Norway (NIS)",
      grossTonnage: 18_900,
      deadweight: 26_500,
      length: 159,
      hullMaterial: "Steel",
      propulsionType: "MAN B&W 6G45ME-C9.5",
      classificationSociety: "DNV",
      classStatus: "active",
      lastSurveyDate: "2025-11-12",
      surveyAgeMonths: 6,
      lastDryDockDate: "2024-08-20",
      technicalManager: "Norwave Ship Management AS",
      ISMCompliance: true,
      detentionHistory: 0,
      iceClass: "1A",
    },
    coverage: {
      hullValue: 41_500_000,
      increasedValue: 8_300_000,
      interest: ["H&M", "IV"],
      deductible: 200_000,
      currency: "USD",
      inceptionDate: "2026-06-15",
      expiryDate: "2027-06-15",
      preferredWording: "LMA5395",
    },
    tradingArea: {
      description: "Atlantic / South Atlantic chemical tanker trading",
      excludedRegions: [
        "sanctioned-CU",
        "sanctioned-IR",
        "sanctioned-KP",
        "sanctioned-SY",
      ],
      primaryRoutes: [
        "Brazil-Europe chemicals",
        "US Gulf-South America petrochem",
        "Caribbean-NW Europe",
      ],
    },
    lossHistory: [],
    context: {
      requestedLeadLine: 0.175,
      requestedTotalPlacement: 1.0,
      inForceMarkets: [],
    },
  },
};
