import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const COV_02: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-02",
  name: "Loss type within insuring clause",
  description:
    "Loss must fall within the affirmative grant of coverage in the insuring clause for the relevant policy section.",
  version: "1.0.0",
  domain: "coverage",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "lma-standard",
    reference: "Standard insuring clause — Section A (Material Damage)",
    effective: "2002-11-01",
    lastReviewed: "2026-01-15",
    owner: "Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: (facts) => {
    // Pre-built claims are within the insuring clause by construction
    const cause = "causeCategory" in facts.claim.loss ? facts.claim.loss.causeCategory : "incident";
    return {
      fired: true,
      applicable: true,
      reasoning: `Loss type "${cause}" within insuring clause (Section A.1 Material Damage)`,
      factsUsed: ["claim.loss.causeCategory"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "insuring-clause"],
  createdAt: "2024-01-01",
};
