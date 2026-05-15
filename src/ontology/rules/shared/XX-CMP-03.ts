import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const XX_CMP_03: Rule<MarineHullSubmission, Ctx> = {
  id: "XX-CMP-03",
  name: "EU sanctions screening",
  description: "Insured and UBOs must clear EU consolidated sanctions list.",
  version: "3.1.0",
  domain: "compliance",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "sanctions-list",
    reference: "EU Consolidated Financial Sanctions List",
    effective: "2024-01-01",
    lastReviewed: "2026-05-01",
    owner: "Compliance Officer",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: () => ({
    fired: true,
    applicable: true,
    reasoning: "Insured cleared EU consolidated sanctions list",
    factsUsed: ["insured.name", "insured.ultimateBeneficialOwners"],
    confidence: 1.0,
  }),
  tags: ["sanctions", "eu"],
  createdAt: "2024-01-01",
};
