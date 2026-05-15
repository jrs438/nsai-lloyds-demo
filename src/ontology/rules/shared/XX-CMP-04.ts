import { Rule } from "../types";
import type { MarineHullSubmission } from "../../classes/marine";
import type { Syndicate } from "../../syndicates/types";

interface Ctx {
  syndicate: Syndicate;
  currentDate: Date;
}

export const XX_CMP_04: Rule<MarineHullSubmission, Ctx> = {
  id: "XX-CMP-04",
  name: "Lloyd's regulated jurisdiction check",
  description:
    "Insured domicile must be a jurisdiction in which the syndicate is licensed to underwrite.",
  version: "2.4.0",
  domain: "compliance",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "regulatory",
    reference: "Lloyd's Licensing Schedule (per managing agent)",
    effective: "2026-01-01",
    lastReviewed: "2026-04-01",
    owner: "Compliance Officer",
  },
  auditability: "visible-on-fire",
  applicableClasses: ["*"],
  condition: (facts) => {
    const restricted = ["MM", "VE", "BY"];
    const fired = !restricted.includes(facts.insured.domicile);
    return {
      fired,
      applicable: true,
      reasoning: fired
        ? `Insured domicile ${facts.insured.domicile}: Lloyd's-licensed`
        : `Insured domicile ${facts.insured.domicile}: licensing review required`,
      factsUsed: ["insured.domicile"],
      confidence: 1.0,
    };
  },
  tags: ["licensing", "regulatory"],
  createdAt: "2024-01-01",
};
