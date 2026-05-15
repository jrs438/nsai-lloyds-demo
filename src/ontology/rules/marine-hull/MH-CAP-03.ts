import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_03: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-03",
  name: "Vessel flag not on excluded list",
  description: "Vessel flag state must not appear on the syndicate's excluded flag list.",
  version: "2.4.1",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.3",
    effective: "2024-01-01",
    lastReviewed: "2026-03-01",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const flag = facts.vessel.flag;
    const excluded =
      context.syndicate.classes["marine.hull"]?.appetite.excludedFlags ?? [];
    const fired = !excluded.includes(flag);
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Flag ${flag} not on excluded list`
        : `Flag ${flag} appears on syndicate excluded-flag list`,
      factsUsed: ["vessel.flag", "syndicate.appetite.excludedFlags"],
      confidence: 1.0,
    };
  },
  tags: ["flag", "compliance"],
  createdAt: "2024-01-01",
};
