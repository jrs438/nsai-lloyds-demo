import type { ClaimsEvaluationOutput } from "@/lib/claims-engine";
import { formatCurrency } from "@/lib/utils";
import { Check, AlertTriangle, XCircle } from "lucide-react";

const POSITION_STYLES = {
  covered: { label: "COVERED", color: "var(--trace-rule-fired)", icon: Check },
  "covered-with-sublimit": {
    label: "COVERED — SUB-LIMIT",
    color: "#d4a542",
    icon: AlertTriangle,
  },
  "partially-covered": {
    label: "PARTIAL",
    color: "#d4a542",
    icon: AlertTriangle,
  },
  denied: { label: "DENIED", color: "var(--trace-rule-failed)", icon: XCircle },
  investigating: {
    label: "INVESTIGATING",
    color: "var(--text-tertiary)",
    icon: AlertTriangle,
  },
} as const;

export function ClaimDecisionPanel({
  evaluation,
}: {
  evaluation: ClaimsEvaluationOutput;
}) {
  const d = evaluation.decision;
  const style = POSITION_STYLES[d.coveragePosition];
  const Icon = style.icon;
  const claim = evaluation.claim;

  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="section-label">Coverage decision</div>
        <div
          className="font-mono text-xs mt-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {evaluation.totalRulesEvaluated} rules evaluated ·{" "}
          {evaluation.rulesFired} fired · {evaluation.rulesFailed} failed
        </div>
      </header>

      <div className="p-5 space-y-6">
        <div
          className="p-4 border"
          style={{ borderColor: style.color, background: `${style.color}11` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4" style={{ color: style.color }} />
            <span
              className="font-mono text-xs uppercase tracking-wider font-medium"
              style={{ color: style.color }}
            >
              {style.label}
            </span>
          </div>
          <div className="font-serif text-2xl font-light">
            {formatCurrency(d.netPolicyResponse, claim.alleged.currency)}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            net policy response · alleged quantum{" "}
            {formatCurrency(claim.alleged.quantum, claim.alleged.currency)}
          </div>
        </div>

        <Section title="Recommended initial reserve">
          <div className="font-serif text-xl">
            {formatCurrency(
              d.recommendedInitialReserve,
              claim.alleged.currency,
            )}
          </div>
        </Section>

        <Section title="Settlement strategy">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {d.settlementStrategy}
          </p>
        </Section>

        {d.subrogationPath && (
          <Section title="Subrogation">
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {d.subrogationPath}
            </p>
          </Section>
        )}

        {d.defenceCounsel && d.defenceCounsel.length > 0 && (
          <Section title="Defence counsel">
            <div className="space-y-2">
              {d.defenceCounsel.map((c, i) => (
                <div
                  key={i}
                  className="border border-subtle p-3"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <div className="font-serif text-sm">{c.firm}</div>
                  <div
                    className="text-xs font-mono mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {c.location} · {c.rateGuide}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {c.relevantExperience}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {d.venueAnalysis && (
          <Section title="Venue analytics">
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <div>
                <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Jurisdiction:
                </span>{" "}
                {d.venueAnalysis.jurisdiction}
              </div>
              <div className="mt-1">
                <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Settle:trial ratio:
                </span>{" "}
                {d.venueAnalysis.settlementToTrialRatio}
              </div>
              <div className="mt-1">
                <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Avg settlement:
                </span>{" "}
                {d.venueAnalysis.averageSettlementMonths} months
              </div>
            </div>
            {d.venueAnalysis.notableCases.length > 0 && (
              <div className="mt-3">
                <div
                  className="section-label mb-2"
                  style={{ fontSize: "0.65rem" }}
                >
                  Notable comparables
                </div>
                <ul className="space-y-1 text-xs">
                  {d.venueAnalysis.notableCases.map((c, i) => (
                    <li
                      key={i}
                      className="italic"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      · {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {evaluation.manuscripts.length > 0 && (
          <Section title="Manuscript endorsements applied">
            <div className="space-y-2">
              {evaluation.manuscripts.map((m) => (
                <div
                  key={m.id}
                  className="border border-subtle p-3"
                  style={{
                    background: "rgba(155, 107, 255, 0.05)",
                    borderColor: "var(--trace-ontology)",
                  }}
                >
                  <div
                    className="font-mono text-xs mb-1"
                    style={{ color: "var(--trace-ontology)" }}
                  >
                    {m.id}
                  </div>
                  <div className="text-sm">{m.title}</div>
                  <div
                    className="text-xs mt-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {m.modifications.map((mod, i) => (
                      <div key={i}>
                        <span className="font-mono">{mod.type}</span> ·{" "}
                        <span className="font-mono">{mod.ruleId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="section-label mb-2">{title}</div>
      {children}
    </div>
  );
}
