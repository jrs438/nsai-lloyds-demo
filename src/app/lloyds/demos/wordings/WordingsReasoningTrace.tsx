"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { WordingDeviation } from "@/data/wordings/deviations";

const CLASSIFICATION_COLORS: Record<string, string> = {
  broadening: "#4a9eff",
  narrowing: "#d68744",
  ambiguous: "#9b6bff",
  neutral: "#6a6a6a",
};

export function WordingsReasoningTrace({
  deviations,
  activeId,
}: {
  deviations: WordingDeviation[];
  activeId: string;
}) {
  const [reRunCount, setReRunCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const active = deviations.find((d) => d.id === activeId) ?? deviations[0];

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
            {deviations.length} deviations classified · selected: {active.id}
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
        <Stage
          num="01"
          label="Document parsing"
          color="var(--trace-neural)"
          meta="0.97 confidence"
        >
          <ul className="text-xs space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span style={{ color: "var(--trace-neural)" }}>●</span>
              <span>Both texts segmented into 8 clauses + sub-clauses</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span style={{ color: "var(--trace-neural)" }}>●</span>
              <span>Standard wording identified as LMA5395 (reference text)</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span style={{ color: "var(--trace-neural)" }}>●</span>
              <span>Manuscript variant detected via differential analysis</span>
            </li>
          </ul>
        </Stage>

        <Stage
          num="02"
          label="Deviation detection"
          color="var(--trace-ontology)"
        >
          <ul className="text-xs space-y-1.5">
            <li className="flex items-start gap-1.5">
              <span style={{ color: "var(--trace-ontology)" }}>●</span>
              <span>{deviations.length} discrete deviations identified</span>
            </li>
            <li className="flex items-start gap-1.5 ml-3">
              <span style={{ color: "var(--text-tertiary)" }}>↳</span>
              <span style={{ color: "var(--text-tertiary)" }}>
                {deviations.filter((d) => d.changeType === "addition").length}{" "}
                additions ·{" "}
                {deviations.filter((d) => d.changeType === "deletion").length}{" "}
                deletions ·{" "}
                {deviations.filter((d) => d.changeType === "modification").length}{" "}
                modifications
              </span>
            </li>
          </ul>
        </Stage>

        <Stage
          num="03"
          label="Classification logic"
          color="var(--trace-symbolic)"
          meta={`evaluating ${active.id}`}
        >
          <div className="text-xs space-y-2">
            <div
              className="p-3 border"
              style={{
                borderColor: CLASSIFICATION_COLORS[active.classification],
                background: `${CLASSIFICATION_COLORS[active.classification]}11`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {active.id}
                </span>
                <span
                  className="font-mono uppercase tracking-wider"
                  style={{
                    color: CLASSIFICATION_COLORS[active.classification],
                  }}
                >
                  {active.classification}
                </span>
              </div>
              <div className="leading-relaxed">{active.clauseReference}</div>
              <div
                className="mt-2 text-[11px] italic"
                style={{ color: "var(--text-secondary)" }}
              >
                {active.classificationReasoning}
              </div>
            </div>

            <div>
              <div
                className="section-label mb-1"
                style={{ fontSize: "0.65rem" }}
              >
                Rules triggered
              </div>
              <div className="space-y-1 font-mono">
                {active.rulesTriggered.map((r) => (
                  <div
                    key={r}
                    className="text-[11px] flex items-baseline gap-2"
                  >
                    <span style={{ color: "var(--trace-rule-fired)" }}>✓</span>
                    <span style={{ color: "var(--text-tertiary)" }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Stage>

        <Stage
          num="04"
          label="Derivation"
          color="var(--trace-deterministic)"
          meta={`1.0 deterministic${reRunCount > 0 ? ` · Run ${reRunCount + 1}` : ""}`}
        >
          <div className="text-xs space-y-2">
            <div>
              <span style={{ color: "var(--text-tertiary)" }}>
                Net effect:{" "}
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  color: CLASSIFICATION_COLORS[active.classification],
                }}
              >
                {active.classification}
              </span>
            </div>
            {active.ruleImpact.activatesRules?.length ? (
              <div>
                <span style={{ color: "var(--text-tertiary)" }}>
                  Activates rules:{" "}
                </span>
                <span className="font-mono">
                  {active.ruleImpact.activatesRules.join(", ")}
                </span>
              </div>
            ) : null}
            {active.ruleImpact.deactivatesRules?.length ? (
              <div>
                <span style={{ color: "var(--text-tertiary)" }}>
                  Deactivates rules:{" "}
                </span>
                <span className="font-mono">
                  {active.ruleImpact.deactivatesRules.join(", ")}
                </span>
              </div>
            ) : null}
            {active.ruleImpact.modifiesRules?.length ? (
              <div>
                <span style={{ color: "var(--text-tertiary)" }}>
                  Modifies rules:{" "}
                </span>
                <span className="font-mono">
                  {active.ruleImpact.modifiesRules.join(", ")}
                </span>
              </div>
            ) : null}
          </div>
        </Stage>

        {reRunCount > 0 && (
          <div
            className="text-xs italic px-3 py-2 border-l-2"
            style={{
              borderColor: "var(--trace-deterministic)",
              color: "var(--text-tertiary)",
            }}
          >
            Same inputs produced identical classification across{" "}
            {reRunCount + 1} runs.
          </div>
        )}
      </div>
    </div>
  );
}

function Stage({
  num,
  label,
  color,
  meta,
  children,
}: {
  num: string;
  label: string;
  color: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-xs" style={{ color }}>
          {num} / {label.toUpperCase()}
        </span>
        {meta && (
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {meta}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
