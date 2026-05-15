import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_REN_03: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-REN-03",
  name: "Renewal rate movement reasonable",
  description:
    "Renewal rate change should reflect loss experience and market trend. Movement >20% in either direction requires rationale.",
  version: "1.0.0",
  domain: "pricing",
  severity: "flag",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Renewal Underwriting Standard 2026, Section 5",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (_facts, context) => {
    if (!context.isRenewal || !context.priorPolicy) {
      return {
        fired: false,
        applicable: false,
        reasoning: "Not a renewal — rule does not apply",
        factsUsed: ["context.isRenewal"],
        confidence: 1.0,
      };
    }
    const priorRate = context.priorPolicy.rate;
    const proposedRate = 0.66;
    const movement = (proposedRate - priorRate) / priorRate;
    const fired = Math.abs(movement) <= 0.20;
    return {
      fired,
      applicable: true,
      value: movement,
      reasoning: fired
        ? `Rate movement ${(movement * 100).toFixed(1)}% vs expiring — within ±20% threshold`
        : `Rate movement ${(movement * 100).toFixed(1)}% vs expiring — requires rationale`,
      factsUsed: ["priorPolicy.rate"],
      confidence: 1.0,
    };
  },
  tags: ["renewal", "rate-movement"],
  createdAt: "2026-01-01",
};
