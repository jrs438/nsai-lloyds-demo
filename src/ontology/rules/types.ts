export type RuleDomain =
  | "appetite"
  | "capacity"
  | "pricing"
  | "coverage"
  | "wording"
  | "compliance"
  | "accumulation"
  | "claims"
  | "reserving";

export type RuleSeverity =
  | "hard-decline"
  | "soft-decline"
  | "referral"
  | "condition"
  | "pricing-modifier"
  | "wording-trigger"
  | "flag"
  | "pass";

export type RuleEvaluationType =
  | "boolean"
  | "scalar-modifier"
  | "constraint"
  | "classification"
  | "lookup";

export type RuleAuthority = {
  type:
    | "underwriting-manual"
    | "regulatory"
    | "treaty"
    | "board-policy"
    | "lma-standard"
    | "sanctions-list"
    | "class-document";
  reference: string;
  effective: string;
  lastReviewed: string;
  owner: string;
};

export type RuleAuditability =
  | "visible"
  | "visible-on-fire"
  | "expandable"
  | "aggregate-only";

export interface RuleResult {
  fired: boolean;
  applicable: boolean;
  value?: number | string | Record<string, unknown>;
  reasoning: string;
  factsUsed: string[];
  confidence: 1.0;
}

export type SerializableRule = Omit<
  Rule,
  "condition" | "failureMessage" | "successMessage" | "remediation"
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Rule<TFacts = any, TContext = any> {
  id: string;
  name: string;
  description: string;
  version: string;

  domain: RuleDomain;
  severity: RuleSeverity;
  evaluationType: RuleEvaluationType;
  authority: RuleAuthority;
  auditability: RuleAuditability;

  applicableClasses: string[];
  applicableSyndicates?: string[];
  applicableWordings?: string[];

  condition: (facts: TFacts, context: TContext) => RuleResult;

  failureMessage?: (facts: TFacts, context: TContext) => string;
  successMessage?: (facts: TFacts, context: TContext) => string;
  remediation?: (facts: TFacts, context: TContext) => string[];

  supersedes?: string[];
  triggeredBy?: string[];
  triggers?: string[];

  tags: string[];
  createdAt: string;
  notes?: string;
}

export interface Derivation {
  conclusion: string;
  reasoning: string[];
  recommendations?: string[];
}

export interface SyndicateLike {
  id: string;
  name: string;
  classes: Record<string, ClassAppetite>;
  [key: string]: unknown;
}

export interface ClassAppetite {
  role?: string;
  appetite: Record<string, unknown>;
  [key: string]: unknown;
}
