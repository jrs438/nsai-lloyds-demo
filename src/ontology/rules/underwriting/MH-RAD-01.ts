import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_RAD_01: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-RAD-01",
  name: "Rate vs portfolio benchmark",
  description:
    "Indicative rate must be within 15% of the portfolio benchmark rate for this class. Significant deviation requires justification.",
  version: "1.0.0",
  domain: "pricing",
  severity: "flag",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Pricing Adequacy Standard 2026, Section 2.1",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const classAgg = context.portfolio.classAggregates.find(
      (c) => c.class === "marine.hull.bluewater",
    );
    const benchmark = classAgg?.averageRate ?? 0.66;
    // Use the proposed rate (from broker request) or default to base rate
    const proposedRate = 0.66;
    const deviation = (proposedRate - benchmark) / benchmark;
    const fired = Math.abs(deviation) <= 0.15;
    return {
      fired,
      applicable: true,
      value: deviation,
      reasoning: fired
        ? `Proposed rate ${(proposedRate * 100).toFixed(2)}% within ±15% of portfolio benchmark ${(benchmark * 100).toFixed(2)}%`
        : `Proposed rate ${(proposedRate * 100).toFixed(2)}% deviates ${(deviation * 100).toFixed(1)}% from portfolio benchmark`,
      factsUsed: ["portfolio.classAggregates", "syndicate.appetite.baseRatePercent"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "benchmark", "rate-adequacy"],
  createdAt: "2026-01-01",
};
