import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

// Standard deductible, modifiable by manuscripts (e.g. E-2024-07
// raises it to USD 250,000 for this peril).
export const COV_DED_001: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-DED-001",
  name: "Per-occurrence deductible",
  description:
    "Standard policy deductible applies to each occurrence. May be modified by manuscript endorsement on a peril-specific basis.",
  version: "1.0.0",
  domain: "coverage",
  severity: "condition",
  evaluationType: "lookup",
  authority: {
    type: "lma-standard",
    reference: "LMA5395 — Clause 5.1 (deductible)",
    effective: "2002-11-01",
    lastReviewed: "2026-01-15",
    owner: "Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: (facts, context) => {
    const baseDeductible = facts.claim.policy.deductible;
    const params = context.ruleParameters.get("COV-DED-001");
    const modifiedDeductible = params ? (params.deductible as number) : baseDeductible;
    const wasModified = modifiedDeductible !== baseDeductible;
    return {
      fired: true,
      applicable: true,
      value: modifiedDeductible,
      reasoning: wasModified
        ? `Deductible USD ${modifiedDeductible.toLocaleString()} (modified by manuscript from base USD ${baseDeductible.toLocaleString()})`
        : `Deductible USD ${baseDeductible.toLocaleString()} per occurrence`,
      factsUsed: ["claim.policy.deductible", "manuscripts"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "deductible"],
  createdAt: "2024-01-01",
};
