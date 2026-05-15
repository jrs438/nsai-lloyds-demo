import { MercatorSyndicate2891 } from "@/ontology/syndicates/mercator";
import { MercatorPortfolio } from "@/data/portfolio";
import {
  MARINE_HULL_CAPACITY_RULES,
  MARINE_HULL_PRICING_RULES,
} from "@/ontology/rules/marine-hull";
import { COMPLIANCE_RULES } from "@/ontology/rules/shared";
import { UNDERWRITING_RULES } from "@/ontology/rules/underwriting";
import { computePricing } from "@/ontology/rules/evaluator";
import type {
  Rule,
  RuleResult,
  SerializableRule,
  Derivation,
} from "@/ontology/rules/types";
import type { UnderwritingScenario } from "@/data/underwriting-submissions/types";
import type { ZoneAggregate } from "@/data/portfolio/types";

export interface UWRuleResultRow {
  rule: SerializableRule;
  result: RuleResult;
}

export interface PortfolioImpact {
  zoneBefore: ZoneAggregate | null;
  zoneAfter: ZoneAggregate;
  classBefore: { class: string; sumInsured: number; averageRate: number };
  classAfter: { class: string; sumInsured: number; averageRate: number };
  capacityBefore: number;
  capacityAfter: number;
  treatyExposure: {
    netRetainedLine: number;
    firstAttachment: number;
    proximityPct: number;
  };
}

export interface PricingBreakdown {
  baseRate: number;
  modifiers: Array<{ id: string; name: string; value: number; reasoning: string }>;
  technicalRate: number;
  benchmarkRate: number;
  proposedRate: number;
  rateAdequate: boolean;
  rateDeviation: number;
}

export interface RenewalComparison {
  priorRate: number;
  proposedRate: number;
  rateMovement: number;
  priorPremium: number;
  proposedPremium: number;
  priorLossRatio: number;
  materialChanges: string[];
}

export interface UnderwritingDecision {
  scenario: UnderwritingScenario;
  ruleResults: UWRuleResultRow[];
  totalRulesEvaluated: number;
  rulesPassed: number;
  rulesFailed: number;
  conclusion: "bind" | "conditional" | "refer" | "decline";
  conclusionReasoning: string[];
  portfolioImpact: PortfolioImpact;
  pricing: PricingBreakdown;
  renewalComparison?: RenewalComparison;
  derivation: Derivation;
}

function serializeRule(rule: Rule): SerializableRule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { condition, failureMessage, successMessage, remediation, ...rest } = rule;
  return rest;
}

