import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_RAD_02: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-RAD-02",
  name: "Minimum technical rate floor",
  description:
    "Bound rate must not fall below technical floor for the vessel age band. Vessels under 5y: 0.55%; 5-15y: 0.62%; >15y: 0.70%.",
  version: "1.0.0",
  domain: "pricing",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Technical Pricing Floor 2026, Marine Hull Section",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const age = facts.vessel.vesselAgeYears;
    const floor = age <= 5 ? 0.55 : age <= 15 ? 0.62 : 0.70;
    const proposedRate = 0.66;
    const fired = proposedRate >= floor;
    return {
      fired,
      applicable: true,
      value: floor,
      reasoning: fired
        ? `Proposed rate ${(proposedRate * 100).toFixed(2)}% meets floor ${(floor * 100).toFixed(2)}% for ${age}y vessel`
        : `Proposed rate ${(proposedRate * 100).toFixed(2)}% below technical floor ${(floor * 100).toFixed(2)}% for ${age}y vessel`,
      factsUsed: ["vessel.vesselAgeYears"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "floor", "rate-adequacy"],
  createdAt: "2026-01-01",
};
