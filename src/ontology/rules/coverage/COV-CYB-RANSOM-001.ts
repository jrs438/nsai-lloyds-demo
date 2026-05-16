import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const COV_CYB_RANSOM_001: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-CYB-RANSOM-001",
  name: "Ransomware payment — affirmative cover",
  description:
    "Activated by manuscript E-2025-03. Affirms coverage for ransomware extortion payments subject to OFAC clearance and carrier pre-approval.",
  version: "1.0.0",
  domain: "coverage",
  severity: "condition",
  evaluationType: "boolean",
  authority: {
    type: "class-document",
    reference: "Manuscript endorsement E-2025-03 — Ransomware affirmative coverage",
    effective: "2025-03-01",
    lastReviewed: "2026-02-01",
    owner: "Cyber Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["cyber"],
  condition: (facts, context) => {
    if (!context.activatedRules.has("COV-CYB-RANSOM-001")) {
      return {
        fired: false,
        applicable: false,
        reasoning: "Ransomware affirmative-coverage rule not active for this policy",
        factsUsed: ["manuscripts"],
        confidence: 1.0,
      };
    }
    if (facts.claim.type !== "cyber") {
      return {
        fired: false,
        applicable: false,
        reasoning: "Rule applies only to cyber claims",
        factsUsed: ["claim.type"],
        confidence: 1.0,
      };
    }
    const isRansomware = facts.claim.loss.incidentType === "ransomware";
    return {
      fired: isRansomware,
      applicable: true,
      reasoning: isRansomware
        ? "Ransomware incident — affirmative coverage applies under E-2025-03"
        : "Loss is not a ransomware incident — rule does not engage",
      factsUsed: ["claim.loss.incidentType", "manuscripts"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "cyber", "ransomware", "manuscript-activated"],
  createdAt: "2025-03-01",
};