export function evaluateUnderwriting(
  scenario: UnderwritingScenario,
): UnderwritingDecision {
  const facts = { ...scenario.submission, zone: scenario.zone };

  const context = {
    syndicate: MercatorSyndicate2891,
    portfolio: MercatorPortfolio,
    currentDate: new Date("2026-05-15"),
    isRenewal: scenario.mode === "renewal",
    priorPolicy: scenario.priorPolicy,
  };

  // Combine all rule families
  const allRules = [
    ...MARINE_HULL_CAPACITY_RULES,
    ...COMPLIANCE_RULES,
    ...UNDERWRITING_RULES,
    ...MARINE_HULL_PRICING_RULES,
  ];

  const ruleResults: UWRuleResultRow[] = allRules.map((rule) => {
    const r = rule as Rule;
    const result = r.condition(facts, context);
    return { rule: serializeRule(r), result };
  });

  const applicableBooleans = ruleResults.filter(
    (r) => r.result.applicable && r.rule.evaluationType === "boolean",
  );
  const rulesPassed = applicableBooleans.filter((r) => r.result.fired).length;
  const rulesFailed = applicableBooleans.filter((r) => !r.result.fired).length;

  // Conclusion logic
  const failedRules = applicableBooleans.filter((r) => !r.result.fired);
  const hardDeclines = failedRules.filter(
    (r) => r.rule.severity === "hard-decline",
  );
  const softDeclines = failedRules.filter(
    (r) => r.rule.severity === "soft-decline",
  );
  const referrals = failedRules.filter((r) => r.rule.severity === "referral");
  const conditions = failedRules.filter((r) => r.rule.severity === "condition");

  let conclusion: UnderwritingDecision["conclusion"];
  const conclusionReasoning: string[] = [];

  if (hardDeclines.length > 0) {
    conclusion = "decline";
    for (const r of hardDeclines) {
      conclusionReasoning.push(`${r.rule.id}: ${r.result.reasoning}`);
    }
  } else if (referrals.length > 0 || softDeclines.length > 0) {
    conclusion = "refer";
    for (const r of [...referrals, ...softDeclines]) {
      conclusionReasoning.push(`${r.rule.id}: ${r.result.reasoning}`);
    }
  } else if (conditions.length > 0) {
    conclusion = "conditional";
    for (const r of conditions) {
      conclusionReasoning.push(`${r.rule.id}: ${r.result.reasoning}`);
    }
  } else {
    conclusion = "bind";
    conclusionReasoning.push(
      "All appetite, compliance, accumulation, and pricing rules satisfied",
    );
  }

  // Portfolio impact computation
  const zoneBefore =
    MercatorPortfolio.zoneAggregates.find((z) => z.zone === scenario.zone) ??
    null;
  const requestedLine = facts.context?.requestedLeadLine ?? 0.10;
  const exposureAdded = facts.coverage.hullValue * requestedLine;
  const premiumAdded = facts.coverage.hullValue * 0.0066 * requestedLine;

  const zoneLimit = zoneBefore?.limit ?? 200_000_000;
  const zoneAfter: ZoneAggregate = {
    zone: scenario.zone,
    sumInsured: (zoneBefore?.sumInsured ?? 0) + exposureAdded,
    premium: (zoneBefore?.premium ?? 0) + premiumAdded,
    riskCount: (zoneBefore?.riskCount ?? 0) + 1,
    limit: zoneLimit,
    utilization:
      ((zoneBefore?.sumInsured ?? 0) + exposureAdded) / zoneLimit,
  };

  const classKey = "marine.hull.bluewater";
  const classBefore =
    MercatorPortfolio.classAggregates.find((c) => c.class === classKey) ?? {
      class: classKey,
      sumInsured: 0,
      premium: 0,
      riskCount: 0,
      averageRate: 0.66,
    };
  const classAfter = {
    class: classKey,
    sumInsured: classBefore.sumInsured + exposureAdded,
    averageRate:
      (classBefore.averageRate * classBefore.riskCount + 0.66) /
      (classBefore.riskCount + 1),
  };

  const capacityBefore = MercatorPortfolio.bookSummary.totalPremium / MercatorPortfolio.stampCapacity;
  const capacityAfter =
    (MercatorPortfolio.bookSummary.totalPremium + premiumAdded) /
    MercatorPortfolio.stampCapacity;

  const netRetainedLine = exposureAdded * 0.75;
  const firstAttach = MercatorPortfolio.treaties.excessOfLoss[0].attachment;

  const portfolioImpact: PortfolioImpact = {
    zoneBefore,
    zoneAfter,
    classBefore: {
      class: classBefore.class,
      sumInsured: classBefore.sumInsured,
      averageRate: classBefore.averageRate,
    },
    classAfter,
    capacityBefore,
    capacityAfter,
    treatyExposure: {
      netRetainedLine,
      firstAttachment: firstAttach,
      proximityPct: netRetainedLine / firstAttach,
    },
  };

  // Pricing breakdown
  const pricingResults = ruleResults.filter(
    (r) =>
      r.rule.evaluationType === "scalar-modifier" ||
      r.rule.evaluationType === "lookup",
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pricing = computePricing<any>(pricingResults as any);
  const technicalRate = pricing.finalRate;

  const benchmarkClass = MercatorPortfolio.classAggregates.find(
    (c) => c.class === classKey,
  );
  const benchmarkRate = benchmarkClass?.averageRate ?? 0.66;
  const proposedRate = scenario.priorPolicy?.rate ?? technicalRate;
  const rateDeviation = (proposedRate - benchmarkRate) / benchmarkRate;
  const rateAdequate = Math.abs(rateDeviation) <= 0.15;

  const pricingBreakdown: PricingBreakdown = {
    baseRate: pricing.baseRate,
    modifiers: pricing.modifiers,
    technicalRate,
    benchmarkRate,
    proposedRate: technicalRate,
    rateAdequate,
    rateDeviation,
  };

  // Renewal comparison
  let renewalComparison: RenewalComparison | undefined;
  if (scenario.mode === "renewal" && scenario.priorPolicy) {
    const priorLosses = scenario.priorPolicy.lossesInPeriod.reduce(
      (s, l) => s + l.paid,
      0,
    );
    renewalComparison = {
      priorRate: scenario.priorPolicy.rate,
      proposedRate: technicalRate,
      rateMovement:
        (technicalRate - scenario.priorPolicy.rate) / scenario.priorPolicy.rate,
      priorPremium: scenario.priorPolicy.premium,
      proposedPremium: facts.coverage.hullValue * (technicalRate / 100),
      priorLossRatio: priorLosses / scenario.priorPolicy.premium,
      materialChanges: scenario.priorPolicy.materialChanges ?? [],
    };
  }

  return {
    scenario,
    ruleResults,
    totalRulesEvaluated: ruleResults.length,
    rulesPassed,
    rulesFailed,
    conclusion,
    conclusionReasoning,
    portfolioImpact,
    pricing: pricingBreakdown,
    renewalComparison,
    derivation: {
      conclusion: conclusionLabel(conclusion),
      reasoning: conclusionReasoning,
    },
  };
}

function conclusionLabel(c: UnderwritingDecision["conclusion"]): string {
  switch (c) {
    case "bind":
      return "Recommend bind";
    case "conditional":
      return "Bind subject to condition";
    case "refer":
      return "Refer to Active Underwriter";
    case "decline":
      return "Decline";
  }
}
