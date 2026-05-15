export const MarineHullClass = {
  id: "marine.hull",
  label: "Marine Hull",
  parent: "marine",
  description:
    "Insurance covering physical loss or damage to vessels — includes Hull & Machinery (H&M), Increased Value (IV), and War cover.",
  subclasses: [
    "marine.hull.bluewater",
    "marine.hull.brownwater",
    "marine.hull.yacht",
  ],
  requiredAttributes: [
    "vessel.imoNumber",
    "vessel.type",
    "vessel.flag",
    "vessel.yearBuilt",
    "vessel.grossTonnage",
    "vessel.hullValue",
    "vessel.lastSurveyDate",
    "tradingArea",
    "classificationSociety",
  ],
  optionalAttributes: [
    "vessel.previousNames",
    "vessel.operator",
    "vessel.charterer",
    "vessel.lossHistory",
    "vessel.engineType",
    "vessel.hullMaterial",
    "vessel.deadweight",
    "vessel.length",
    "vessel.beam",
    "vessel.draft",
    "vessel.propulsionType",
    "vessel.bowThruster",
    "vessel.dynamicPositioning",
    "vessel.iceClass",
    "vessel.classSocietySurveyStatus",
    "vessel.detentionHistory",
    "vessel.ISMCompliance",
    "vessel.lastDryDockDate",
    "vessel.nextDryDockDate",
    "operator.fleetSize",
    "operator.lossRatio5y",
    "technicalManager.name",
    "technicalManager.ISMCertified",
    "broker.lloydsAccredited",
  ],
  applicableLmaClauses: ["LMA5395", "LMA5396", "LMA5418"],
  governingLaw: "English law (default)",
} as const;

export const MarineCargoClass = {
  id: "marine.cargo",
  label: "Marine Cargo",
  parent: "marine",
  description: "Insurance covering goods in transit.",
  applicableLmaClauses: ["LMA5377", "LMA5378"],
} as const;

export interface MarineHullSubmission {
  submissionId: string;
  insured: {
    name: string;
    domicile: string;
    ultimateBeneficialOwners: string[];
  };
  broker: {
    name: string;
    lloydsAccredited: boolean;
    contactRole: string;
  };
  vessel: {
    name: string;
    imoNumber: string;
    type: string;
    subClass: string;
    yearBuilt: number;
    vesselAgeYears: number;
    flag: string;
    flagState: string;
    grossTonnage: number;
    deadweight: number;
    length: number;
    hullMaterial: string;
    propulsionType: string;
    classificationSociety: string;
    classStatus: string;
    lastSurveyDate: string;
    surveyAgeMonths: number;
    lastDryDockDate: string;
    technicalManager: string;
    ISMCompliance: boolean;
    detentionHistory: number;
    iceClass: string | null;
  };
  coverage: {
    hullValue: number;
    increasedValue: number;
    interest: string[];
    deductible: number;
    currency: string;
    inceptionDate: string;
    expiryDate: string;
    preferredWording: string;
  };
  tradingArea: {
    description: string;
    excludedRegions: string[];
    primaryRoutes: string[];
  };
  lossHistory: Array<{
    date: string;
    type: string;
    paidAmount: number;
    description: string;
    status: string;
  }>;
  context?: {
    requestedLeadLine: number;
    requestedTotalPlacement: number;
    inForceMarkets: string[];
  };
}
