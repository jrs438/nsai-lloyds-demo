import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_07: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-07",
  name: "Deductible adjustment factor",
  description: "Credit for higher deductibles; loading for sub-standard deductibles relative to hull value.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section G",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const ded = facts.coverage.deductible;
    const hv = facts.coverage.hullValue;
    const ratio = ded / hv;
    let loading = 0;
    let note: string;
    if (ratio < 0.0015) {
      loading = 0.05;
      note = `Deductible <0.15% of HV: +5% loading`;
    } else if (ratio < 0.003) {
      loading = 0;
      note = `Deductible at market norm: neutral`;
    } else if (ratio < 0.005) {
      loading = -0.025;
      note = `Higher deductible: -2.5% credit`;
    } else {
      loading = -0.04;
      note = `Significantly elevated deductible: -4% credit`;
    }
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning: note,
      factsUsed: ["coverage.deductible", "coverage.hullValue"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "deductible"],
  createdAt: "2024-01-01",
};
