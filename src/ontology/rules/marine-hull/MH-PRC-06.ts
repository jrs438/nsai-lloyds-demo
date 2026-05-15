import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_06: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-06",
  name: "Hull material adjustment",
  description: "Adjustment for hull material — composite/aluminum typically priced differently than steel.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section F",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "expandable",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const mat = facts.vessel.hullMaterial.toLowerCase();
    let loading = 0;
    let note = "steel hull: neutral";
    if (mat.includes("aluminum") || mat.includes("aluminium")) {
      loading = 0.05;
      note = "aluminum hull: +5%";
    } else if (mat.includes("composite") || mat.includes("frp")) {
      loading = 0.03;
      note = "composite hull: +3%";
    }
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning: note,
      factsUsed: ["vessel.hullMaterial"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "hull-material"],
  createdAt: "2024-01-01",
};
