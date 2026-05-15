import type { MarineHullSubmission } from "@/ontology/classes/marine";

// Submission B — Clean fit, modern handysize tanker
export const MarineHullSubmissionB: MarineHullSubmission = {
  submissionId: "MH-2026-0148",
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
    name: "MT Nordlys",
    imoNumber: "9847216",
    type: "Tanker",
    subClass: "Handysize Chemical Tanker",
    yearBuilt: 2020,
    vesselAgeYears: 6,
    flag: "NO",
    flagState: "Norway (NIS)",
    grossTonnage: 18_400,
    deadweight: 25_000,
    length: 158,
    hullMaterial: "Steel (IMO Type II)",
    propulsionType: "MAN B&W 6G45ME-C9.5",
    classificationSociety: "DNV",
    classStatus: "active",
    lastSurveyDate: "2025-09-20",
    surveyAgeMonths: 8,
    lastDryDockDate: "2024-04-12",
    technicalManager: "Northern Star Ship Management AS",
    ISMCompliance: true,
    detentionHistory: 0,
    iceClass: "1A",
  },
  coverage: {
    hullValue: 38_000_000,
    increasedValue: 7_600_000,
    interest: ["H&M", "IV"],
    deductible: 200_000,
    currency: "USD",
    inceptionDate: "2026-07-01",
    expiryDate: "2027-07-01",
    preferredWording: "LMA5395",
  },
  tradingArea: {
    description: "North Atlantic / Northern European trading",
    excludedRegions: [
      "sanctioned-CU",
      "sanctioned-IR",
      "sanctioned-KP",
      "sanctioned-SY",
    ],
    primaryRoutes: [
      "NW Europe coastwise chemicals",
      "Northern Europe / North Atlantic",
    ],
  },
  lossHistory: [],
  context: {
    requestedLeadLine: 0.15,
    requestedTotalPlacement: 1.0,
    inForceMarkets: [],
  },
};
