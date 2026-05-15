import type { MarineHullSubmission } from "@/ontology/classes/marine";

export const MarineHullSubmissionA: MarineHullSubmission = {
  submissionId: "MH-2026-0142",
  insured: {
    name: "Albacore Marine Ltd",
    domicile: "GB",
    ultimateBeneficialOwners: ["Albacore Holdings (Cayman) Ltd"],
  },
  broker: {
    name: "Hartwell Marine Brokers Ltd",
    lloydsAccredited: true,
    contactRole: "Marine Hull Account Executive",
  },
  vessel: {
    name: "MV Atlantic Pioneer",
    imoNumber: "9521843",
    type: "Bulk Carrier",
    subClass: "Capesize",
    yearBuilt: 2014,
    vesselAgeYears: 12,
    flag: "LR",
    flagState: "Liberia",
    grossTonnage: 92_500,
    deadweight: 180_000,
    length: 292,
    hullMaterial: "Steel",
    propulsionType: "MAN B&W 6S70MC-C8",
    classificationSociety: "DNV",
    classStatus: "active",
    lastSurveyDate: "2024-03-15",
    surveyAgeMonths: 26,
    lastDryDockDate: "2023-08-10",
    technicalManager: "Albacore Ship Management Ltd",
    ISMCompliance: true,
    detentionHistory: 1,
    iceClass: null,
  },
  coverage: {
    hullValue: 47_500_000,
    increasedValue: 9_500_000,
    interest: ["H&M", "IV"],
    deductible: 150_000,
    currency: "USD",
    inceptionDate: "2026-06-01",
    expiryDate: "2027-06-01",
    preferredWording: "LMA5395",
  },
  tradingArea: {
    description: "Worldwide trading limits excluding sanctioned regions",
    excludedRegions: [
      "sanctioned-CU",
      "sanctioned-IR",
      "sanctioned-KP",
      "sanctioned-SY",
    ],
    primaryRoutes: [
      "Brazil-China iron ore",
      "Australia-Japan coal",
      "US Gulf-NW Europe grain",
    ],
  },
  lossHistory: [
    {
      date: "2023-09-04",
      type: "Contact damage — fender impact",
      paidAmount: 240_000,
      description:
        "Berthing incident at Port Hedland during gale conditions; minor plating damage to port quarter; vessel returned to service after 4-day repair.",
      status: "Settled",
    },
  ],
  context: {
    requestedLeadLine: 0.125,
    requestedTotalPlacement: 1.0,
    inForceMarkets: [],
  },
};
