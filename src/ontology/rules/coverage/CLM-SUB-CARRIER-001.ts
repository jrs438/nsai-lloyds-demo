import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const CLM_SUB_CARRIER_001: Rule<CoverageFacts, CoverageContext> = {
  id: "CLM-SUB-CARRIER-001",
  name: "Subrogation against named carrier preserved",
  description:
    "Activated by manuscript E-2026-02. Preserves subrogation rights against the named carrier notwithstanding Bills of Lading / Hague-Visby limitations.",
  version: "1.0.0",
  domain: "claims",
  severity: "flag",
  evaluationType: "boolean",
  authority: {
    type: "class-document",
    reference: "Manuscript endorsement E-2026-02 — Extended subrogation",
    effective: "2026-02-01",
    lastReviewed: "2026-02-01",
    owner: "Marine Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["marine"],
  condition: (facts, context) => {
    if (!context.activatedRules.has("CLM-SUB-CARRIER-001")) {
      return {
        fired: false,
        applicable: false,
        reasoning: "Rule not active for this policy",
        factsUsed: ["manuscripts"],
        confidence: 1.0,
      };
    }
    if (facts.claim.type !== "marine") {
      return {
        fired: false,
        applicable: false,
        reasoning: "Rule applies only to marine claims",
        factsUsed: ["claim.type"],
        confidence: 1.0,
      };
    }
    const hasSubrogation =
      facts.claim.loss.subrogationPotential === "high" ||
      facts.claim.loss.subrogationPotential === "medium";
    return {
      fired: hasSubrogation,
      applicable: true,
      reasoning: hasSubrogation
        ? "Subrogation against named carrier preserved by E-2026-02; pursue recovery"
        : "Subrogation rule active but no clear third-party recovery path",
      factsUsed: ["claim.loss.subrogationPotential", "manuscripts"],
      confidence: 1.0,
    };
  },
  tags: ["claims", "subrogation", "manuscript-activated"],
  createdAt: "2026-02-01",
};
