import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_02: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-02",
  name: "Hull value within syndicate range",
  description:
    "Insured hull value must fall within the syndicate's stated value-range appetite.",
  version: "2.4.0",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.2",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const value = facts.coverage.hullValue;
    const [min, max] =
      context.syndicate.classes["marine.hull"]?.appetite.vesselValueRange ?? [0, 0];
    const fired = value >= min && value <= max;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Hull value USD ${value.toLocaleString()} within range`
        : `Hull value USD ${value.toLocaleString()} outside range [${min.toLocaleString()}, ${max.toLocaleString()}]`,
      factsUsed: ["coverage.hullValue", "syndicate.appetite.vesselValueRange"],
      confidence: 1.0,
    };
  },
  tags: ["value", "capacity"],
  createdAt: "2024-01-01",
};
