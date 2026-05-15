import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_ACC_01: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-ACC-01",
  name: "Zone aggregate within limit post-bind",
  description:
    "After binding this risk, the syndicate's zone aggregate exposure must remain within the zone limit. Zone limits are derived from stamp capacity and treaty structure.",
  version: "1.0.0",
  domain: "accumulation",
  severity: "referral",
  evaluationType: "boolean",
  authority: {
    type: "treaty",
    reference: "2026 Reinsurance Treaty — Zone Limits Schedule, Section 3",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const zoneAgg = context.portfolio.zoneAggregates.find(
      (z) => z.zone === facts.zone,
    );
    if (!zoneAgg) {
      return {
        fired: true,
        applicable: false,
        reasoning: `No existing exposure in zone ${facts.zone}; new zone opening`,
        factsUsed: ["zone"],
        confidence: 1.0,
      };
    }
    const requestedLine = facts.context?.requestedLeadLine ?? 0.10;
    const exposureAdded = facts.coverage.hullValue * requestedLine;
    const postBindAgg = zoneAgg.sumInsured + exposureAdded;
    const postBindUtil = postBindAgg / zoneAgg.limit;
    const fired = postBindUtil <= 0.90;
    return {
      fired,
      applicable: true,
      value: postBindUtil,
      reasoning: fired
        ? `Zone aggregate post-bind ${(postBindUtil * 100).toFixed(1)}% of limit — within 90% threshold`
        : `Zone aggregate post-bind ${(postBindUtil * 100).toFixed(1)}% of limit — exceeds 90% referral threshold`,
      factsUsed: [
        "zone",
        "coverage.hullValue",
        "context.requestedLeadLine",
        "portfolio.zoneAggregates",
      ],
      confidence: 1.0,
    };
  },
  failureMessage: (facts, context) => {
    const zoneAgg = context.portfolio.zoneAggregates.find(
      (z) => z.zone === facts.zone,
    );
    return `Binding this risk would push zone ${facts.zone} aggregate to ${zoneAgg ? ((zoneAgg.sumInsured + facts.coverage.hullValue * 0.1) / zoneAgg.limit * 100).toFixed(1) : "?"}% of limit. Refer to Active Underwriter.`;
  },
  remediation: () => [
    "Refer to Active Underwriter for zone capacity authorization",
    "Consider reducing line size to keep aggregate below 90%",
    "Verify whether facultative reinsurance can free zone capacity",
  ],
  tags: ["accumulation", "zone", "portfolio"],
  createdAt: "2026-01-01",
};
