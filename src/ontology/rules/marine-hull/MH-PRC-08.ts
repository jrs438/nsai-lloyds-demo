import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_08: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-08",
  name: "Wording variance adjustment",
  description:
    "Adjustment when the requested wording differs from syndicate's preferred wording — manuscripted wordings typically attract a load.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section H",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "expandable",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const requested = facts.coverage.preferredWording;
    const preferred =
      context.syndicate.classes["marine.hull"]?.appetite.preferredWordings ?? [];
    const fired = preferred.includes(requested);
    const loading = fired ? 0 : 0.02;
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning: fired
        ? `${requested} aligns with syndicate's preferred wording: neutral`
        : `${requested} differs from preferred wordings (${preferred.join(", ")}): +2% load`,
      factsUsed: [
        "coverage.preferredWording",
        "syndicate.appetite.preferredWordings",
      ],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "wording"],
  createdAt: "2024-01-01",
};
