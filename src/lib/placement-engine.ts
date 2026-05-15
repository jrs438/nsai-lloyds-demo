import { ALL_SYNDICATES, type Syndicate } from "@/ontology/syndicates";
import {
  MARINE_HULL_CAPACITY_RULES,
  MARINE_HULL_PRICING_RULES,
} from "@/ontology/rules/marine-hull";
import { COMPLIANCE_RULES } from "@/ontology/rules/shared";
import {
  evaluateRules,
  computePricing,
  type EvaluationContext,
} from "@/ontology/rules/evaluator";
import type { MarineHullSubmission } from "@/ontology/classes/marine";
import type { Rule, RuleResult, SerializableRule, Derivation } from "@/ontology/rules/types";

const ALL_MARINE_RULES = [
  ...MARINE_HULL_CAPACITY_RULES,
  ...COMPLIANCE_RULES,
  ...MARINE_HULL_PRICING_RULES,
];

export interface SerializableRuleResultRow {
  rule: SerializableRule;
  result: RuleResult;
  timestamp: string;
}

export interface SerializableEvaluationOutput {
  rulesEvaluated: number;
  rulesApplicable: number;
  rulesFired: number;
  rulesFailed: number;
  results: SerializableRuleResultRow[];
  derivation: Derivation;
}

export interface SyndicateEvaluation {
  syndicate: Syndicate;
  output: SerializableEvaluationOutput;
  pricing: { baseRate: number; modifiers: Array<{ id: string; name: string; value: number; reasoning: string }>; finalRate: number };
  status: "eligible" | "conditional" | "soft-decline" | "referral" | "decline";
  matchScore: number;
  leadCapable: boolean;
  recommendedLeadLine: number;
  recommendedFollowLine: number;
}

function serializeRule(rule: Rule): SerializableRule {
  // Strip functions, keep all serializable fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { condition, failureMessage, successMessage, remediation, ...rest } = rule;
  return rest;
}

export interface PlacementRecommendation {
  submission: MarineHullSubmission;
  syndicateEvaluations: SyndicateEvaluation[];
  recommendedLeads: SyndicateEvaluation[];
  conditionalLeads: SyndicateEvaluation[];
  declinedLeads: SyndicateEvaluation[];
  recommendedFollowers: SyndicateEvaluation[];
  indicativeRate: { min: number; max: number };
  flaggedIssues: string[];
  recommendedActions: string[];
  totalRulesEvaluated: number;
  computedAt: string;
}

