import type { MarineHullSubmission } from "@/ontology/classes/marine";

export interface UnderwritingScenario {
  scenarioId: string;
  mode: "new-risk" | "renewal";
  label: string;
  shortSummary: string;
  storyline: string;
  submission: MarineHullSubmission;
  zone: string;
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
