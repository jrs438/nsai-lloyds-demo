import type { PlacementRecommendation, SyndicateEvaluation } from "@/lib/placement-engine";
import { AlertTriangle, Check, CircleAlert, FileText } from "lucide-react";

export function PlacementRecommendationPanel({
  placement,
  onBuildSlip,
}: {
  placement: PlacementRecommendation;
  onBuildSlip?: () => void;
}) {
  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="section-label">Placement recommendation</div>
        <div
          className="font-mono text-xs mt-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {placement.totalRulesEvaluated} rules ×{" "}
          {placement.syndicateEvaluations.length} syndicates evaluated
        </div>
      </header>

      <div className="p-5 space-y-6">
        {placement.recommendedLeads.length > 0 && (
          <SyndicateList
            title="Recommended leads"
            evaluations={placement.recommendedLeads}
            kind="lead"
          />
        )}

        {placement.conditionalLeads.length > 0 && (
          <SyndicateList
            title="Conditional leads"
            evaluations={placement.conditionalLeads}
            kind="conditional"
          />
        )}

        {placement.recommendedFollowers.length > 0 && (
          <SyndicateList
            title="Recommended followers"
            evaluations={placement.recommendedFollowers}
            kind="follower"
          />
        )}

        {placement.declinedLeads.length > 0 && (
          <SyndicateList
            title="Out of appetite"
            evaluations={placement.declinedLeads}
            kind="declined"
          />
        )}

        <div className="pt-4 border-t border-subtle">
          <div className="section-label mb-3">Indicative rate</div>
          <div className="text-2xl font-serif font-light">
            {placement.indicativeRate.min === 0 &&
            placement.indicativeRate.max === 0
              ? "—"
              : `${placement.indicativeRate.min.toFixed(2)}% – ${placement.indicativeRate.max.toFixed(2)}%`}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            of hull value · derived from rule-based pricing across eligible
            syndicates
          </div>
          {onBuildSlip && (
            <button
              onClick={onBuildSlip}
              className="btn-primary text-sm mt-4 w-full justify-center"
            >
              <FileText className="w-4 h-4" /> Build slip →
            </button>
          )}
        </div>

        {placement.flaggedIssues.length > 0 && (
          <div className="pt-4 border-t border-subtle">
            <div className="section-label mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#d68744" }} />
              Flagged issues
            </div>
            <ul className="space-y-1.5">
              {placement.flaggedIssues.map((issue, i) => (
                <li
                  key={i}
                  className="text-xs font-mono"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {placement.recommendedActions.length > 0 && (
          <div className="pt-4 border-t border-subtle">
            <div className="section-label mb-3">Recommended actions</div>
            <ul className="space-y-2">
              {placement.recommendedActions.map((a, i) => (
                <li
                  key={i}
                  className="text-sm flex gap-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--accent-primary)" }}>→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function SyndicateList({
  title,
  evaluations,
  kind,
}: {
  title: string;
  evaluations: SyndicateEvaluation[];
  kind: "lead" | "conditional" | "follower" | "declined";
}) {
  const color =
    kind === "lead"
      ? "var(--trace-rule-fired)"
      : kind === "conditional"
        ? "#d4a542"
        : kind === "follower"
          ? "var(--accent-secondary)"
          : "var(--text-tertiary)";

  const Icon =
    kind === "lead" ? Check : kind === "conditional" ? CircleAlert : null;

  return (
    <div>
      <div
        className="section-label mb-3 flex items-center gap-2"
        style={{ color: color as string }}
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {title} · {evaluations.length}
      </div>
      <div className="space-y-2">
        {evaluations.map((ev) => (
          <div
            key={ev.syndicate.id}
            className="p-3 border border-subtle"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-serif text-base">{ev.syndicate.name}</div>
                <div
                  className="font-mono text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {ev.syndicate.id} · {ev.syndicate.managingAgent}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="font-mono text-xs"
                  style={{ color: color as string }}
                >
                  {(ev.matchScore * 100).toFixed(0)}% match
                </div>
                {kind !== "declined" && (
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {kind === "follower"
                      ? `${(ev.recommendedFollowLine * 100).toFixed(1)}% follow`
                      : `up to ${(ev.recommendedLeadLine * 100).toFixed(1)}% lead`}
                  </div>
                )}
              </div>
            </div>
            <div
              className="mt-2 text-xs font-mono"
              style={{ color: "var(--text-tertiary)" }}
            >
              Rate {ev.pricing.finalRate.toFixed(2)}% · {ev.output.rulesFired}/
              {ev.output.rulesApplicable} rules satisfied
            </div>
            {ev.status !== "eligible" && (
              <div
                className="mt-2 text-xs"
                style={{ color: color as string }}
              >
                {ev.output.derivation.reasoning.slice(0, 2).join(" · ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
