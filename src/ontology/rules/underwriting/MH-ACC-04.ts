import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_ACC_04: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-ACC-04",
  name: "Stamp capacity utilization",
  description:
    "Confirm post-bind premium income remains within stamp capacity. Hard cap at 95% of stamp.",
  version: "1.0.0",
  domain: "accumulation",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "regulatory",
    reference: "Lloyd's Premium Income Monitoring Standard",
    effective: "2026-01-01",
    lastReviewed: "2026-02-01",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const indicativePremium = facts.coverage.hullValue * 0.0066;
    const newTotal = context.portfolio.bookSummary.totalPremium + indicativePremium;
    const utilization = newTotal / context.portfolio.stampCapacity;
    const fired = utilization <= 0.95;
    return {
      fired,
      applicable: true,
      value: utilization,
      reasoning: fired
        ? `Post-bind premium income ${(utilization * 100).toFixed(1)}% of stamp — within 95% cap`
        : `Post-bind premium income ${(utilization * 100).toFixed(1)}% of stamp — exceeds 95% cap`,
      factsUsed: [
        "coverage.hullValue",
        "portfolio.bookSummary.totalPremium",
        "syndicate.stampCapacity",
      ],
      confidence: 1.0,
    };
  },
  tags: ["stamp-capacity", "premium-income"],
  createdAt: "2026-01-01",
};
