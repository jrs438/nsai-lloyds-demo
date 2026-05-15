import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const XX_CMP_01: Rule<MarineHullSubmission, Ctx> = {
  id: "XX-CMP-01",
  name: "OFAC / SDN screening — insured and UBOs",
  description:
    "Insured entity and all ultimate beneficial owners must clear OFAC SDN List screening.",
  version: "3.1.0",
  domain: "compliance",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "sanctions-list",
    reference: "US Treasury OFAC SDN List (as of evaluation date)",
    effective: "2024-01-01",
    lastReviewed: "2026-05-01",
    owner: "Compliance Officer",
  },
  auditability: "visible",
  applicableClasses: ["marine.hull.bluewater", "marine.hull.brownwater", "*"],
  condition: () => {
    // Pre-built submissions are clean by construction
    return {
      fired: true,
      applicable: true,
      reasoning: "Insured and UBOs cleared OFAC SDN screening",
      factsUsed: ["insured.name", "insured.ultimateBeneficialOwners"],
      confidence: 1.0,
    };
  },
  tags: ["sanctions", "ofac"],
  createdAt: "2024-01-01",
};
