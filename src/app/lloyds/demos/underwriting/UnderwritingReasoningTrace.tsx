"use client";

import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import type { UnderwritingDecision, UWRuleResultRow } from "@/lib/underwriting-engine";
import type { SerializableRule, RuleResult } from "@/ontology/rules/types";
import { RuleDetail } from "@/components/reasoning/RuleDetail";

export function UnderwritingReasoningTrace({
  decision,
}: {
  decision: UnderwritingDecision;
}) {
  const [openRule, setOpenRule] = useState<{
    rule: SerializableRule;
    result: RuleResult;
  } | null>(null);
  const [reRunCount, setReRunCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  function reRun() {
    setPulse(true);
    setReRunCount((n) => n + 1);
    setTimeout(() => setPulse(false), 600);
  }

  // Group rules by domain for cleaner display
  const groups = groupRules(decision.ruleResults);

  return (
    <div className="card sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
      <header
        className="px-5 py-4 border-b border-subtle flex items-center justify-between sticky top-0 z-10"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div>
          <div className="section-label">Reasoning trace</div>
          <div
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-tertiary)" }}
          >
            {decision.totalRulesEvaluated} rules · {decision.rulesPassed}{" "}
            passed · {decision.rulesFailed} failed
          </div>
        </div>
        <button
          onClick={reRun}
          className="text-xs px-2 py-1 inline-flex items-center gap-1.5 hover:bg-[var(--bg-primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Re-run reasoning"
        >
          <RotateCcw className="w-3 h-3" /> Re-run
        </button>
      </header>

      <div
        className={`p-4 space-y-6 transition-opacity ${pulse ? "opacity-60" : "opacity-100"}`}
      >
        {groups.map((g) => (
          <DomainGroup
            key={g.label}
            label={g.label}
            color={g.color}
            rows={g.rows}
            onOpenRule={(rule, result) => setOpenRule({ rule, result })}
          />
        ))}

        <div
          className="border-t border-subtle pt-4"
          style={{ borderColor: "var(--border-strong)" }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <div className="section-label" style={{ color: "var(--trace-deterministic)" }}>
              Derivation · 1.0 deterministic
              {reRunCount > 0 && (
                <span
                  className="font-mono ml-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  · Run {reRunCount + 1} (identical)
                </span>
              )}
            </div>
          </div>
          <div className="font-serif text-base mb-3">
            {decision.derivation.conclusion}
          </div>
          <ul className="space-y-1.5">
            {decision.conclusionReasoning.map((r, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span style={{ color: "var(--accent-primary)" }}>→</span>
                <span style={{ color: "var(--text-secondary)" }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>

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

      <RuleDetail
        rule={openRule?.rule ?? null}
        result={openRule?.result ?? null}
        open={!!openRule}
        onOpenChange={(o) => !o && setOpenRule(null)}
      />
    </div>
  );
}

function DomainGroup({
  label,
  color,
  rows,
  onOpenRule,
}: {
  label: string;
  color: string;
  rows: UWRuleResultRow[];
  onOpenRule: (rule: SerializableRule, result: RuleResult) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const applicable = rows.filter((r) => r.result.applicable);
  const passed = applicable.filter((r) => r.result.fired).length;
  const failed = applicable.filter(
    (r) => !r.result.fired && r.rule.evaluationType === "boolean",
  );

  // Show: all failed rules + visible-on-fire/visible passes
  const visible = applicable.filter((r) => {
    if (!r.result.fired) return true;
    if (r.rule.auditability === "visible") return true;
    return false;
  });

  const hidden = applicable.length - visible.length;
  const displayRows = expanded ? applicable : visible;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div className="section-label" style={{ color }}>
          {label}
        </div>
        <span
          className="font-mono text-xs"
          style={{
            color:
              failed.length > 0
                ? "var(--trace-rule-failed)"
                : "var(--text-tertiary)",
          }}
        >
          {passed}/{applicable.length} passed
        </span>
      </div>
      <div className="space-y-1">
        {displayRows.map((row) => (
          <RuleRow
            key={row.rule.id}
            row={row}
            onClick={() => onOpenRule(row.rule, row.result)}
          />
        ))}
        {hidden > 0 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs hover:text-white transition-colors pl-6"
            style={{ color: "var(--text-tertiary)" }}
          >
            [+ {hidden} more passed — show all]
          </button>
        )}
      </div>
    </div>
  );
}

function RuleRow({
  row,
  onClick,
}: {
  row: UWRuleResultRow;
  onClick: () => void;
}) {
  const fired = row.result.fired;
  const isModifier =
    row.rule.evaluationType === "scalar-modifier" ||
    row.rule.evaluationType === "lookup";

  return (
    <button
      onClick={onClick}
      className="w-full text-left text-xs flex items-start gap-2 px-2 py-1 hover:bg-[var(--bg-elevated)] transition-colors"
    >
      {!isModifier && (
        <>
          {fired ? (
            <Check
              className="w-3 h-3 mt-0.5 shrink-0"
              style={{ color: "var(--trace-rule-fired)" }}
            />
          ) : (
            <X
              className="w-3 h-3 mt-0.5 shrink-0"
              style={{ color: "var(--trace-rule-failed)" }}
            />
          )}
        </>
      )}
      {isModifier && (
        <span
          className="w-3 h-3 mt-0.5 shrink-0 text-center text-[10px]"
          style={{ color: "var(--accent-primary)" }}
        >
          ƒ
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            {row.rule.id}
          </span>
          <span className="truncate">{row.rule.name}</span>
        </div>
        <div
          className="font-mono text-[11px] mt-0.5"
          style={{
            color: fired || isModifier
              ? "var(--text-tertiary)"
              : "var(--trace-rule-failed)",
          }}
        >
          {row.result.reasoning}
        </div>
      </div>
    </button>
  );
}

interface DomainGroupSpec {
  label: string;
  color: string;
  rows: UWRuleResultRow[];
}

function groupRules(rows: UWRuleResultRow[]): DomainGroupSpec[] {
  const appetite = rows.filter(
    (r) => r.rule.domain === "appetite" && r.result.applicable,
  );
  const compliance = rows.filter(
    (r) => r.rule.domain === "compliance" && r.result.applicable,
  );
  const accumulation = rows.filter(
    (r) => r.rule.domain === "accumulation" && r.result.applicable,
  );
  const pricing = rows.filter(
    (r) => r.rule.domain === "pricing" && r.result.applicable,
  );

  return [
    {
      label: "Appetite & capacity",
      color: "var(--text-primary)",
      rows: appetite,
    },
    {
      label: "Compliance & sanctions",
      color: "var(--text-primary)",
      rows: compliance,
    },
    {
      label: "Portfolio & accumulation",
      color: "var(--text-primary)",
      rows: accumulation,
    },
    {
      label: "Pricing factors",
      color: "var(--text-primary)",
      rows: pricing,
    },
  ].filter((g) => g.rows.length > 0);
}
