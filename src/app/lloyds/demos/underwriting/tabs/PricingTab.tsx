import type { UnderwritingDecision } from "@/lib/underwriting-engine";
import { formatCurrency } from "@/lib/utils";

export function PricingTab({ decision }: { decision: UnderwritingDecision }) {
  const { pricing, scenario } = decision;
  const sub = scenario.submission;
  const technicalPremium = sub.coverage.hullValue * (pricing.technicalRate / 100);

  return (
    <div className="space-y-8">
      <div>
        <div className="section-label mb-4">Rate derivation</div>
        <div
          className="border border-subtle"
          style={{ background: "var(--bg-primary)" }}
        >
          <RateRow
            label="Base rate"
            value={`${pricing.baseRate.toFixed(2)}%`}
            ruleId="MH-PRC-01"
            note="syndicate schedule by vessel type"
            first
          />
          {pricing.modifiers.map((m) => (
            <RateRow
              key={m.id}
              label={m.name}
              value={`${m.value > 0 ? "+" : ""}${(m.value * 100).toFixed(1)}%`}
              ruleId={m.id}
              note={m.reasoning}
              modifier={m.value}
            />
          ))}
          <div
            className="px-4 py-3 border-t flex items-baseline justify-between"
            style={{
              borderColor: "var(--border-strong)",
              background: "var(--bg-elevated)",
            }}
          >
            <span className="section-label">Technical rate</span>
            <span
              className="font-serif text-xl"
              style={{ color: "var(--accent-primary)" }}
            >
              {pricing.technicalRate.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="section-label mb-4">Rate adequacy</div>
        <div className="grid md:grid-cols-3 gap-6">
          <Stat
            label="Technical rate"
            value={`${pricing.technicalRate.toFixed(2)}%`}
            sub="rules-derived"
          />
          <Stat
            label="Portfolio benchmark"
            value={`${(pricing.benchmarkRate * 100).toFixed(2)}%`}
            sub="average across class"
          />
          <Stat
            label="Deviation"
            value={`${pricing.rateDeviation > 0 ? "+" : ""}${(pricing.rateDeviation * 100).toFixed(1)}%`}
            sub={
              pricing.rateAdequate
                ? "within ±15% benchmark"
                : "outside benchmark"
            }
            warn={!pricing.rateAdequate}
          />
        </div>
      </div>

      <div>
        <div className="section-label mb-4">Premium & retention</div>
        <div
          className="border border-subtle p-5"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
            <KV
              label="Hull value"
              value={formatCurrency(sub.coverage.hullValue, sub.coverage.currency)}
            />
            <KV
              label="Technical premium (100% line)"
              value={formatCurrency(technicalPremium, sub.coverage.currency)}
            />
            <KV
              label="Mercator line (proposed)"
              value={`${((sub.context?.requestedLeadLine ?? 0) * 100).toFixed(1)}%`}
            />
            <KV
              label="Mercator premium share"
              value={formatCurrency(
                technicalPremium * (sub.context?.requestedLeadLine ?? 0),
                sub.coverage.currency,
              )}
            />
            <KV
              label="Quota share ceded (25%)"
              value={formatCurrency(
                technicalPremium *
                  (sub.context?.requestedLeadLine ?? 0) *
                  0.25,
                sub.coverage.currency,
              )}
            />
            <KV
              label="Net retained premium"
              value={formatCurrency(
                technicalPremium *
                  (sub.context?.requestedLeadLine ?? 0) *
                  0.75,
                sub.coverage.currency,
              )}
            />
            <KV
              label="Deductible"
              value={formatCurrency(
                sub.coverage.deductible,
                sub.coverage.currency,
              )}
            />
            <KV
              label="Wording"
              value={sub.coverage.preferredWording}
            />
          </div>
        </div>
      </div>

      <div className="text-xs italic" style={{ color: "var(--text-tertiary)" }}>
        Every figure above is computed deterministically from the rule chain.
        Click any rule in the reasoning trace to see its source authority and
        evaluation result.
      </div>
    </div>
  );
}

function RateRow({
  label,
  value,
  ruleId,
  note,
  modifier,
  first,
}: {
  label: string;
  value: string;
  ruleId: string;
  note: string;
  modifier?: number;
  first?: boolean;
}) {
  const color =
    modifier === undefined
      ? "var(--text-primary)"
      : modifier > 0
        ? "#d68744"
        : modifier < 0
          ? "var(--trace-rule-fired)"
          : "var(--text-tertiary)";

  return (
    <div
      className={`px-4 py-3 grid grid-cols-[80px_1fr_auto] items-start gap-4 ${first ? "" : "border-t border-subtle"}`}
    >
      <span
        className="font-mono text-xs pt-0.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        {ruleId}
      </span>
      <div>
        <div className="text-sm">{label}</div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {note}
        </div>
      </div>
      <span className="font-mono text-sm" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div
        className="section-label mb-1"
        style={{ fontSize: "0.65rem" }}
      >
        {label}
      </div>
      <div
        className="font-serif text-2xl font-light"
        style={{ color: warn ? "#d68744" : "var(--text-primary)" }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="text-xs mt-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <div>{value}</div>
    </div>
  );
}
