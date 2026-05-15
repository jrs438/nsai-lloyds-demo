import type { UnderwritingScenario } from "./types";

// Scenario 2: New risk where the underlying risk is fine but binding it
// pushes the Asia-Pacific zone aggregate close to its limit — triggers
// portfolio-level referral despite a "clean" individual risk.
export const Scenario2PortfolioConstrained: UnderwritingScenario = {
  scenarioId: "UW-S2-AGG",
  mode: "new-risk",
  label: "Scenario 2 — Portfolio-constrained",
  shortSummary:
    "Large bulker · Asia-Pacific · risk is fine but zone aggregate at threshold",
  storyline:
    "Broker presents a large Capesize bulker insured by an existing Mercator client. The vessel and operator are perfectly within appetite at the individual level. But Asia-Pacific is already Mercator's highest concentration zone, and binding this large risk would push the zone aggregate above the 90% threshold. The system identifies this as a portfolio constraint that would not be visible from rule-by-rule review of the submission alone.",
  zone: "asia-pacific",
  submission: {
    submissionId: "UW-2026-0218",
    insured: {
      name: "Pacific Maritime Holdings",
      domicile: "SG",
      ultimateBeneficialOwners: [
        "Pacific Holdings (BVI) Ltd",
        "Wei Family Trust (Singapore)",
      ],
    },
    broker: {
      name: "Far East Marine Brokers Ltd",
      lloydsAccredited: true,
      contactRole: "Marine Hull Broker",
    },
    vessel: {
      name: "MV Coral Phoenix",
      imoNumber: "9876123",
      type: "Bulk Carrier",
      subClass: "Capesize",
      yearBuilt: 2019,
      vesselAgeYears: 7,
      flag: "SG",
      flagState: "Singapore",
      grossTonnage: 99_200,
      deadweight: 198_500,
      length: 299,
      hullMaterial: "Steel",
      propulsionType: "MAN B&W 6G70ME-C9.5",
      classificationSociety: "DNV",
      classStatus: "active",
      lastSurveyDate: "2025-08-15",
      surveyAgeMonths: 9,
      lastDryDockDate: "2024-11-22",
      technicalManager: "Pacific Maritime Technical Services Pte Ltd",
      ISMCompliance: true,
      detentionHistory: 0,
      iceClass: null,
    },
    coverage: {
      hullValue: 78_000_000,
      increasedValue: 15_600_000,
      interest: ["H&M", "IV"],
      deductible: 400_000,
      currency: "USD",
      inceptionDate: "2026-06-30",
      expiryDate: "2027-06-30",
      preferredWording: "LMA5395",
    },
    tradingArea: {
      description: "Worldwide ex sanctioned regions; primary Asia-Pacific iron ore trade",
      excludedRegions: [
        "sanctioned-CU",
        "sanctioned-IR",
        "sanctioned-KP",
        "sanctioned-SY",
      ],
      primaryRoutes: [
        "Australia-China iron ore",
        "Brazil-China iron ore",
        "Indonesia-China coal",
      ],
    },
    lossHistory: [
      {
        date: "2024-04-12",
        type: "Heavy weather damage",
        paidAmount: 180_000,
        description:
          "Deck rail and hatch cover damage in South China Sea typhoon; vessel off-hire 3 days.",
        status: "Settled",
      },
    ],
    context: {
      requestedLeadLine: 0.20,
      requestedTotalPlacement: 1.0,
      inForceMarkets: [],
    },
  },
};
