import type { Rule, RuleResult, Derivation } from "./types";
import type { Syndicate } from "../syndicates/types";

export interface EvaluationContext {
  syndicate: Syndicate;
  currentDate: Date;
}

export interface RuleResultRow<TFacts> {
  rule: Rule<TFacts, EvaluationContext>;
  result: RuleResult;
  timestamp: string;
}

export interface EvaluationOutput<TFacts> {
  rulesEvaluated: number;
  rulesApplicable: number;
  rulesFired: number;
  rulesFailed: number;
  results: RuleResultRow<TFacts>[];
  derivation: Derivation;
}

export function evaluateRules<TFacts>(
  facts: TFacts,
  applicableRules: Rule<TFacts, EvaluationContext>[],
  context: EvaluationContext,
): EvaluationOutput<TFacts> {
  const results: RuleResultRow<TFacts>[] = applicableRules.map((rule) => ({
    rule,
    result: rule.condition(facts, context),
    timestamp: new Date().toISOString(),
  }));

  const rulesApplicable = results.filter((r) => r.result.applicable).length;
  const rulesFired = results.filter(
    (r) => r.result.applicable && r.result.fired,
  ).length;
  const rulesFailed = results.filter(
    (r) =>
      r.result.applicable &&
      !r.result.fired &&
      r.rule.evaluationType === "boolean",
  ).length;

  const derivation = deriveConclusion(results);

  return {
    rulesEvaluated: results.length,
    rulesApplicable,
    rulesFired,
    rulesFailed,
    results,
    derivation,
  };
}

function deriveConclusion<TFacts>(
  results: RuleResultRow<TFacts>[],
): Derivation {
  const failed = results.filter(
    (r) =>
      r.result.applicable &&
      !r.result.fired &&
      r.rule.evaluationType === "boolean",
  );

  const hardDeclines = failed.filter((r) => r.rule.severity === "hard-decline");
  const softDeclines = failed.filter((r) => r.rule.severity === "soft-decline");
  const referrals = failed.filter((r) => r.rule.severity === "referral");
  const conditions = failed.filter((r) => r.rule.severity === "condition");

  let conclusion: string;
  const reasoning: string[] = [];

  if (hardDeclines.length > 0) {
    conclusion = "Decline";
    for (const f of hardDeclines) {
      reasoning.push(`${f.rule.id} hard-decline: ${f.result.reasoning}`);
    }
  } else if (softDeclines.length > 0) {
    conclusion = "Soft decline — senior override required";
    for (const f of softDeclines) {
      reasoning.push(`${f.rule.id}: ${f.result.reasoning}`);
    }
  } else if (referrals.length > 0) {
    conclusion = "Refer";
    for (const f of referrals) {
      reasoning.push(`${f.rule.id}: ${f.result.reasoning}`);
    }
  } else if (conditions.length > 0) {
    conclusion = "Eligible subject to condition";
    for (const f of conditions) {
      reasoning.push(`${f.rule.id}: ${f.result.reasoning}`);
    }
  } else {
    conclusion = "Eligible";
    reasoning.push("All applicable rules satisfied");
  }

  return { conclusion, reasoning };
}

export function computePricing<TFacts>(
  results: RuleResultRow<TFacts>[],
): { baseRate: number; modifiers: Array<{ id: string; name: string; value: number; reasoning: string }>; finalRate: number } {
  const baseRule = results.find((r) => r.rule.id === "MH-PRC-01");
  const baseRate = (baseRule?.result.value as number) ?? 0.65;

  const modifierRules = results.filter(
    (r) =>
      r.rule.evaluationType === "scalar-modifier" &&
      r.rule.id !== "MH-PRC-01" &&
      r.result.applicable,
  );

  const modifiers = modifierRules.map((r) => ({
    id: r.rule.id,
    name: r.rule.name,
    value: r.result.value as number,
    reasoning: r.result.reasoning,
  }));

  let finalRate = baseRate;
  for (const mod of modifiers) {
    finalRate = finalRate * (1 + mod.value);
  }

  return { baseRate, modifiers, finalRate };
}
