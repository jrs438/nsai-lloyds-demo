import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_09: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-09",
  name: "Loss frequency within tolerance",
  description:
    "Five-year loss frequency must not exceed appetite. More than 3 losses in 5 years signals systemic operational issues.",
  version: "2.4.0",
  domain: "appetite",
  severity: "soft-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 5.1",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const losses = facts.lossHistory.length;
    const tolerance = 3;
    const fired = losses <= tolerance;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `${losses} loss(es) in 5y within tolerance of ${tolerance}`
        : `${losses} losses in 5y exceeds tolerance of ${tolerance}`,
      factsUsed: ["lossHistory.length"],
      confidence: 1.0,
    };
  },
  tags: ["loss-history", "frequency"],
  createdAt: "2024-01-01",
};
