import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

// Activated by manuscript E-2024-07. Hidden by default; only applies when
// the manuscript context turns it on.
export const COV_SUB_LIMIT_042: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-SUB-LIMIT-042",
  name: "Equipment-caused sub-limit",
  description:
    "Sub-limit caps the policy response for losses arising from equipment-caused causation. Activated by manuscript endorsement; inactive by default.",
  version: "1.0.0",
  domain: "coverage",
  severity: "condition",
  evaluationType: "lookup",
  authority: {
    type: "class-document",
    reference: "Manuscript endorsement E-2024-07 — Sub-limit clause",
    effective: "2024-07-01",
    lastReviewed: "2026-01-15",
    owner: "Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: (_facts, context) => {
    if (!context.activatedRules.has("COV-SUB-LIMIT-042")) {
      return {
        fired: false,
        applicable: false,
        reasoning: "Sub-limit rule not active for this policy (no triggering manuscript)",
        factsUsed: ["manuscripts"],
        confidence: 1.0,
      };
    }
    const params = context.ruleParameters.get("COV-SUB-LIMIT-042") ?? {};
    const subLimit = (params.subLimit as number) ?? 5_000_000;
    return {
      fired: true,
      applicable: true,
      value: subLimit,
      reasoning: `Sub-limit USD ${subLimit.toLocaleString()} applies (manuscript E-2024-07 activated)`,
      factsUsed: ["manuscripts"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "sub-limit", "manuscript-activated"],
  createdAt: "2024-07-01",
};
