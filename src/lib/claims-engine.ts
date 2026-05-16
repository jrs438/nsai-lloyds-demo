import { COVERAGE_RULES } from "@/ontology/rules/coverage";
import { buildCoverageContext } from "@/ontology/rules/coverage/types";
import { ALL_MANUSCRIPTS } from "@/ontology/wordings/manuscripted";
import type {
  AnyClaim,
  ClaimDecision,
} from "@/ontology/classes/claim";
import type { ManuscriptEndorsement } from "@/ontology/wordings/manuscripted";
import type {
  Rule,
  RuleResult,
  SerializableRule,
} from "@/ontology/rules/types";

export interface ClaimRuleResultRow {
  rule: SerializableRule;
  result: RuleResult;
}

export interface ClaimsEvaluationOutput {
  claim: AnyClaim;
  manuscripts: ManuscriptEndorsement[];
  ruleResults: ClaimRuleResultRow[];
  totalRulesEvaluated: number;
  rulesFired: number;
  rulesFailed: number;
  decision: ClaimDecision;
  underwritingFeedback: UnderwritingFeedbackEntry[];
}

export interface UnderwritingFeedbackEntry {
  observation: string;
  classImpact: string;
  recommendedAction: string;
}

function serializeRule(rule: Rule): SerializableRule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { condition, failureMessage, successMessage, remediation, ...rest } = rule;
  return rest;
}

export function evaluateClaim(claim: AnyClaim): ClaimsEvaluationOutput {
  // Resolve the manuscripts attached to the policy
  const manuscripts = claim.policy.manuscriptEndorsements
    .map((id) => ALL_MANUSCRIPTS[id])
    .filter(Boolean);

  const facts = { claim, manuscripts };
  const context = buildCoverageContext(manuscripts);

  const ruleResults: ClaimRuleResultRow[] = COVERAGE_RULES.map((rule) => {
    const r = rule as Rule;
    const result = r.condition(facts, context);
    return { rule: serializeRule(r), result };
  });

  const applicableBooleans = ruleResults.filter(
    (r) => r.result.applicable && r.rule.evaluationType === "boolean",
  );
  const rulesFired = applicableBooleans.filter((r) => r.result.fired).length;
  const rulesFailed = applicableBooleans.filter((r) => !r.result.fired).length;

  const decision = buildDecision(claim, ruleResults, manuscripts);
  const underwritingFeedback = buildUnderwritingFeedback(claim);

  return {
    claim,
    manuscripts,
    ruleResults,
    totalRulesEvaluated: ruleResults.length,
    rulesFired,
    rulesFailed,
    decision,
    underwritingFeedback,
  };
}

function buildDecision(
  claim: AnyClaim,
  rows: ClaimRuleResultRow[],
  manuscripts: ManuscriptEndorsement[],
): ClaimDecision {
  // Coverage position depends on whether any hard-decline fired
  const failedHard = rows.find(
    (r) =>
      r.result.applicable &&
      !r.result.fired &&
      r.rule.severity === "hard-decline" &&
      r.rule.evaluationType === "boolean",
  );

  if (failedHard) {
    return {
      coveragePosition: "denied",
      netPolicyResponse: 0,
      recommendedInitialReserve: 0,
      settlementStrategy: `Decline coverage per ${failedHard.rule.id}: ${failedHard.result.reasoning}. Issue formal declinature letter.`,
      underwritingFeedback: [],
    };
  }

  // Net policy response = min(quantum, subLimit, limit) - deductible
  const limit = claim.policy.limit;
  const dedRow = rows.find((r) => r.rule.id === "COV-DED-001");
  const subLimitRow = rows.find(
    (r) => r.rule.id === "COV-SUB-LIMIT-042" && r.result.applicable,
  );

  const deductible = (dedRow?.result.value as number) ?? claim.policy.deductible;
  const subLimit = subLimitRow ? (subLimitRow.result.value as number) : null;

  const responseCap = subLimit !== null ? Math.min(limit, subLimit) : limit;
  const grossResponse = Math.min(claim.alleged.quantum, responseCap);
  const netResponse = Math.max(0, grossResponse - deductible);

  const coveragePosition: ClaimDecision["coveragePosition"] = subLimit
    ? "covered-with-sublimit"
    : netResponse < claim.alleged.quantum
      ? "partially-covered"
      : "covered";

  return {
    coveragePosition,
    netPolicyResponse: netResponse,
    recommendedInitialReserve: netResponse,
    settlementStrategy: buildStrategy(claim, coveragePosition, netResponse, subLimit),
    defenceCounsel: buildDefenceCounsel(claim),
    venueAnalysis: buildVenueAnalysis(claim),
    subrogationPath: buildSubrogationPath(claim, manuscripts),
    underwritingFeedback: buildFeedbackStrings(claim),
  };
}

