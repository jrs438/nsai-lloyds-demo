import type { UnderwritingDecision } from "@/lib/underwriting-engine";

const STYLES: Record<
  UnderwritingDecision["conclusion"],
  { label: string; color: string; background: string }
> = {
  bind: {
    label: "BIND",
    color: "var(--trace-rule-fired)",
    background: "rgba(94, 194, 122, 0.1)",
  },
  conditional: {
    label: "CONDITIONAL",
    color: "#d4a542",
    background: "rgba(212, 165, 66, 0.1)",
  },
  refer: {
    label: "REFER",
    color: "var(--trace-ontology)",
    background: "rgba(155, 107, 255, 0.1)",
  },
  decline: {
    label: "DECLINE",
    color: "var(--trace-rule-failed)",
    background: "rgba(194, 94, 94, 0.1)",
  },
};

export function ConclusionBadge({
  conclusion,
  small = false,
}: {
  conclusion: UnderwritingDecision["conclusion"];
  small?: boolean;
}) {
  const s = STYLES[conclusion];
  return (
    <span
      className={`inline-block font-mono uppercase tracking-wider font-medium ${
        small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      style={{
        color: s.color,
        background: s.background,
        border: `1px solid ${s.color}`,
      }}
    >
      {s.label}
    </span>
  );
}