export function generatePlacementRecommendation(
  submission: MarineHullSubmission,
): PlacementRecommendation {
  const evaluations = ALL_SYNDICATES.map((syndicate) => {
    const context: EvaluationContext = {
      syndicate,
      currentDate: new Date("2026-05-15"),
    };
    const rules = ALL_MARINE_RULES as Rule<MarineHullSubmission, EvaluationContext>[];
    const output = evaluateRules<MarineHullSubmission>(submission, rules, context);
    const pricing = computePricing<MarineHullSubmission>(output.results);

    const serializedOutput: SerializableEvaluationOutput = {
      rulesEvaluated: output.rulesEvaluated,
      rulesApplicable: output.rulesApplicable,
      rulesFired: output.rulesFired,
      rulesFailed: output.rulesFailed,
      results: output.results.map((r) => ({
        rule: serializeRule(r.rule),
        result: r.result,
        timestamp: r.timestamp,
      })),
      derivation: output.derivation,
    };

    const failed = output.results.filter(
      (r) =>
        r.result.applicable &&
        !r.result.fired &&
        r.rule.evaluationType === "boolean",
    );
    const hardDeclines = failed.filter((r) => r.rule.severity === "hard-decline");
    const softDeclines = failed.filter((r) => r.rule.severity === "soft-decline");
    const referrals = failed.filter((r) => r.rule.severity === "referral");
    const conditions = failed.filter((r) => r.rule.severity === "condition");

    let status: SyndicateEvaluation["status"];
    if (hardDeclines.length > 0) status = "decline";
    else if (softDeclines.length > 0) status = "soft-decline";
    else if (referrals.length > 0) status = "referral";
    else if (conditions.length > 0) status = "conditional";
    else status = "eligible";

    const total = output.results.filter(
      (r) => r.result.applicable && r.rule.evaluationType === "boolean",
    ).length;
    const passed = output.results.filter(
      (r) =>
        r.result.applicable &&
        r.result.fired &&
        r.rule.evaluationType === "boolean",
    ).length;
    const matchScore = total > 0 ? passed / total : 0;

    const cls = syndicate.classes["marine.hull"];
    const leadCapable = cls?.role === "lead-capable";

    return {
      syndicate,
      output: serializedOutput,
      pricing,
      status,
      matchScore,
      leadCapable,
      recommendedLeadLine: cls?.appetite.leadLineSize ?? 0,
      recommendedFollowLine: cls?.appetite.followLineSize ?? 0,
    } satisfies SyndicateEvaluation;
  });

  const recommendedLeads = evaluations
    .filter((e) => e.leadCapable && e.status === "eligible")
    .sort((a, b) => b.matchScore - a.matchScore);

  const conditionalLeads = evaluations
    .filter((e) => e.leadCapable && e.status === "conditional")
    .sort((a, b) => b.matchScore - a.matchScore);

  const declinedLeads = evaluations
    .filter((e) => e.leadCapable && (e.status === "decline" || e.status === "soft-decline" || e.status === "referral"))
    .sort((a, b) => b.matchScore - a.matchScore);

  const recommendedFollowers = evaluations
    .filter(
      (e) =>
        !e.leadCapable &&
        (e.status === "eligible" || e.status === "conditional"),
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  const eligibleRates = [
    ...recommendedLeads,
    ...conditionalLeads,
  ].map((e) => e.pricing.finalRate);
  const min =
    eligibleRates.length > 0 ? Math.min(...eligibleRates) : 0;
  const max =
    eligibleRates.length > 0 ? Math.max(...eligibleRates) : 0;

  const flaggedIssues = collectFlaggedIssues(evaluations);
  const recommendedActions = recommendActions(evaluations, submission);

  return {
    submission,
    syndicateEvaluations: evaluations,
    recommendedLeads,
    conditionalLeads,
    declinedLeads,
    recommendedFollowers,
    indicativeRate: { min, max },
    flaggedIssues,
    recommendedActions,
    totalRulesEvaluated: evaluations[0]?.output.rulesEvaluated ?? 0,
    computedAt: new Date().toISOString(),
  };
}

function collectFlaggedIssues(evaluations: SyndicateEvaluation[]): string[] {
  const issues = new Set<string>();
  for (const ev of evaluations) {
    for (const row of ev.output.results) {
      if (
        row.result.applicable &&
        !row.result.fired &&
        row.rule.evaluationType === "boolean" &&
        (row.rule.severity === "condition" ||
          row.rule.severity === "referral" ||
          row.rule.severity === "soft-decline")
      ) {
        issues.add(`${row.rule.id} · ${row.result.reasoning}`);
      }
    }
  }
  return Array.from(issues).slice(0, 6);
}

function recommendActions(
  evaluations: SyndicateEvaluation[],
  submission: MarineHullSubmission,
): string[] {
  const actions: string[] = [];

  const surveyFails = evaluations.some((e) =>
    e.output.results.find(
      (r) => r.rule.id === "MH-CAP-07" && !r.result.fired && r.result.applicable,
    ),
  );
  if (surveyFails) {
    actions.push(
      `Request updated condition survey from insured (current survey ${submission.vessel.surveyAgeMonths}mo old; threshold varies 18–30mo by syndicate)`,
    );
  }

  const ageFails = evaluations.some((e) =>
    e.output.results.find(
      (r) => r.rule.id === "MH-CAP-01" && !r.result.fired && r.result.applicable,
    ),
  );
  if (ageFails) {
    actions.push(
      `Restrict slip walk to syndicates with age threshold ≥${submission.vessel.vesselAgeYears}y`,
    );
  }

  const eligibleLeadCount = evaluations.filter(
    (e) => e.leadCapable && e.status === "eligible",
  ).length;
  if (eligibleLeadCount === 0) {
    actions.push(
      "No syndicates currently eligible to lead without condition; consider whether to walk slip with conditional leads or re-package submission",
    );
  } else if (eligibleLeadCount >= 2) {
    actions.push(
      `Slip to lead with ${eligibleLeadCount} fully-eligible syndicates; competitive tension supports pricing discipline`,
    );
  }

  return actions;
}
