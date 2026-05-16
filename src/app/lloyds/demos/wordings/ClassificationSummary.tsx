import type {
  WordingDeviation,
  DeviationClassification,
} from "@/data/wordings/deviations";

const STYLES: Record<
  DeviationClassification,
  { label: string; color: string }
> = {
  broadening: { label: "Broadening", color: "var(--accent-secondary)" },
  narrowing: { label: "Narrowing", color: "#d68744" },
  ambiguous: { label: "Ambiguous", color: "var(--trace-ontology)" },
  neutral: { label: "Neutral", color: "var(--text-tertiary)" },
};

export function ClassificationSummary({
  deviations,
  activeId,
  onSelect,
}: {
  deviations: WordingDeviation[];
  activeId: string;
  onSelect: (d: WordingDeviation) => void;
}) {
  const counts: Record<DeviationClassification, number> = {
    broadening: 0,
    narrowing: 0,
    ambiguous: 0,
    neutral: 0,
  };
  for (const d of deviations) counts[d.classification]++;

  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle flex items-baseline justify-between"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div>
          <div className="section-label">Classification summary</div>
          <div
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-tertiary)" }}
          >
            {deviations.length} deviations identified · click any to inspect
          </div>
        </div>
        <div className="flex items-baseline gap-6">
          {(Object.keys(counts) as DeviationClassification[]).map((c) => (
            <div key={c} className="text-right">
              <div
                className="font-serif text-xl"
                style={{ color: STYLES[c].color }}
              >
                {counts[c]}
              </div>
              <div
                className="section-label"
                style={{ fontSize: "0.6rem", color: STYLES[c].color }}
              >
                {STYLES[c].label}
              </div>
            </div>
          ))}
        </div>
      </header>
      <div
        className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2"
        style={{ background: "var(--bg-primary)" }}
      >
        {deviations.map((d) => {
          const style = STYLES[d.classification];
          const isActive = d.id === activeId;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d)}
              className="text-left px-3 py-2 border transition-colors"
              style={{
                borderColor: isActive
                  ? style.color
                  : "var(--border-subtle)",
                background: isActive
                  ? "var(--bg-elevated)"
                  : "transparent",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {d.id}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: style.color }}
                >
                  {style.label}
                </span>
              </div>
              <div
                className="text-xs"
                style={{
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {d.clauseReference}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
