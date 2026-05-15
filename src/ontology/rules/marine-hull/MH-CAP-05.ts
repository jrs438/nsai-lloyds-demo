import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_05: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-05",
  name: "Classification society on approved list",
  description:
    "Vessel must be classed by a society on the syndicate's approved-classification list.",
  version: "2.4.0",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.5",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const society = facts.vessel.classificationSociety;
    const approved =
      context.syndicate.classes["marine.hull"]?.appetite.minimumClassification ?? [];
    const fired = approved.includes(society);
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Class society ${society} on approved IACS list`
        : `Class society ${society} not approved`,
      factsUsed: [
        "vessel.classificationSociety",
        "syndicate.appetite.minimumClassification",
      ],
      confidence: 1.0,
    };
  },
  tags: ["class-society"],
  createdAt: "2024-01-01",
};
