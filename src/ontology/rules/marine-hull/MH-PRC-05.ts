import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_05: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-05",
  name: "Class society factor",
  description: "Loading or credit based on classification society tier.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section E",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "expandable",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const tier1 = ["Lloyd's Register", "DNV", "ABS"];
    const loading = tier1.includes(facts.vessel.classificationSociety)
      ? -0.01
      : 0;
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning: tier1.includes(facts.vessel.classificationSociety)
        ? `Tier-1 IACS class (${facts.vessel.classificationSociety}): -1% credit`
        : `Standard IACS class: neutral`,
      factsUsed: ["vessel.classificationSociety"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "class-society"],
  createdAt: "2024-01-01",
};
