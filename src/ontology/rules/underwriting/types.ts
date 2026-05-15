import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";
import type { SyndicatePortfolio } from "@/data/portfolio/types";

export interface UnderwritingFacts extends MarineHullSubmission {
  zone: string;
}

export interface UnderwritingContext {
  syndicate: Syndicate;
  portfolio: SyndicatePortfolio;
  currentDate: Date;
  isRenewal?: boolean;
  priorPolicy?: {
    policyId: string;
    sumInsured: number;
    premium: number;
    rate: number;
    line: number;
    lossesInPeriod: Array<{ date: string; paid: number; description: string }>;
    materialChanges?: string[];
  };
}
