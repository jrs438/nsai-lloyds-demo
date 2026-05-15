import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_02: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-02",
  name: "Age loading factor",
  description:
    "Applies an age-based rate loading. Curve: 0% for vessels ≤5y, +1% per year above 5y.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section B (Age Loading)",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const age = facts.vessel.vesselAgeYears;
    const loading = age <= 5 ? 0 : (age - 5) * 0.01;
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning:
        loading === 0
          ? `Vessel ≤5y: no age loading`
          : `Vessel ${age}y: +${(loading * 100).toFixed(0)}% age loading`,
      factsUsed: ["vessel.vesselAgeYears"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "age"],
  createdAt: "2024-01-01",
};
