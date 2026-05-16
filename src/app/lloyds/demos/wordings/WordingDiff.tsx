import type { WordingDeviation } from "@/data/wordings/deviations";

export function WordingDiff({
  standardText,
  manuscriptText,
  deviations,
  activeId,
  onSelect,
}: {
  standardText: string;
  manuscriptText: string;
  deviations: WordingDeviation[];
  activeId: string;
  onSelect: (d: WordingDeviation) => void;
}) {
  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="section-label">Side-by-side diff</div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--border-subtle)]">
        <PanelSide
          title="Standard LMA5395"
          subtitle="reference wording · 1/11/2002"
          text={standardText}
          deviations={deviations}
          activeId={activeId}
          onSelect={onSelect}
          side="standard"
        />
        <PanelSide
          title="Manuscripted variant"
          subtitle="Pacific Maritime fleet · 1/6/2026"
          text={manuscriptText}
          deviations={deviations}
          activeId={activeId}
          onSelect={onSelect}
          side="manuscript"
        />
      </div>
    </div>
  );
}

function PanelSide({
  title,
  subtitle,
  text,
  deviations,
  activeId,
  onSelect,
  side,
}: {
  title: string;
  subtitle: string;
  text: string;
  deviations: WordingDeviation[];
  activeId: string;
  onSelect: (d: WordingDeviation) => void;
  side: "standard" | "manuscript";
}) {
  // Build highlighted text by finding matching deviation snippets
  const highlighted = highlightDeviations(text, deviations, side, activeId, onSelect);

  return (
    <div
      className="bg-[var(--bg-primary)] p-5"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mb-3">
        <div className="section-label">{title}</div>
        <div
          className="font-mono text-xs mt-0.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {subtitle}
        </div>
      </div>
      <div
        className="font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        {highlighted}
      </div>
    </div>
  );
}

function highlightDeviations(
  text: string,
  deviations: WordingDeviation[],
  side: "standard" | "manuscript",
  activeId: string,
  onSelect: (d: WordingDeviation) => void,
): React.ReactNode {
  // For each deviation, find its snippet in this text and wrap with a span.
  // We process from longest snippet to shortest to avoid partial overlaps.
  const snippets = deviations
    .map((d) => ({
      d,
      snippet:
        side === "standard"
          ? d.standardText
          : d.manuscriptText,
    }))
    .filter(
      (s) =>
        s.snippet &&
        !s.snippet.startsWith("(not present") &&
        !s.snippet.startsWith("(due diligence"),
    )
    .sort((a, b) => b.snippet.length - a.snippet.length);

  const segments: Array<
    | { kind: "text"; value: string }
    | { kind: "deviation"; value: string; d: WordingDeviation }
  > = [{ kind: "text", value: text }];

  for (const { d, snippet } of snippets) {
    const next: typeof segments = [];
    for (const seg of segments) {
      if (seg.kind === "text") {
        const parts = splitOnce(seg.value, snippet);
        if (parts) {
          if (parts.before) next.push({ kind: "text", value: parts.before });
          next.push({ kind: "deviation", value: snippet, d });
          if (parts.after) next.push({ kind: "text", value: parts.after });
        } else {
          next.push(seg);
        }
      } else {
        next.push(seg);
      }
    }
    segments.length = 0;
    segments.push(...next);
  }

  return segments.map((s, i) => {
    if (s.kind === "text") return <span key={i}>{s.value}</span>;
    const isActive = s.d.id === activeId;
    const color = classificationColor(s.d.classification);
    return (
      <button
        key={i}
        onClick={() => onSelect(s.d)}
        className="cursor-pointer"
        style={{
          background: isActive ? `${color}33` : `${color}11`,
          color: "var(--text-primary)",
          border: `1px solid ${isActive ? color : "transparent"}`,
          padding: "0 2px",
          textAlign: "left",
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
        }}
        title={`${s.d.id} · ${s.d.classification}`}
      >
        {s.value}
      </button>
    );
  });
}

function splitOnce(
  haystack: string,
  needle: string,
): { before: string; after: string } | null {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return null;
  return {
    before: haystack.slice(0, idx),
    after: haystack.slice(idx + needle.length),
  };
}

function classificationColor(c: WordingDeviation["classification"]): string {
  switch (c) {
    case "broadening":
      return "#4a9eff";
    case "narrowing":
      return "#d68744";
    case "ambiguous":
      return "#9b6bff";
    case "neutral":
      return "#6a6a6a";
  }
}
