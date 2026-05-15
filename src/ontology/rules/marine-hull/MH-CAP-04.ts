import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_CAP_04: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-CAP-04",
  name: "Trading area excludes sanctioned regions",
  description:
    "Vessel trading area must not include any region on the syndicate's excluded trading-area list.",
  version: "2.4.0",
  domain: "appetite",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull UW Manual v2.4, Section 3.4",
    effective: "2024-01-01",
    lastReviewed: "2026-01-15",
    owner: "Marine Class Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts, context) => {
    const excluded =
      context.syndicate.classes["marine.hull"]?.appetite.excludedTradingAreas ?? [];
    const subjectExclusions = facts.tradingArea.excludedRegions;

    const violation = excluded.find(
      (region) => !subjectExclusions.includes(region),
    );
    const fired = !violation;
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Trading area excludes all syndicate-restricted regions`
        : `Trading area does not exclude ${violation}`,
      factsUsed: [
        "tradingArea.excludedRegions",
        "syndicate.appetite.excludedTradingAreas",
      ],
      confidence: 1.0,
    };
  },
  tags: ["trading-area", "sanctions"],
  createdAt: "2024-01-01",
};
