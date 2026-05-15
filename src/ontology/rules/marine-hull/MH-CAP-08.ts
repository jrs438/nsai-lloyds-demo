import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_08: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-08",
  name: "Vessel type within class appetite",
  description: "Vessel type (bulk carrier, tanker, container, etc.) must match syndicate appetite.",
  version: "2.4.0",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.7",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const type = facts.vessel.type.toLowerCase();
    const allowed = (
      context.syndicate.classes["marine.hull"]?.appetite.vesselTypes ?? []
    ).map((v) => v.toLowerCase());
    const fired = allowed.some((a) => type.includes(a) || a.includes(type));
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Vessel type "${facts.vessel.type}" matches syndicate appetite`
        : `Vessel type "${facts.vessel.type}" not within syndicate appetite`,
      factsUsed: ["vessel.type", "syndicate.appetite.vesselTypes"],
      confidence: 1.0,
    };
  },
  tags: ["vessel-type"],
  createdAt: "2024-01-01",
};
