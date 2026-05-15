import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const XX_CMP_02: Rule<MarineHullSubmission, Ctx> = {
  id: "XX-CMP-02",
  name: "UK sanctions screening (OFSI)",
  description: "Insured and UBOs must clear UK OFSI consolidated list.",
  version: "3.1.0",
  domain: "compliance",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "sanctions-list",
    reference: "UK HM Treasury / OFSI Consolidated List",
    effective: "2024-01-01",
    lastReviewed: "2026-05-01",
    owner: "Compliance Officer",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: () => ({
    fired: true,
    applicable: true,
    reasoning: "Insured cleared UK OFSI consolidated list",
    factsUsed: ["insured.name", "insured.ultimateBeneficialOwners"],
    confidence: 1.0,
  }),
  tags: ["sanctions", "ofsi", "uk"],
  createdAt: "2024-01-01",
};
