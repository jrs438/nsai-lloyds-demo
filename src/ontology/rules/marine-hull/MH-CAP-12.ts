import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_12: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-12",
  name: "Fleet aggregate within syndicate accumulation limit",
  description:
    "Requested line size, combined with existing fleet exposure, must remain within syndicate's stamp-capacity-driven aggregate.",
  version: "2.4.0",
  domain: "accumulation",
  severity: "referral",
  evaluationType: "boolean",
  authority: {
    type: "treaty",
    reference: "2026 Stamp Capacity / Reinsurance Treaty Schedule",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const requested =
      (facts.context?.requestedLeadLine ?? 0.10) * facts.coverage.hullValue;
    const stampCapacity = context.syndicate.stampCapacity;
    const fleetThreshold = stampCapacity * 0.10;
    const fired = requested <= fleetThreshold;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Requested line USD ${requested.toLocaleString()} within fleet aggregate (USD ${fleetThreshold.toLocaleString()})`
        : `Requested line USD ${requested.toLocaleString()} exceeds 10% of stamp capacity`,
      factsUsed: [
        "context.requestedLeadLine",
        "coverage.hullValue",
        "syndicate.stampCapacity",
      ],
      confidence: 1.0,
    };
  },
  tags: ["accumulation", "capacity"],
  createdAt: "2024-01-01",
};
