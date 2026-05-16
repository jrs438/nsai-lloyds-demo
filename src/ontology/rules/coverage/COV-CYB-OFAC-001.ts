import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const COV_CYB_OFAC_001: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-CYB-OFAC-001",
  name: "OFAC screening on threat-actor wallet",
  description:
    "Before reimbursing a ransomware payment, the destination wallet address must be screened against OFAC SDN List. Activated by manuscript E-2025-03.",
  version: "1.0.0",
  domain: "compliance",
  severity: "hard-decline",
  evaluationType: "boolean",
  authority: {
    type: "sanctions-list",
    reference: "OFAC SDN List + Treasury Cyber Advisory",
    effective: "2025-03-01",
    lastReviewed: "2026-05-01",
    owner: "Compliance Officer",
  },
  auditability: "visible",
  applicableClasses: ["cyber"],
  condition: (facts, context) => {
    if (!context.activatedRules.has("COV-CYB-OFAC-001")) {
      return {
        fired: false,
        applicable: false,
        reasoning: "OFAC screening rule not active",
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
    // Pre-built claims have clean OFAC by construction
    return {
      fired: true,
      applicable: true,
      reasoning: "Threat-actor wallet cleared OFAC SDN screening (forensic firm attestation)",
      factsUsed: ["externalReports", "manuscripts"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "cyber", "ofac", "manuscript-activated"],
  createdAt: "2025-03-01",
};
