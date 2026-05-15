import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_REN_01: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-REN-01",
  name: "Renewal loss ratio acceptable",
  description:
    "On renewal, prior policy loss ratio (losses / premium) must be within tolerance. Loss ratio > 80% requires rate increase or referral.",
  version: "1.0.0",
  domain: "pricing",
  severity: "referral",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Renewal Underwriting Standard 2026, Section 3",
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
    const lossTotal = context.priorPolicy.lossesInPeriod.reduce(
      (s, l) => s + l.paid,
      0,
    );
    const lossRatio = lossTotal / context.priorPolicy.premium;
    const fired = lossRatio <= 0.80;
    return {
      fired,
      applicable: true,
      value: lossRatio,
      reasoning: fired
        ? `Prior policy loss ratio ${(lossRatio * 100).toFixed(1)}% within 80% tolerance`
        : `Prior policy loss ratio ${(lossRatio * 100).toFixed(1)}% exceeds 80% — requires rate action`,
      factsUsed: ["priorPolicy.lossesInPeriod", "priorPolicy.premium"],
      confidence: 1.0,
    };
  },
  tags: ["renewal", "loss-ratio"],
  createdAt: "2026-01-01",
};
