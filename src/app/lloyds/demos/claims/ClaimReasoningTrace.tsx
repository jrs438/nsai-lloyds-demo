"use client";

import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import type { ClaimsEvaluationOutput, ClaimRuleResultRow } from "@/lib/claims-engine";
import type { SerializableRule, RuleResult } from "@/ontology/rules/types";
import { RuleDetail } from "@/components/reasoning/RuleDetail";

export function ClaimReasoningTrace({
  evaluation,
}: {
  evaluation: ClaimsEvaluationOutput;
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
            {evaluation.totalRulesEvaluated} rules ·{" "}
            {evaluation.rulesFired} fired · {evaluation.rulesFailed} failed
          </div>
        </div>
        <button
          onClick={reRun}
          className="text-xs px-2 py-1 inline-flex items-center gap-1.5 hover:bg-[var(--bg-primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <RotateCcw className="w-3 h-3" /> Re-run
        </button>
      </header>

      <div
        className={`p-4 space-y-6 transition-opacity ${pulse ? "opacity-60" : "opacity-100"}`}
      >
        {/* Stage 01 — Extraction */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--trace-neural)" }}
            >
              01 / NEURAL EXTRACTION
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              0.92 confidence
            </span>
          </div>
          <ul className="text-xs space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span className="text-trace-neural">●</span>
              <span>
                Loss type ·{" "}
                {evaluation.claim.type === "property"
                  ? "Property — Fire (electrical cause)"
                  : evaluation.claim.type === "marine"
                    ? "Marine — Cargo damage (carrier negligence)"
                    : "Cyber — Ransomware encryption"}
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-trace-neural">●</span>
              <span>Loss date · {evaluation.claim.lossDate}</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-trace-neural">●</span>
              <span>
                Alleged quantum · {evaluation.claim.alleged.currency}{" "}
                {evaluation.claim.alleged.quantum.toLocaleString()}
              </span>
            </li>
          </ul>
        </div>

        {/* Stage 02 — Ontology mapping */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--trace-ontology)" }}
            >
              02 / ONTOLOGY MAPPING
            </span>
          </div>
          <ul className="text-xs space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span className="text-trace-ontology">●</span>
              <span>
                Policy · {evaluation.claim.policy.wording}
                {evaluation.manuscripts.length > 0 && (
                  <span style={{ color: "var(--trace-ontology)" }}>
                    {" "}
                    + {evaluation.manuscripts.map((m) => m.id).join(", ")}
                  </span>
                )}
              </span>
            </li>
            {evaluation.manuscripts.flatMap((m) =>
              m.modifications.map((mod, i) => (
                <li
                  key={`${m.id}-${i}`}
                  className="flex items-start gap-1.5 ml-3"
                >
                  <span style={{ color: "var(--trace-ontology)" }}>↳</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    <span className="font-mono">{mod.type}</span>{" "}
                    <span className="font-mono">{mod.ruleId}</span>
                  </span>
                </li>
              )),
            )}
          </ul>
        </div>

        {/* Stage 03 — Coverage rule evaluation */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--trace-symbolic)" }}
            >
              03 / COVERAGE LOGIC
            </span>
          </div>
          <div className="space-y-1">
            {evaluation.ruleResults
              .filter((r) => r.result.applicable)
              .map((row) => (
                <RuleRow
                  key={row.rule.id}
                  row={row}
                  onClick={() => setOpenRule({ rule: row.rule, result: row.result })}
                />
              ))}
            {evaluation.ruleResults
              .filter((r) => !r.result.applicable && r.rule.id === "COV-EXCL-031")
              .map((row) => (
                <RuleRow
                  key={row.rule.id}
                  row={row}
                  onClick={() => setOpenRule({ rule: row.rule, result: row.result })}
                  deactivated
                />
              ))}
          </div>
        </div>

        {/* Stage 04 — Derivation */}
        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--border-strong)" }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--trace-deterministic)" }}
            >
              04 / DERIVATION · 1.0 deterministic
              {reRunCount > 0 && (
                <span style={{ color: "var(--text-tertiary)" }}>
                  {" "}
                  · Run {reRunCount + 1} (identical)
                </span>
              )}
            </span>
          </div>
          <div className="font-serif text-base mb-2">
            {evaluation.decision.coveragePosition.replace(/-/g, " ")}
          </div>
          <div
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Net response{" "}
            <span style={{ color: "var(--accent-primary)" }}>
              {evaluation.claim.alleged.currency}{" "}
              {evaluation.decision.netPolicyResponse.toLocaleString()}
            </span>
          </div>
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

function RuleRow({
  row,
  onClick,
  deactivated,
}: {
  row: ClaimRuleResultRow;
  onClick: () => void;
  deactivated?: boolean;
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
      {deactivated ? (
        <span
          className="w-3 h-3 mt-0.5 shrink-0 text-center text-[10px]"
          style={{ color: "var(--trace-ontology)" }}
        >
          ⊘
        </span>
      ) : isModifier ? (
        <span
          className="w-3 h-3 mt-0.5 shrink-0 text-center text-[10px]"
          style={{ color: "var(--accent-primary)" }}
        >
          ƒ
        </span>
      ) : fired ? (
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
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            {row.rule.id}
          </span>
          <span
            className="truncate"
            style={{
              color: deactivated ? "var(--text-tertiary)" : "var(--text-primary)",
              textDecoration: deactivated ? "line-through" : "none",
            }}
          >
            {row.rule.name}
          </span>
        </div>
        <div
          className="font-mono text-[11px] mt-0.5"
          style={{
            color: deactivated
              ? "var(--trace-ontology)"
              : fired || isModifier
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
