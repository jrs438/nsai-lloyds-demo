import type { Rule } from "../types";
import type { UnderwritingFacts, UnderwritingContext } from "./types";

export const MH_REN_02: Rule<UnderwritingFacts, UnderwritingContext> = {
  id: "MH-REN-02",
  name: "Material change disclosure",
  description:
    "On renewal, any material change to the risk (operations expansion, ownership, route change, prior litigation) must be disclosed and reviewed.",
  version: "1.0.0",
  domain: "compliance",
  severity: "referral",
  evaluationType: "boolean",
  authority: {
    type: "regulatory",
    reference: "Insurance Act 2015 — Duty of Fair Presentation",
    effective: "2016-08-12",
    lastReviewed: "2026-02-01",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (_facts, context) => {
    if (!context.isRenewal || !context.priorPolicy) {
      return {
        fired: false,
        applicable: false,
        reasoning: "Not a renewal — rule does not apply",
        factsUsed: ["context.isRenewal"],
        confidence: 1.0,
      };
    }
    const changes = context.priorPolicy.materialChanges ?? [];
    const fired = changes.length === 0;
    return {
      fired,
      applicable: true,
      value: changes.length,
      reasoning: fired
        ? "No material changes disclosed since prior period"
        : `${changes.length} material change(s) disclosed — require review: ${changes.slice(0, 2).join("; ")}`,
      factsUsed: ["priorPolicy.materialChanges"],
      confidence: 1.0,
    };
  },
  tags: ["renewal", "material-change", "fair-presentation"],
  createdAt: "2026-01-01",
};
