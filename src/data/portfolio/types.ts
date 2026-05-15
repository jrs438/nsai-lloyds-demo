export interface BoundRisk {
  policyId: string;
  insured: string;
  vesselName?: string;
  class: string;
  zone: string;
  peril: string[];
  sumInsured: number;
  premium: number;
  rate: number;
  line: number;
  inceptionDate: string;
  expiryDate: string;
  status: "bound" | "lapsed" | "claimed";
  notes?: string;
}

export interface ZoneAggregate {
  zone: string;
  sumInsured: number;
  premium: number;
  riskCount: number;
  limit: number;
  utilization: number;
}

export interface ClassAggregate {
  class: string;
  sumInsured: number;
  premium: number;
  riskCount: number;
  averageRate: number;
}

export interface TreatyAttachment {
  layer: string;
  attachment: number;
  limit: number;
  reinsurer: string;
  premiumCession: number;
  status: "below-attachment" | "approaching" | "at-attachment" | "exhausted";
  currentExposure: number;
}

export interface SyndicatePortfolio {
  syndicateId: string;
  syndicateName: string;
  yearOfAccount: number;
  stampCapacity: number;
  asOfDate: string;
  bookSummary: {
    totalRisks: number;
    totalSumInsured: number;
    totalPremium: number;
    averageRate: number;
    capacityUtilization: number;
  };
  risks: BoundRisk[];
  zoneAggregates: ZoneAggregate[];
  classAggregates: ClassAggregate[];
  treaties: {
    quotaShare: {
      cession: number;
      reinsurer: string;
      premiumCeded: number;
    };
    surplus: {
      lines: number;
      reinsurer: string;
    };
    excessOfLoss: TreatyAttachment[];
  };
}
