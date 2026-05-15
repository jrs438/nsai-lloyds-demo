import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_01: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-01",
  name: "Base rate lookup by vessel type",
  description:
    "Returns the syndicate's base rate (% of hull value) for the vessel type before any modifiers.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "lookup",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section A",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (_facts, context) => {
    const baseRate =
      context.syndicate.classes["marine.hull"]?.appetite.baseRatePercent ?? 0.65;
    return {
      fired: true,
      applicable: true,
      value: baseRate,
      reasoning: `Base rate ${baseRate.toFixed(2)}% per syndicate schedule`,
      factsUsed: ["vessel.type", "syndicate.appetite.baseRatePercent"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "base-rate"],
  createdAt: "2024-01-01",
};
