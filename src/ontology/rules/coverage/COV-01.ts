import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const COV_01: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-01",
  name: "Loss within policy period",
  description:
    "Loss date must fall within the policy period of insurance for coverage to attach.",
  version: "1.0.0",
  domain: "coverage",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "lma-standard",
    reference: "Standard insuring clause — temporal scope",
    effective: "2002-11-01",
    lastReviewed: "2026-01-15",
    owner: "Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: (facts) => {
    const loss = new Date(facts.claim.lossDate);
    const start = new Date(facts.claim.policy.inceptionDate);
    const end = new Date(facts.claim.policy.expiryDate);
    const fired = loss >= start && loss <= end;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Loss ${facts.claim.lossDate} within period ${facts.claim.policy.inceptionDate} to ${facts.claim.policy.expiryDate}`
        : `Loss ${facts.claim.lossDate} outside policy period`,
      factsUsed: ["claim.lossDate", "claim.policy.inceptionDate", "claim.policy.expiryDate"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "policy-period"],
  createdAt: "2024-01-01",
};
