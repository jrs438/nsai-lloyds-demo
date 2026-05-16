import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

// Standard electrical-equipment exclusion. Manuscript E-2024-07
// deactivates this rule. The evaluator must check the context to see
// if this rule has been deactivated.
export const COV_EXCL_031: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-EXCL-031",
  name: "Electrical equipment exclusion (standard)",
  description:
    "Loss arising from electrical equipment malfunction is excluded under the standard LMA5395 wording, Clause 7.3.1.",
  version: "1.0.0",
  domain: "coverage",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "lma-standard",
    reference: "LMA5395 — Clause 7.3.1 (standard exclusions)",
    effective: "2002-11-01",
    lastReviewed: "2026-01-15",
    owner: "Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: (facts, context) => {
    if (context.deactivatedRules.has("COV-EXCL-031")) {
      return {
        fired: true,
        applicable: false,
        reasoning: "Standard exclusion DEACTIVATED by manuscript endorsement E-2024-07",
        factsUsed: ["manuscripts"],
        confidence: 1.0,
      };
    }
    const cause = (facts.claim.loss as { causeDetail?: string }).causeDetail ?? "";
    const triggers =
      cause.toLowerCase().includes("electrical") ||
      cause.toLowerCase().includes("hvac");
    const fired = !triggers;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? "Loss cause does not engage electrical-equipment exclusion"
        : "Loss arises from electrical equipment — standard exclusion would deny coverage",
      factsUsed: ["claim.loss.causeDetail"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "exclusion", "electrical"],
  createdAt: "2024-01-01",
  notes: "This rule is the canonical example of wording-to-rule binding. The base wording would deny coverage; a manuscripted endorsement deactivates the rule, opening coverage subject to other constraints.",
};
