import type { WordingDeviation } from "@/data/wordings/deviations";

const CLASSIFICATION_COLORS: Record<string, string> = {
  broadening: "#4a9eff",
  narrowing: "#d68744",
  ambiguous: "#9b6bff",
  neutral: "#6a6a6a",
};

export function DeviationDetail({
  deviation,
}: {
  deviation: WordingDeviation;
}) {
  const color = CLASSIFICATION_COLORS[deviation.classification];

  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="section-label">Deviation analysis</div>
            <div
              className="font-mono text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {deviation.id} · {deviation.clauseReference}
            </div>
          </div>
          <span
            className="font-mono text-xs uppercase tracking-wider px-2 py-1"
            style={{
              color,
              border: `1px solid ${color}`,
            }}
          >
            {deviation.classification}
          </span>
        </div>
      </header>

      <div className="p-5 space-y-5 text-sm">
        <div>
          <div className="section-label mb-2">Classification reasoning</div>
          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {deviation.classificationReasoning}
          </p>
        </div>

        <div>
          <div className="section-label mb-2">Risk implication</div>
          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {deviation.riskImplication}
          </p>
        </div>

        {(deviation.ruleImpact.activatesRules?.length ||
          deviation.ruleImpact.deactivatesRules?.length ||
          deviation.ruleImpact.modifiesRules?.length) ? (
          <div>
            <div className="section-label mb-2">Rule impact</div>
            <div className="space-y-1.5 font-mono text-xs">
              {deviation.ruleImpact.activatesRules?.map((r) => (
                <div key={r} className="flex items-baseline gap-2">
                  <span
                    className="uppercase tracking-wider px-1.5 py-0.5 text-[10px]"
                    style={{
                      background: "rgba(94, 194, 122, 0.1)",
                      color: "var(--trace-rule-fired)",
                      border: "1px solid var(--trace-rule-fired)",
                    }}
                  >
                    activates
                  </span>
                  <span>{r}</span>
                </div>
              ))}
              {deviation.ruleImpact.deactivatesRules?.map((r) => (
                <div key={r} className="flex items-baseline gap-2">
                  <span
                    className="uppercase tracking-wider px-1.5 py-0.5 text-[10px]"
                    style={{
                      background: "rgba(194, 94, 94, 0.1)",
                      color: "var(--trace-rule-failed)",
                      border: "1px solid var(--trace-rule-failed)",
                    }}
                  >
                    deactivates
                  </span>
                  <span>{r}</span>
                </div>
              ))}
              {deviation.ruleImpact.modifiesRules?.map((r) => (
                <div key={r} className="flex items-baseline gap-2">
                  <span
                    className="uppercase tracking-wider px-1.5 py-0.5 text-[10px]"
                    style={{
                      background: "rgba(155, 107, 255, 0.1)",
                      color: "var(--trace-ontology)",
                      border: "1px solid var(--trace-ontology)",
                    }}
                  >
                    modifies
                  </span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {deviation.precedent && (
          <div>
            <div className="section-label mb-2">Precedent</div>
            <p
              className="leading-relaxed italic text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              {deviation.precedent}
            </p>
          </div>
        )}

        {deviation.reviewer && (
          <div className="pt-3 border-t border-subtle text-xs flex justify-between">
            <span style={{ color: "var(--text-tertiary)" }}>
              Reviewer: {deviation.reviewer}
            </span>
            <span style={{ color: "var(--text-tertiary)" }}>
              Change type: {deviation.changeType}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
