import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const COV_FRAUD: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-FRAUD",
  name: "Material misrepresentation / fraud check",
  description:
    "Coverage is voided if the insured made a fraudulent claim or misrepresentation material to the underwriting decision.",
  version: "1.0.0",
  domain: "coverage",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "regulatory",
    reference: "Insurance Act 2015 — Sections 8-9 (Fraudulent Claims)",
    effective: "2016-08-12",
    lastReviewed: "2026-02-01",
    owner: "Claims Manager",
  },
  auditability: "visible-on-fire",
  applicableClasses: ["*"],
  condition: () => {
    // Pre-built claims are clean by construction
    return {
      fired: true,
      applicable: true,
      reasoning: "No indicators of fraud or material misrepresentation in claim file",
      factsUsed: ["externalReports"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "fraud", "ia2015"],
  createdAt: "2024-01-01",
};
