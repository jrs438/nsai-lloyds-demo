import { AlertTriangle, Check } from "lucide-react";
import type { LlmComparison } from "@/data/llm-comparisons";
import type { PlacementRecommendation } from "@/lib/placement-engine";

export function LlmComparisonPanel({
  comparison,
  nsaiPlacement,
}: {
  comparison: LlmComparison;
  nsaiPlacement: PlacementRecommendation;
}) {
  return (
    <div className="p-5 space-y-6">
      <div>
        <div
          className="section-label mb-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Pure LLM (GPT-4 class)
        </div>
        <div
          className="text-xs font-mono mb-4"
          style={{ color: "var(--text-tertiary)" }}
        >
          Same submission, 3 sequential runs
        </div>

        <div className="space-y-4">
          {comparison.runs.map((run) => (
            <div key={run.runId} className="border-l-2 border-default pl-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {run.runId}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  · {run.timestamp}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: "var(--text-secondary)" }}
              >
                &quot;{run.output}&quot;
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-6 p-3 border"
          style={{ borderColor: "#d68744", background: "rgba(214, 135, 68, 0.05)" }}
        >
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "#d68744" }}
            />
            <div
              className="section-label"
              style={{ color: "#d68744", fontSize: "0.7rem" }}
            >
              Observations
            </div>
          </div>
          <ul className="space-y-1 text-sm pl-6">
            {comparison.observations.map((o, i) => (
              <li
                key={i}
                style={{ color: "var(--text-secondary)" }}
                className="text-xs leading-relaxed"
              >
                · {o}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-subtle pt-6">
        <div
          className="section-label mb-1"
          style={{ color: "var(--trace-deterministic)" }}
        >
          NSAI · Same submission
        </div>
        <div
          className="text-xs font-mono mb-4"
          style={{ color: "var(--text-tertiary)" }}
        >
          3 runs produced identical output
        </div>

        <div
          className="p-4 border"
          style={{ borderColor: "var(--trace-deterministic)" }}
        >
          <div className="flex items-start gap-2 mb-3">
            <Check
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "var(--trace-deterministic)" }}
            />
            <div className="text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                Eligible leads:{" "}
              </span>
              {nsaiPlacement.recommendedLeads.length > 0
                ? nsaiPlacement.recommendedLeads
                    .map((e) => e.syndicate.name.replace(/Syndicate /, ""))
                    .join(", ")
                : "None — conditional path defined"}
            </div>
          </div>
          {nsaiPlacement.conditionalLeads.length > 0 && (
            <div className="flex items-start gap-2 mb-3 ml-6">
              <span style={{ color: "var(--accent-primary)" }}>→</span>
              <div className="text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  Conditional:{" "}
                </span>
                {nsaiPlacement.conditionalLeads
                  .map((e) => e.syndicate.name.replace(/Syndicate /, ""))
                  .join(", ")}
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 ml-6">
            <span style={{ color: "var(--accent-primary)" }}>→</span>
            <div className="text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Rate range: </span>
              {nsaiPlacement.indicativeRate.min.toFixed(2)}% –{" "}
              {nsaiPlacement.indicativeRate.max.toFixed(2)}%
            </div>
          </div>
        </div>

        <p
          className="text-xs mt-4 italic"
          style={{ color: "var(--text-tertiary)" }}
        >
          The NSAI output above is computed by the rule evaluator running over
          the extracted facts. Every conclusion ties back to specific rules
          fired or failed — click any rule in the trace view for the full
          derivation.
        </p>
      </div>
    </div>
  );
}
