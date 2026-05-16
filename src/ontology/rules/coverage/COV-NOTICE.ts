import type { Rule } from "../types";
import type { CoverageFacts, CoverageContext } from "./types";

export const COV_NOTICE: Rule<CoverageFacts, CoverageContext> = {
  id: "COV-NOTICE",
  name: "Timely notice provided",
  description:
    "Insured must give notice of loss as soon as reasonably practicable. Late notice can prejudice the insurer's investigation and may affect coverage.",
  version: "1.0.0",
  domain: "coverage",
  severity: "flag",
  evaluationType: "boolean",
  authority: {
    type: "lma-standard",
    reference: "Standard policy condition — Notice of loss",
    effective: "2002-11-01",
    lastReviewed: "2026-01-15",
    owner: "Claims Manager",
  },
  auditability: "visible",
  applicableClasses: ["*"],
  condition: (facts) => {
    const loss = new Date(facts.claim.lossDate);
    const notice = new Date(facts.claim.noticeDate);
    const daysToNotice =
      (notice.getTime() - loss.getTime()) / (1000 * 60 * 60 * 24);
    const fired = daysToNotice <= 30;
    return {
      fired,
      applicable: true,
      value: daysToNotice,
      reasoning: fired
        ? `Notice provided ${daysToNotice.toFixed(0)} day(s) after loss — within reasonable practice`
        : `Notice provided ${daysToNotice.toFixed(0)} day(s) after loss — late notice flag`,
      factsUsed: ["claim.lossDate", "claim.noticeDate"],
      confidence: 1.0,
    };
  },
  tags: ["coverage", "notice"],
  createdAt: "2024-01-01",
};
