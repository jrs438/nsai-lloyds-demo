import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const MH_PRC_03: Rule<MarineHullSubmission, Ctx> = {
  id: "MH-PRC-03",
  name: "Trading area loading factor",
  description:
    "Loading applied for high-risk or war-risk-adjacent trading areas. Worldwide-ex-sanctioned is neutral.",
  version: "2.4.0",
  domain: "pricing",
  severity: "pricing-modifier",
  evaluationType: "scalar-modifier",
  authority: {
    type: "underwriting-manual",
    reference: "Marine Hull Pricing Schedule 2026 — Section C (Trading Area)",
    effective: "2026-01-01",
    lastReviewed: "2026-01-15",
    owner: "Active Underwriter",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater"],
  condition: (facts) => {
    const desc = facts.tradingArea.description.toLowerCase();
    const routes = facts.tradingArea.primaryRoutes
      .map((r) => r.toLowerCase())
      .join(",");
    let loading = 0;
    let note = "neutral worldwide trading area";
    if (routes.includes("goa") || desc.includes("gulf of aden")) {
      loading = 0.08;
      note = "Gulf of Aden transit: +8%";
    } else if (routes.includes("red sea") || desc.includes("red sea")) {
      loading = 0.05;
      note = "Red Sea transit: +5%";
    }
    return {
      fired: true,
      applicable: true,
      value: loading,
      reasoning: note,
      factsUsed: ["tradingArea.description", "tradingArea.primaryRoutes"],
      confidence: 1.0,
    };
  },
  tags: ["pricing", "trading-area"],
  createdAt: "2024-01-01",
};