function buildStrategy(
  claim: AnyClaim,
  position: ClaimDecision["coveragePosition"],
  netResponse: number,
  subLimit: number | null,
): string {
  if (position === "covered-with-sublimit") {
    return `Settle. Quantum (USD ${claim.alleged.quantum.toLocaleString()}) exceeds the sub-limit cap (USD ${subLimit?.toLocaleString()}); net response capped at USD ${netResponse.toLocaleString()}. This eliminates coverage-litigation incentive — settle promptly to avoid bad-faith exposure.`;
  }
  if (claim.type === "marine" && claim.loss.subrogationPotential === "high") {
    return `Pay out and pursue subrogation. Net response USD ${netResponse.toLocaleString()}. Strong third-party negligence evidence makes recovery prospects high.`;
  }
  if (claim.type === "cyber") {
    return `Settle on a structured basis. First-party costs are largely fixed (forensics, restoration, notification). Notification deadlines (OCR/Oregon AG) require coordinated decision within 30 days.`;
  }
  return `Settle. Coverage clear, net response USD ${netResponse.toLocaleString()}, no material defenses available.`;
}

function buildDefenceCounsel(claim: AnyClaim): ClaimDecision["defenceCounsel"] {
  if (claim.type === "property" && claim.jurisdiction.includes("Washington")) {
    return [
      {
        firm: "Lane Powell PC",
        location: "Seattle, WA",
        rateGuide: "USD 425-625/hr partner",
        relevantExperience:
          "73 settled property/business interruption defenses 2022-25 in WA; trial rate 18%",
      },
      {
        firm: "Stoel Rives LLP",
        location: "Seattle, WA",
        rateGuide: "USD 450-650/hr partner",
        relevantExperience:
          "Strong cold-chain / food storage portfolio; relationships with the carriers we typically follow",
      },
      {
        firm: "Wilson Smith Cochran Dickerson",
        location: "Seattle, WA",
        rateGuide: "USD 375-525/hr partner",
        relevantExperience: "Insurance-defense focused boutique; consistent results on fire/cause cases",
      },
    ];
  }
  if (claim.type === "cyber") {
    return [
      {
        firm: "Mullen Coughlin LLC",
        location: "Wayne, PA (national practice)",
        rateGuide: "USD 525-725/hr partner",
        relevantExperience: "Pre-eminent cyber breach coaches; 400+ panel placements with major carriers",
      },
      {
        firm: "BakerHostetler — Digital Risk Advisory & Cybersecurity",
        location: "National",
        rateGuide: "USD 600-850/hr partner",
        relevantExperience: "Healthcare focus; HIPAA OCR experience",
      },
    ];
  }
  if (claim.type === "marine") {
    return [
      {
        firm: "Hill Dickinson (Singapore + London)",
        location: "Singapore / London",
        rateGuide: "USD 550-750/hr partner",
        relevantExperience: "Tier-1 cargo subrogation; standing relationships with major carriers in Asia trades",
      },
      {
        firm: "HFW (Holman Fenwick Willan)",
        location: "Singapore / London",
        rateGuide: "USD 575-775/hr partner",
        relevantExperience:
          "Marine litigation specialists; particularly strong on bills-of-lading interpretation",
      },
    ];
  }
  return undefined;
}

function buildVenueAnalysis(claim: AnyClaim): ClaimDecision["venueAnalysis"] {
  if (claim.jurisdiction.includes("Washington")) {
    return {
      jurisdiction: "Washington State, USA",
      settlementToTrialRatio: "73:27 (property claims, 2020-25)",
      averageSettlementMonths: 11,
      notableCases: [
        "Pacific Trail Cold Storage v Acme Underwriters (W.D. Wash 2023) — sub-limit enforceable, post-loss conduct distinguishable from bad-faith standard",
        "Northwest Logistics Co v National (E.D. Wash 2024) — equipment-cause endorsement strictly construed against drafter",
      ],
    };
  }
  if (claim.jurisdiction.includes("Oregon")) {
    return {
      jurisdiction: "Oregon, USA",
      settlementToTrialRatio: "81:19 (cyber claims, 2022-25)",
      averageSettlementMonths: 9,
      notableCases: [
        "St Vincent Health v Federal Cyber Re (D. Or. 2024) — settlement structure for healthcare cyber pre-notification",
        "Cascade Tech Group v Specialty Cyber (D. Or. 2023) — ransom payment with OFAC clearance held covered",
      ],
    };
  }
  if (claim.jurisdiction.includes("English")) {
    return {
      jurisdiction: "English law / Commercial Court",
      settlementToTrialRatio: "84:16 (marine cargo, 2020-25)",
      averageSettlementMonths: 14,
      notableCases: [
        "Marine Marubeni Logistics v Pacific Carriers [2024] EWHC — Hague-Visby package limits inapplicable where express agreement preserves direct claim",
        "Hill Dickinson reported volume on container-stack-collapse subrogations: 12 recoveries 2022-25, average recovery 68% of claim quantum",
      ],
    };
  }
  return undefined;
}

