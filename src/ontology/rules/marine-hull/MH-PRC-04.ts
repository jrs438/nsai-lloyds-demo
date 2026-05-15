import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_04: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-04",
  name: "Loss experience credit / loading",
  description:
    "Credit for clean loss record; loading for adverse experience. Computed on 5y losses vs expected.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section D (Loss Experience)",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const losses = facts.lossHistory.length;
    const totalPaid = facts.lossHistory.reduce(
      (sum, l) => sum + l.paidAmount,
      0,
    );
    const lossRatio = totalPaid / (facts.coverage.hullValue * 0.05);
    let loading = 0;
    let note = "no losses: -5% experience credit";
    if (losses === 0) {
      loading = -0.05;
    } else if (lossRatio < 0.5) {
      loading = -0.03;
      note = `1 minor loss (USD ${totalPaid.toLocaleString()}): -3% experience credit`;
    } else if (lossRatio < 1) {
      loading = 0;
      note = `${losses} loss(es) at expected level: neutral`;
    } else {
      loading = 0.08;
      note = `Adverse loss experience: +8% loading`;
    }
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning: note,
      factsUsed: ["lossHistory", "coverage.hullValue"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "loss-history"],
  createdAt: "2024-01-01",
};
