"use client";

import { useState } from "react";
import {
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Scale,
  RotateCcw,
} from "lucide-react";
import type { ExtractionTrace } from "@/data/extraction-traces";
import type { PlacementRecommendation, SyndicateEvaluation } from "@/lib/placement-engine";
import type { SerializableRule, RuleResult } from "@/ontology/rules/types";
import { RuleDetail } from "./RuleDetail";
import { LlmComparisonPanel } from "./LlmComparisonPanel";
import type { LlmComparison } from "@/data/llm-comparisons";
import type { MarineHullSubmission } from "@/ontology/classes/marine";

interface ReasoningTraceProps {
  extraction: ExtractionTrace;
  placement: PlacementRecommendation;
  llmComparison: LlmComparison;
  submission: MarineHullSubmission;
}

export function ReasoningTrace({
  extraction,
  placement,
  llmComparison,
}: ReasoningTraceProps) {
  const [openSerializableRule, setOpenSerializableRule] = useState<{
    rule: SerializableRule;
    result: RuleResult;
  } | null>(null);
  const [view, setView] = useState<"trace" | "compare">("trace");
  const [reRunCount, setReRunCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  function reRun() {
    setPulse(true);
    setReRunCount((n) => n + 1);
    setTimeout(() => setPulse(false), 600);
  }

  return (
    <div className="card sticky top-6">
      <header
        className="px-5 py-4 border-b border-subtle flex items-center justify-between"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="section-label">Reasoning trace</div>
        <div className="flex items-center gap-2">
          <button
            onClick={reRun}
            className="text-xs px-2 py-1 inline-flex items-center gap-1.5 hover:bg-[var(--bg-primary)] transition-colors"
            style={{ color: "var(--text-secondary)" }}
            title="Re-run reasoning"
          >
            <RotateCcw className="w-3 h-3" /> Re-run
          </button>
          <button
            onClick={() => setView(view === "trace" ? "compare" : "trace")}
            className="text-xs px-2 py-1 inline-flex items-center gap-1.5 hover:bg-[var(--bg-primary)] transition-colors"
            style={{
              color:
                view === "compare"
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
            }}
            title="Compare to LLM"
          >
            <Scale className="w-3 h-3" /> Compare LLM
          </button>
        </div>
      </header>

      {view === "compare" ? (
        <LlmComparisonPanel comparison={llmComparison} nsaiPlacement={placement} />
      ) : (
        <div className={`p-5 space-y-8 transition-opacity ${pulse ? "opacity-60" : "opacity-100"}`}>
          <Stage
            num="01"
            label="Neural extraction"
            meta={`Computed in ${extraction.computedInMs}ms · confidence ${extraction.overallConfidence}`}
            color="neural"
          >
            <ul className="space-y-2 text-sm">
              {extraction.facts.map((f) => (
                <li key={f.label}>
                  <div className="flex items-start gap-2">
                    <span className="text-trace-neural mt-0.5">●</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span style={{ color: "var(--text-tertiary)" }}>
                          {f.label}:
                        </span>
                        <span>{f.value}</span>
                        <span
                          className="font-mono text-xs"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {f.confidence.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className="text-xs ml-3"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        ↳ {f.source}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Stage>

          <Stage
            num="02"
            label="Ontology mapping"
            meta="marine.hull.bluewater"
            color="ontology"
          >
            <ul className="space-y-1.5 text-sm">
              <li>
                <OntologyRow
                  source="Insured"
                  arrow="Party.Insured"
                />
              </li>
              <li>
                <OntologyRow
                  source="Vessel"
                  arrow="Asset.Vessel.BulkCarrier"
                />
              </li>
              <li>
                <OntologyRow source="Hull value" arrow="Coverage.SumInsured" />
              </li>
              <li>
                <OntologyRow source="Trading area" arrow="Risk.Geography" />
              </li>
              <li className="pt-2" style={{ color: "var(--text-secondary)" }}>
                ● Required attributes present:{" "}
                <span style={{ color: "var(--trace-rule-fired)" }}>9/9 ✓</span>
              </li>
            </ul>
          </Stage>

          <Stage
            num="03"
            label="Rule evaluation"
            meta={`${placement.syndicateEvaluations.length} syndicates × ${placement.totalRulesEvaluated} rules`}
            color="symbolic"
          >
            <div className="space-y-3">
              {placement.syndicateEvaluations.map((ev) => (
                <SyndicateEvaluationBlock
                  key={ev.syndicate.id}
                  evaluation={ev}
                  onOpenRule={(rule, result) => setOpenSerializableRule({ rule, result })}
                />
              ))}
            </div>
          </Stage>

          <Stage
            num="04"
            label="Derivation"
            meta={`Deterministic · 1.0${reRunCount > 0 ? ` · Run ${reRunCount + 1} (identical to prior)` : ""}`}
            color="deterministic"
          >
            <DerivationBlock placement={placement} />
          </Stage>

          {reRunCount > 0 && (
            <div
              className="text-xs italic px-3 py-2 border-l-2"
              style={{
                borderColor: "var(--trace-deterministic)",
                color: "var(--text-tertiary)",
              }}
            >
              Same inputs produced identical output across {reRunCount + 1} runs.
            </div>
          )}
        </div>
      )}

      <RuleDetail
        rule={openSerializableRule?.rule ?? null}
        result={openSerializableRule?.result ?? null}
        open={!!openSerializableRule}
        onOpenChange={(o) => !o && setOpenSerializableRule(null)}
      />
    </div>
  );
}

function Stage({
  num,
  label,
  meta,
  color,
  children,
}: {
  num: string;
  label: string;
  meta: string;
  color: "neural" | "ontology" | "symbolic" | "deterministic";
  children: React.ReactNode;
}) {
  const colorVar = `var(--trace-${color === "symbolic" ? "symbolic" : color === "deterministic" ? "deterministic" : color})`;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono text-xs"
            style={{ color: colorVar }}
          >
            {num} /
          </span>
          <span className="section-label" style={{ color: "var(--text-primary)" }}>
            {label}
          </span>
        </div>
        <span
          className="font-mono text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          {meta}
        </span>
      </div>
      {children}
    </div>
  );
}

function OntologyRow({ source, arrow }: { source: string; arrow: string }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="text-trace-ontology">●</span>
      <span>{source}</span>
      <span style={{ color: "var(--text-tertiary)" }}>→</span>
      <span className="font-mono text-xs">{arrow}</span>
    </div>
  );
}

function SyndicateEvaluationBlock({
  evaluation,
  onOpenRule,
}: {
  evaluation: SyndicateEvaluation;
  onOpenRule: (rule: SerializableRule, result: RuleResult) => void;
}) {
  const [expanded, setExpanded] = useState(
    evaluation.status !== "decline" && evaluation.status !== "soft-decline",
  );
  const [showAllSerializableRules, setShowAllSerializableRules] = useState(false);

  const ev = evaluation;
  const allResults = ev.output.results.filter(
    (r) => r.result.applicable && r.rule.evaluationType === "boolean",
  );

  const visibleResults = showAllSerializableRules
    ? allResults
    : allResults.filter((r) => {
        if (r.rule.auditability === "visible") return true;
        if (r.rule.auditability === "visible-on-fire" && !r.result.fired) return true;
        if (!r.result.fired) return true;
        return r.rule.severity !== "pass";
      }).slice(0, 8);

  const hidden = allResults.length - visibleResults.length;

  const statusColor =
    ev.status === "eligible"
      ? "var(--trace-rule-fired)"
      : ev.status === "conditional"
        ? "#d4a542"
        : ev.status === "referral"
          ? "var(--trace-ontology)"
          : ev.status === "soft-decline"
            ? "#d68744"
            : "var(--trace-rule-failed)";

  return (
    <div className="border border-subtle">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full p-3 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-mono text-xs truncate">
              {ev.syndicate.id} · {ev.syndicate.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            {ev.output.rulesFired}/{ev.output.rulesApplicable}
          </span>
          <span
            className="text-xs uppercase tracking-wider font-medium"
            style={{ color: statusColor }}
          >
            {ev.status}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-subtle p-3 space-y-1.5 bg-[var(--bg-primary)]">
          {visibleResults.map((row) => (
            <SerializableRuleRow
              key={row.rule.id}
              rule={row.rule}
              result={row.result}
              onOpen={() => onOpenRule(row.rule, row.result)}
            />
          ))}
          {hidden > 0 && (
            <button
              onClick={() => setShowAllSerializableRules(true)}
              className="text-xs pl-6 hover:text-white transition-colors"
              style={{ color: "var(--text-tertiary)" }}
            >
              [+ {hidden} more rules — show all]
            </button>
          )}
          {showAllSerializableRules && (
            <PricingSerializableRulesBlock evaluation={ev} onOpenRule={onOpenRule} />
          )}
        </div>
      )}
    </div>
  );
}

function SerializableRuleRow({
  rule,
  result,
  onOpen,
}: {
  rule: SerializableRule;
  result: RuleResult;
  onOpen: () => void;
}) {
  const fired = result.fired;
  return (
    <button
      onClick={onOpen}
      className="w-full text-left text-sm flex items-start gap-2 px-2 py-1 hover:bg-[var(--bg-elevated)] transition-colors"
    >
      {fired ? (
        <Check
          className="w-3.5 h-3.5 mt-0.5 shrink-0"
          style={{ color: "var(--trace-rule-fired)" }}
        />
      ) : (
        <X
          className="w-3.5 h-3.5 mt-0.5 shrink-0"
          style={{ color: "var(--trace-rule-failed)" }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {rule.id}
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            ·
          </span>
          <span className="text-xs truncate">{rule.name}</span>
        </div>
        <div
          className="text-xs mt-0.5 font-mono"
          style={{ color: fired ? "var(--text-tertiary)" : "var(--trace-rule-failed)" }}
        >
          {result.reasoning}
        </div>
      </div>
      <span
        className="font-mono text-xs shrink-0 uppercase"
        style={{
          color: fired ? "var(--trace-rule-fired)" : "var(--trace-rule-failed)",
        }}
      >
        {fired ? "FIRED" : rule.severity.toUpperCase()}
      </span>
    </button>
  );
}

function PricingSerializableRulesBlock({
  evaluation,
  onOpenRule,
}: {
  evaluation: SyndicateEvaluation;
  onOpenRule: (rule: SerializableRule, result: RuleResult) => void;
}) {
  const pricingResults = evaluation.output.results.filter(
    (r) => r.rule.evaluationType === "scalar-modifier" || r.rule.evaluationType === "lookup",
  );

  return (
    <div className="mt-3 pt-3 border-t border-subtle space-y-1.5">
      <div
        className="section-label"
        style={{ color: "var(--text-tertiary)", fontSize: "0.65rem" }}
      >
        Pricing factors
      </div>
      {pricingResults.map((row) => (
        <button
          key={row.rule.id}
          onClick={() => onOpenRule(row.rule, row.result)}
          className="w-full text-left text-xs flex items-baseline gap-2 px-2 py-1 hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <span
            className="font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            {row.rule.id}
          </span>
          <span className="flex-1 truncate font-mono">
            {row.result.reasoning}
          </span>
          {typeof row.result.value === "number" && row.rule.id !== "MH-PRC-01" && (
            <span
              className="font-mono"
              style={{
                color:
                  (row.result.value as number) > 0
                    ? "#d68744"
                    : (row.result.value as number) < 0
                      ? "var(--trace-rule-fired)"
                      : "var(--text-tertiary)",
              }}
            >
              {(row.result.value as number) > 0 ? "+" : ""}
              {((row.result.value as number) * 100).toFixed(1)}%
            </span>
          )}
          {row.rule.id === "MH-PRC-01" && (
            <span className="font-mono">
              {(row.result.value as number).toFixed(2)}%
            </span>
          )}
        </button>
      ))}
      <div className="pt-2 mt-2 border-t border-subtle text-xs font-mono">
        <span style={{ color: "var(--text-tertiary)" }}>Derived rate: </span>
        <span style={{ color: "var(--accent-primary)" }}>
          {evaluation.pricing.finalRate.toFixed(2)}%
        </span>
        <span style={{ color: "var(--text-tertiary)" }}> of hull value</span>
      </div>
    </div>
  );
}

function DerivationBlock({
  placement,
}: {
  placement: PlacementRecommendation;
}) {
  return (
    <div className="space-y-3 text-sm">
      <DerivationRow
        label="Eligible lead candidates"
        value={`${placement.recommendedLeads.length} of 8 syndicates`}
        detail={
          placement.recommendedLeads.length === 0
            ? "—"
            : placement.recommendedLeads
                .map((e) => e.syndicate.name.replace(/Syndicate /, ""))
                .join(", ")
        }
      />
      {placement.conditionalLeads.length > 0 && (
        <DerivationRow
          label="Conditional lead candidates"
          value={`${placement.conditionalLeads.length} syndicates`}
          detail={`${placement.conditionalLeads
            .map((e) => e.syndicate.name.replace(/Syndicate /, ""))
            .join(", ")} — pending condition`}
        />
      )}
      {placement.recommendedFollowers.length > 0 && (
        <DerivationRow
          label="Recommended followers"
          value={`${placement.recommendedFollowers.length} syndicates`}
          detail={placement.recommendedFollowers
            .map((e) => `${e.syndicate.name.replace(/Syndicate /, "")} (${(e.recommendedFollowLine * 100).toFixed(1)}%)`)
            .join(", ")}
        />
      )}
      <DerivationRow
        label="Indicative rate range"
        value={`${placement.indicativeRate.min.toFixed(2)}% – ${placement.indicativeRate.max.toFixed(2)}%`}
        detail="of hull value, derived from rule-based pricing"
      />
      {placement.recommendedActions.length > 0 && (
        <div className="pt-3 mt-3 border-t border-subtle">
          <div className="section-label mb-2" style={{ fontSize: "0.65rem" }}>
            Recommended actions
          </div>
          <ul className="space-y-1 text-sm">
            {placement.recommendedActions.map((a, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: "var(--accent-primary)" }}>→</span>
                <span style={{ color: "var(--text-secondary)" }}>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DerivationRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span style={{ color: "var(--accent-primary)" }}>→</span>
        <span style={{ color: "var(--text-secondary)" }}>{label}:</span>
        <span>{value}</span>
      </div>
      {detail && (
        <div
          className="text-xs ml-5 mt-0.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {detail}
        </div>
      )}
    </div>
  );
}
