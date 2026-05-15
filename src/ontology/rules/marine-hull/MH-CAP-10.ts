import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_10: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-10",
  name: "Loss severity within tolerance",
  description:
    "No single loss should exceed 25% of current hull value. Major losses indicate latent issues that may recur.",
  version: "2.4.0",
  domain: "appetite",
  severity: "referral",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 5.2",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const hullValue = facts.coverage.hullValue;
    const threshold = hullValue * 0.25;
    const maxLoss = Math.max(0, ...facts.lossHistory.map((l) => l.paidAmount));
    const fired = maxLoss <= threshold;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Largest historical loss USD ${maxLoss.toLocaleString()} within 25% threshold (USD ${threshold.toLocaleString()})`
        : `Largest historical loss USD ${maxLoss.toLocaleString()} exceeds 25% threshold (USD ${threshold.toLocaleString()})`,
      factsUsed: ["lossHistory.paidAmount", "coverage.hullValue"],
      confidence: 1.0,
    };
  },
  tags: ["loss-history", "severity"],
  createdAt: "2024-01-01",
};
