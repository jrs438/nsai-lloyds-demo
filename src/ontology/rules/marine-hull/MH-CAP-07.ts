import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_07: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-07",
  name: "Condition survey within currency threshold",
  description:
    "Vessel condition survey must be within currency threshold defined by syndicate appetite. Stale surveys indicate elevated risk of undetected wear, particularly for older vessels.",
  version: "2.3.1",
  domain: "appetite",
  severity: "condition",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.3, Section 4.2.1.b",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const surveyAge = facts.vessel.surveyAgeMonths;
    const max =
      context.syndicate.classes["marine.hull"]?.appetite.surveyMaxAgeMonths ?? 24;

    if (surveyAge === null || surveyAge === undefined) {
      return {
        fired: false,
        applicable: false,
        reasoning: "Survey date not provided in submission; rule cannot evaluate",
        factsUsed: ["vessel.surveyAgeMonths"],
        confidence: 1.0,
      };
    }

    const fired = surveyAge <= max;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Survey age ${surveyAge}mo within ${max}mo threshold`
        : `Survey age ${surveyAge}mo exceeds ${max}mo threshold`,
      factsUsed: ["vessel.surveyAgeMonths", "syndicate.appetite.surveyMaxAgeMonths"],
      confidence: 1.0,
    };
  },
  failureMessage: (facts, context) =>
    `Condition survey dated ${facts.vessel.lastSurveyDate} is ${facts.vessel.surveyAgeMonths} months old, ` +
    `exceeding ${context.syndicate.name}'s ${context.syndicate.classes["marine.hull"]?.appetite.surveyMaxAgeMonths}-month appetite threshold.`,
  remediation: () => [
    "Request updated condition survey from insured",
    "Obtain class society confirmation that vessel is in good standing as of latest survey",
    "If survey cannot be updated, consider alternative markets with longer appetite thresholds",
  ],
  tags: ["survey", "vessel-condition", "documentation"],
  createdAt: "2024-01-01",
  notes:
    "Threshold lowered from 30mo to 24mo in 2026 following adverse loss experience on stale-survey accounts.",
};
