import type { PortfolioImpact } from "@/lib/underwriting-engine";
import type { SyndicatePortfolio } from "@/data/portfolio/types";
import { formatCurrency } from "@/lib/utils";

export function PortfolioImpactTab({
  impact,
  portfolio,
}: {
  impact: PortfolioImpact;
  portfolio: SyndicatePortfolio;
}) {
  return (
    <div className="space-y-8">
      <Section title="Zone aggregate impact">
        <div className="space-y-3">
          {portfolio.zoneAggregates
            .slice()
            .sort((a, b) => b.utilization - a.utilization)
            .map((zone) => {
              const isTarget = zone.zone === impact.zoneAfter.zone;
              const postBindUtil = isTarget
                ? impact.zoneAfter.utilization
                : zone.utilization;
              return (
                <ZoneBar
                  key={zone.zone}
                  zone={zone.zone}
                  current={zone.utilization}
                  postBind={postBindUtil}
                  isTarget={isTarget}
                  postBindSI={
                    isTarget ? impact.zoneAfter.sumInsured : zone.sumInsured
                  }
                  limit={zone.limit}
                />
              );
            })}
        </div>
      </Section>

      <Section title="Stamp capacity">
        <div className="grid md:grid-cols-3 gap-6">
          <Stat
            label="Current premium income"
            value={`${(impact.capacityBefore * 100).toFixed(1)}%`}
            sub={`of ${formatCurrency(portfolio.stampCapacity, "GBP")} stamp`}
          />
          <Stat
            label="Post-bind"
            value={`${(impact.capacityAfter * 100).toFixed(1)}%`}
            sub={`+${((impact.capacityAfter - impact.capacityBefore) * 100).toFixed(2)} pp`}
            highlight
          />
          <Stat
            label="Stamp headroom"
            value={`${((0.95 - impact.capacityAfter) * 100).toFixed(1)} pp`}
            sub="to 95% cap"
            warn={0.95 - impact.capacityAfter < 0.05}
          />
        </div>
      </Section>

      <Section title="Treaty exposure">
        <div className="grid md:grid-cols-3 gap-6">
          <Stat
            label="Net retained line"
            value={formatCurrency(impact.treatyExposure.netRetainedLine, "USD")}
            sub="after 25% QS cession"
          />
          <Stat
            label="First XL attachment"
            value={formatCurrency(impact.treatyExposure.firstAttachment, "USD")}
            sub="Lloyd's panel"
          />
          <Stat
            label="Proximity to attachment"
            value={`${(impact.treatyExposure.proximityPct * 100).toFixed(1)}%`}
            sub={
              impact.treatyExposure.proximityPct < 0.4
                ? "Comfortable margin"
                : "Material retention exposure"
            }
            warn={impact.treatyExposure.proximityPct >= 0.4}
          />
        </div>
      </Section>

      <Section title="Class concentration">
        <div className="space-y-2">
          {portfolio.classAggregates.map((c) => {
            const total = portfolio.bookSummary.totalSumInsured;
            const sharePct = (c.sumInsured / total) * 100;
            return (
              <div
                key={c.class}
                className="grid grid-cols-[1fr_auto] gap-4 text-sm"
              >
                <div>
                  <div className="font-mono">{c.class}</div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {c.riskCount} risks · avg rate{" "}
                    {(c.averageRate * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">
                    {formatCurrency(c.sumInsured, "USD")}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {sharePct.toFixed(1)}% of book
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
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
      <div className="section-label mb-4">{title}</div>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
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
        style={{
          color: warn
            ? "#d68744"
            : highlight
              ? "var(--accent-primary)"
              : "var(--text-primary)",
        }}
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

function ZoneBar({
  zone,
  current,
  postBind,
  isTarget,
  postBindSI,
  limit,
}: {
  zone: string;
  current: number;
  postBind: number;
  isTarget: boolean;
  postBindSI: number;
  limit: number;
}) {
  const currentPct = Math.min(current * 100, 100);
  const postBindPct = Math.min(postBind * 100, 100);
  const overThreshold = postBind > 0.90;

  return (
    <div
      className="border border-subtle p-3"
      style={{
        background: isTarget ? "var(--bg-elevated)" : "var(--bg-primary)",
      }}
    >
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm">{zone}</span>
          {isTarget && (
            <span
              className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5"
              style={{
                color: "var(--accent-primary)",
                border: "1px solid var(--accent-primary)",
              }}
            >
              this risk
            </span>
          )}
        </div>
        <div
          className="font-mono text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          {formatCurrency(postBindSI, "USD")} / {formatCurrency(limit, "USD")}
        </div>
      </div>
      <div
        className="relative h-2 rounded-sm overflow-hidden"
        style={{ background: "var(--border-subtle)" }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${currentPct}%`,
            background: "var(--text-tertiary)",
            opacity: 0.5,
          }}
        />
        {isTarget && postBindPct > currentPct && (
          <div
            className="absolute inset-y-0"
            style={{
              left: `${currentPct}%`,
              width: `${postBindPct - currentPct}%`,
              background: overThreshold
                ? "var(--trace-rule-failed)"
                : "var(--accent-primary)",
            }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5">
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          {(current * 100).toFixed(1)}% current
        </span>
        <span
          className="text-xs font-mono"
          style={{
            color: overThreshold
              ? "var(--trace-rule-failed)"
              : isTarget
                ? "var(--accent-primary)"
                : "var(--text-tertiary)",
          }}
        >
          {(postBind * 100).toFixed(1)}% post-bind
          {isTarget && postBind > current && (
            <> (+{((postBind - current) * 100).toFixed(2)} pp)</>
          )}
        </span>
      </div>
    </div>
  );
}
