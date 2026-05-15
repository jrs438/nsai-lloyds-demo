import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_ACC_02: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-ACC-02",
  name: "Single insured concentration limit",
  description:
    "No single insured (and its affiliated entities) should account for more than 12% of the syndicate's total marine hull exposure.",
  version: "1.0.0",
  domain: "accumulation",
  severity: "referral",
  evaluationType: "boolean",
  authority: {
    type: "board-policy",
    reference: "Board Underwriting Policy 2026, Section 4.3 — Concentration Risk",
    effective: "2026-01-01",
    lastReviewed: "2026-02-01",
    owner: "Chief Underwriting Officer",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const insuredName = facts.insured.name;
    const existingExposure = context.portfolio.risks
      .filter((r) => r.insured.toLowerCase().includes(insuredName.toLowerCase().split(" ")[0]))
      .reduce((sum, r) => sum + r.sumInsured * r.line, 0);
    const requestedLine = facts.context?.requestedLeadLine ?? 0.10;
    const newExposure = facts.coverage.hullValue * requestedLine;
    const totalExposure = existingExposure + newExposure;
    const concentrationPct = totalExposure / context.portfolio.bookSummary.totalSumInsured;
    const fired = concentrationPct <= 0.12;
    return {
      fired,
      applicable: true,
      value: concentrationPct,
      reasoning: fired
        ? `Post-bind concentration ${(concentrationPct * 100).toFixed(2)}% of book — within 12% threshold`
        : `Post-bind concentration ${(concentrationPct * 100).toFixed(2)}% of book — exceeds 12% threshold`,
      factsUsed: [
        "insured.name",
        "coverage.hullValue",
        "portfolio.risks",
      ],
      confidence: 1.0,
    };
  },
  tags: ["accumulation", "concentration", "portfolio"],
  createdAt: "2026-01-01",
};
