import type { UnderwritingScenario } from "./types";

// Scenario 3: Renewal where the prior period had a significant loss and
// the insured disclosed material changes (route expansion). System should
// produce a rate-action recommendation and flag the material change rule.
export const Scenario3RenewalChanges: UnderwritingScenario = {
  scenarioId: "UW-S3-RENEWAL",
  mode: "renewal",
  label: "Scenario 3 — Renewal with material changes",
  shortSummary:
    "MT Polaris renewal · 78% loss ratio · expanded route to West Africa",
  storyline:
    "Northern Star Tankers' MT Polaris is up for renewal. The expiring policy ran a 78% loss ratio (one engine room incident, $325k paid). The insured has also disclosed that the vessel will begin trading West Africa in addition to its previous North Atlantic routes — a material change requiring underwriting review. The system should: (1) flag the loss ratio approaching but not exceeding 80%, (2) trigger MH-REN-02 on material change, (3) recommend a rate increase to reflect the expanded trading area.",
  zone: "north-atlantic",
  submission: {
    submissionId: "UW-2026-0224",
    insured: {
      name: "Northern Star Tankers AS",
      domicile: "NO",
      ultimateBeneficialOwners: ["Northern Star Holdings AS"],
    },
    broker: {
      name: "Brattle & Carmichael (Lloyd's) Ltd",
      lloydsAccredited: true,
      contactRole: "Senior Marine Account Executive",
    },
    vessel: {
      name: "MT Polaris",
      imoNumber: "9748212",
      type: "Tanker",
      subClass: "MR Product Tanker",
      yearBuilt: 2018,
      vesselAgeYears: 8,
      flag: "NO",
      flagState: "Norway (NIS)",
      grossTonnage: 29_400,
      deadweight: 49_500,
      length: 183,
      hullMaterial: "Steel",
      propulsionType: "MAN B&W 6S50ME-C9.5",
      classificationSociety: "DNV",
      classStatus: "active",
      lastSurveyDate: "2025-12-08",
      surveyAgeMonths: 5,
      lastDryDockDate: "2024-05-15",
      technicalManager: "Northern Star Ship Management AS",
      ISMCompliance: true,
      detentionHistory: 0,
      iceClass: null,
    },
    coverage: {
      hullValue: 42_800_000,
      increasedValue: 8_560_000,
      interest: ["H&M", "IV"],
      deductible: 250_000,
      currency: "USD",
      inceptionDate: "2026-09-01",
      expiryDate: "2027-09-01",
      preferredWording: "LMA5395",
    },
    tradingArea: {
      description:
        "North Atlantic, Northwest Europe, AND newly added West Africa routes",
      excludedRegions: [
        "sanctioned-CU",
        "sanctioned-IR",
        "sanctioned-KP",
        "sanctioned-SY",
      ],
      primaryRoutes: [
        "NW Europe coastwise products",
        "North Atlantic crossings",
        "West Africa product trading (NEW)",
      ],
    },
    lossHistory: [
      {
        date: "2025-11-22",
        type: "Engine room fire",
        paidAmount: 325_000,
        description:
          "Fire in auxiliary engine room; minor structural damage, machinery write-off; vessel off-hire 12 days.",
        status: "Settled",
      },
    ],
    context: {
      requestedLeadLine: 0.175,
      requestedTotalPlacement: 1.0,
      inForceMarkets: [],
    },
  },
  priorPolicy: {
    policyId: "MR2891-2025-0102",
    sumInsured: 41_500_000,
    premium: 273_900,
    rate: 0.66,
    line: 0.175,
    lossesInPeriod: [
      {
        date: "2025-11-22",
        paid: 213_640,
        description: "Engine room fire (net of deductible, syndicate share)",
      },
    ],
    materialChanges: [
      "Expansion of trading area to include West Africa routes (new exposure to Gulf of Guinea piracy region)",
      "Addition of two additional charterers to operating roster (operational complexity)",
    ],
  },
};
