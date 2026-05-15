import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_01: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-01",
  name: "Vessel age within syndicate threshold",
  description:
    "Vessel age must not exceed the syndicate's maximum age appetite for the marine hull class.",
  version: "2.4.0",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.1",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const age = facts.vessel.vesselAgeYears;
    const max = context.syndicate.classes["marine.hull"]?.appetite.vesselAgeMax ?? 0;
    const fired = age <= max;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Vessel age ${age}y within ${max}y threshold`
        : `Vessel age ${age}y exceeds ${max}y threshold`,
      factsUsed: ["vessel.vesselAgeYears", "syndicate.appetite.vesselAgeMax"],
      confidence: 1.0,
    };
  },
  failureMessage: (facts, context) =>
    `Vessel age ${facts.vessel.vesselAgeYears}y exceeds ${context.syndicate.name}'s ${context.syndicate.classes["marine.hull"]?.appetite.vesselAgeMax}y appetite threshold.`,
  tags: ["age", "vessel"],
  createdAt: "2024-01-01",
};
