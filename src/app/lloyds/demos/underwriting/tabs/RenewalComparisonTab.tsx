import type { RenewalComparison } from "@/lib/underwriting-engine";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function RenewalComparisonTab({
  comparison,
}: {
  comparison: RenewalComparison;
}) {
  const movementColor =
    comparison.rateMovement > 0
      ? "#d68744"
      : comparison.rateMovement < 0
        ? "var(--trace-rule-fired)"
        : "var(--text-primary)";

  return (
    <div className="space-y-8">
      <div>
        <div className="section-label mb-4">Year-over-year comparison</div>
        <div
          className="border border-subtle"
          style={{ background: "var(--bg-primary)" }}
        >
          <ComparisonRow
            label="Rate"
            prior={`${(comparison.priorRate * 100).toFixed(2)}%`}
            proposed={`${comparison.proposedRate.toFixed(2)}%`}
            movement={`${comparison.rateMovement > 0 ? "+" : ""}${(comparison.rateMovement * 100).toFixed(1)}%`}
            movementColor={movementColor}
            first
          />
          <ComparisonRow
            label="Premium (100% line)"
            prior={formatCurrency(comparison.priorPremium, "USD")}
            proposed={formatCurrency(comparison.proposedPremium, "USD")}
            movement={`${comparison.proposedPremium >= comparison.priorPremium ? "+" : ""}${formatCurrency(comparison.proposedPremium - comparison.priorPremium, "USD")}`}
            movementColor={movementColor}
          />
          <ComparisonRow
            label="Loss ratio (expiring)"
            prior={`${(comparison.priorLossRatio * 100).toFixed(1)}%`}
            proposed="—"
            movement={
              comparison.priorLossRatio > 0.80
                ? "above 80% tolerance"
                : comparison.priorLossRatio > 0.60
                  ? "elevated"
                  : "acceptable"
            }
            movementColor={
              comparison.priorLossRatio > 0.80
                ? "var(--trace-rule-failed)"
                : comparison.priorLossRatio > 0.60
                  ? "#d68744"
                  : "var(--trace-rule-fired)"
            }
          />
        </div>
      </div>

      {comparison.materialChanges.length > 0 && (
        <div>
          <div
            className="section-label mb-4 flex items-center gap-2"
            style={{ color: "#d68744" }}
          >
            <AlertTriangle className="w-4 h-4" /> Material changes disclosed
          </div>
          <div
            className="border p-4"
            style={{
              borderColor: "#d68744",
              background: "rgba(214, 135, 68, 0.05)",
            }}
          >
            <ul className="space-y-2 text-sm">
              {comparison.materialChanges.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "#d68744" }}>!</span>
                  <span style={{ color: "var(--text-secondary)" }}>{c}</span>
                </li>
              ))}
            </ul>
            <div
              className="text-xs mt-3 pt-3 border-t"
              style={{
                borderColor: "rgba(214, 135, 68, 0.3)",
                color: "var(--text-tertiary)",
              }}
            >
              MH-REN-02 fired · Insurance Act 2015 Duty of Fair Presentation
              requires explicit review and pricing reflection of these changes.
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="section-label mb-4">Recommendation</div>
        <ul className="space-y-2 text-sm">
          <Recommendation>
            {comparison.rateMovement > 0.10
              ? `Apply rate increase of ${(comparison.rateMovement * 100).toFixed(1)}% to reflect loss experience and material changes`
              : comparison.rateMovement > 0
                ? `Modest rate increase of ${(comparison.rateMovement * 100).toFixed(1)}% appropriate`
                : "Rate movement within normal range"}
          </Recommendation>
          {comparison.priorLossRatio > 0.70 && (
            <Recommendation>
              Review claims handling and loss prevention measures with insured
              given {(comparison.priorLossRatio * 100).toFixed(0)}% prior loss
              ratio
            </Recommendation>
          )}
          {comparison.materialChanges.length > 0 && (
            <Recommendation>
              Issue specific renewal endorsement covering disclosed material
              changes; document underwriter assessment in file
            </Recommendation>
          )}
        </ul>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  prior,
  proposed,
  movement,
  movementColor,
  first,
}: {
  label: string;
  prior: string;
  proposed: string;
  movement: string;
  movementColor: string;
  first?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-4 gap-4 px-4 py-3 items-baseline ${first ? "" : "border-t border-subtle"}`}
    >
      <div
        className="font-mono text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </div>
      <div className="font-mono text-sm">{prior}</div>
      <div className="font-mono text-sm">{proposed}</div>
      <div
        className="font-mono text-xs text-right"
        style={{ color: movementColor }}
      >
        {movement}
      </div>
    </div>
  );
}

function Recommendation({ children }: { children: React.ReactNode }) {
  return (
    <li
      className="flex gap-2"
      style={{ color: "var(--text-secondary)" }}
    >
      <span style={{ color: "var(--accent-primary)" }}>→</span>
      <span>{children}</span>
    </li>
  );
}