function buildSubrogationPath(
  claim: AnyClaim,
  manuscripts: ManuscriptEndorsement[],
): string | undefined {
  if (claim.type !== "marine") return undefined;
  const hasExtendedSub = manuscripts.find((m) => m.id === "E-2026-02");
  if (
    hasExtendedSub &&
    (claim.loss.subrogationPotential === "high" ||
      claim.loss.subrogationPotential === "medium")
  ) {
    return `Pursue direct claim against ${claim.loss.thirdPartyInvolved ?? "named carrier"} under negligence theory. Manuscript E-2026-02 preserves the right despite Bills of Lading / Hague-Visby package limitations. Hill Dickinson tracks 12 comparable recoveries 2022-25 with mean recovery 68% of claim quantum.`;
  }
  return undefined;
}

function buildFeedbackStrings(claim: AnyClaim): string[] {
  const fb: string[] = [];
  if (claim.type === "property" && claim.policy.manuscriptEndorsements.includes("E-2024-07")) {
    fb.push(
      "Manuscript E-2024-07 (electrical-equipment expanded cover) is functioning as intended — covers what base form excluded, capped by sub-limit. Continue to write where supported by survey and recent dry plant.",
    );
  }
  if (claim.type === "cyber") {
    fb.push(
      "Vendor compromise (third-party access) was initial vector. Review reasonableness of insuring accounts with extensive critical-vendor remote access without contractual EDR requirements.",
    );
  }
  return fb;
}

function buildUnderwritingFeedback(
  claim: AnyClaim,
): UnderwritingFeedbackEntry[] {
  if (claim.type === "property" && claim.policy.manuscriptEndorsements.includes("E-2024-07")) {
    return [
      {
        observation:
          "Manuscript E-2024-07 deployed exactly as intended — base wording would have denied; endorsement opens coverage but the sub-limit caps the response at the intended level.",
        classImpact:
          "12 active policies carry E-2024-07. Loss frequency low (1 claim YTD). Sub-limit prevents catastrophic outcomes.",
        recommendedAction:
          "Continue to write E-2024-07 on industrial/cold-storage accounts. Consider tightening sub-limit on accounts >USD 15M TIV in 2027 renewals.",
      },
      {
        observation:
          "Vendor/contractor remote maintenance access flagged on this loss (HVAC contractor had remote diagnostics). Pattern emerging across the property book.",
        classImpact:
          "Cyber-physical convergence — losses from electrical/mechanical equipment increasingly involve remote-access vectors.",
        recommendedAction:
          "Standardise survey questions on remote-access governance for 2027 binders. Consider cross-class loading where insured holds both Property and Cyber with us.",
      },
    ];
  }
  if (claim.type === "marine") {
    return [
      {
        observation:
          "Carrier negligence + container-stack-collapse pattern reflects ongoing Lashing Code non-compliance across Asia-Pacific feeder operators.",
        classImpact: "Third loss with similar fact pattern against Asia Lines Pte Ltd in 24 months.",
        recommendedAction:
          "Add Asia Lines Pte Ltd to watch list. Manuscript E-2026-02 (extended subrogation) is recovering meaningful losses — keep on standard binder.",
      },
    ];
  }
  if (claim.type === "cyber") {
    return [
      {
        observation:
          "Healthcare + flat AD + vendor-managed clinical systems remains a recurring pattern. 4 of 7 healthcare cyber claims YTD show comparable fact patterns.",
        classImpact:
          "Healthcare subset of cyber book showing materially worse loss ratio (est 110%) than broader cyber book (est 58%).",
        recommendedAction:
          "Add EDR coverage and AD segmentation as conditions on healthcare risks ≥1,500 employees from 2027 renewal. Tighten vendor-access disclosures.",
      },
      {
        observation:
          "Manuscript E-2025-03 (ransom affirmative cover + OFAC) used. Pre-payment OFAC clearance saved the claim — without manuscript and without screening, payment would be non-recoverable.",
        classImpact: "First successful E-2025-03 deployment in production.",
        recommendedAction:
          "Continue to write E-2025-03 on cyber policies; mandatory OFAC sign-off via breach coach.",
      },
    ];
  }
  return [];
}
