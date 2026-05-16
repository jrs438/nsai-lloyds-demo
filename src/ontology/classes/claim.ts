export type ClaimType = "marine" | "property" | "cyber" | "liability";

export type ClaimStatus =
  | "first-notice"
  | "investigating"
  | "reserved"
  | "in-settlement"
  | "settled"
  | "denied"
  | "litigation";

export interface BaseClaim {
  claimId: string;
  policyId: string;
  type: ClaimType;
  status: ClaimStatus;
  lossDate: string;
  noticeDate: string;
  insured: {
    name: string;
    domicile: string;
  };
  jurisdiction: string;
  alleged: {
    cause: string;
    quantum: number;
    currency: string;
    description: string;
  };
  policy: {
    wording: string;
    manuscriptEndorsements: string[];
    inceptionDate: string;
    expiryDate: string;
    limit: number;
    deductible: number;
    sumInsured?: number;
  };
  externalReports: Array<{
    type: "surveyor" | "loss-adjuster" | "lawyer" | "expert";
    firm: string;
    dateReceived: string;
    summary: string;
  }>;
}

export interface PropertyClaim extends BaseClaim {
  type: "property";
  property: {
    type: string;
    location: string;
    construction: string;
    yearBuilt: number;
  };
  loss: {
    causeCategory: "fire" | "flood" | "windstorm" | "machinery-breakdown" | "theft" | "other";
    causeDetail: string;
    elementsAffected: string[];
    businessInterruption: boolean;
    estimatedDaysOffline?: number;
  };
}

export interface MarineClaim extends BaseClaim {
  type: "marine";
  vessel: {
    name: string;
    imoNumber: string;
    type: string;
  };
  loss: {
    causeCategory: "collision" | "grounding" | "heavy-weather" | "fire" | "machinery" | "cargo-damage" | "other";
    causeDetail: string;
    subrogationPotential: "high" | "medium" | "low" | "none";
    thirdPartyInvolved?: string;
  };
}

export interface CyberClaim extends BaseClaim {
  type: "cyber";
  insuredOperations: {
    industry: string;
    employees: number;
    annualRevenue: number;
  };
  loss: {
    incidentType: "ransomware" | "data-breach" | "bec" | "dos" | "other";
    incidentDetail: string;
    forensicsFirm: string;
    daysToDetection: number;
    dataExfiltrated: boolean;
    recordsAffected?: number;
    ransomDemand?: number;
    ransomPaid?: number;
    businessInterruption: boolean;
    estimatedDaysOffline?: number;
  };
}

export type AnyClaim = PropertyClaim | MarineClaim | CyberClaim;

export interface ClaimDecision {
  coveragePosition: "covered" | "covered-with-sublimit" | "partially-covered" | "denied" | "investigating";
  netPolicyResponse: number;
  recommendedInitialReserve: number;
  settlementStrategy: string;
  defenceCounsel?: Array<{
    firm: string;
    location: string;
    rateGuide: string;
    relevantExperience: string;
  }>;
  venueAnalysis?: {
    jurisdiction: string;
    settlementToTrialRatio: string;
    averageSettlementMonths: number;
    notableCases: string[];
  };
  subrogationPath?: string;
  underwritingFeedback: string[];
}
