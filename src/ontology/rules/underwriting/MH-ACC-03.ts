import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_ACC_03: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-ACC-03",
  name: "Treaty attachment proximity warning",
  description:
    "Flag when the line size on a single risk approaches the first XL treaty attachment point.",
  version: "1.0.0",
  domain: "accumulation",
  severity: "flag",
  evaluationType: "boolean",
  authority: {
    type: "treaty",
    reference: "2026 Reinsurance Treaty — XL Programme",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Reinsurance Manager",
  },
  auditability: "visible-on-fire",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const requestedLine = facts.context?.requestedLeadLine ?? 0.10;
    const exposure = facts.coverage.hullValue * requestedLine;
    const firstAttach = context.portfolio.treaties.excessOfLoss[0]?.attachment ?? Infinity;
    const ratio = exposure / firstAttach;
    const fired = ratio < 0.40;
    return {
      fired,
      applicable: true,
      value: ratio,
      reasoning: fired
        ? `Net retained line USD ${exposure.toLocaleString()} is ${(ratio * 100).toFixed(0)}% of first XL attachment — comfortable margin`
        : `Net retained line USD ${exposure.toLocaleString()} is ${(ratio * 100).toFixed(0)}% of first XL attachment — material exposure to retention`,
      factsUsed: [
        "coverage.hullValue",
        "context.requestedLeadLine",
        "portfolio.treaties.excessOfLoss",
      ],
      confidence: 1.0,
    };
  },
  tags: ["treaty", "xl", "retention"],
  createdAt: "2026-01-01",
};
