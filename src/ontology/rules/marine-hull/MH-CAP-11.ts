import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_11: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-11",
  name: "Technical manager ISM compliance",
  description:
    "Technical manager must be ISM-certified with limited detention history. Detention frequency correlates strongly with future hull losses.",
  version: "2.4.0",
  domain: "appetite",
  severity: "soft-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 6.1",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible-on-fire",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const ism = facts.vessel.ISMCompliance;
    const detentions = facts.vessel.detentionHistory;
    const fired = ism && detentions <= 1;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `ISM-compliant; ${detentions} detention(s) in 5y`
        : `ISM compliance ${ism ? "OK" : "issue"}; ${detentions} detention(s) in 5y`,
      factsUsed: ["vessel.ISMCompliance", "vessel.detentionHistory"],
      confidence: 1.0,
    };
  },
  tags: ["ism", "operator"],
  createdAt: "2024-01-01",
};
