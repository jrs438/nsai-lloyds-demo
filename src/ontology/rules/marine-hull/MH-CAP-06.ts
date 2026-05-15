import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_06: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-06",
  name: "Class status maintained",
  description: "Vessel must maintain active class — not suspended, withdrawn, or under condition.",
  version: "2.4.0",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.6",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible-on-fire",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const fired = facts.vessel.classStatus === "active";
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Class status: active`
        : `Class status: ${facts.vessel.classStatus}`,
      factsUsed: ["vessel.classStatus"],
      confidence: 1.0,
    };
  },
  tags: ["class-status"],
  createdAt: "2024-01-01",
};
