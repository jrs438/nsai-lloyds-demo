import type { ClaimsEvaluationOutput } from "@/lib/claims-engine";
import { TrendingUp } from "lucide-react";

export function UnderwritingFeedbackPanel({
  evaluation,
}: {
  evaluation: ClaimsEvaluationOutput;
}) {
  return (
    <div className="max-w-4xl">
      <div className="card p-6 mb-6">
        <div
          className="section-label mb-3 flex items-center gap-2"
          style={{ color: "var(--accent-secondary)" }}
        >
          <TrendingUp className="w-4 h-4" /> Loop back to underwriting
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The claim adjudication output isn&apos;t the end of the value chain.
          Patterns surfaced here belong on the underwriting team&apos;s desk —
          what behaviors of insureds, what classes, what wordings produce
          losses; what conditions could have prevented them; whether the
          pricing or risk appetite needs to move. Below is the rule-derived
          feedback for this claim, ready to attach to the class file.
        </p>
      </div>

      {evaluation.underwritingFeedback.length === 0 ? (
        <div
          className="card p-10 text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          No class-level feedback generated for this claim.
        </div>
      ) : (
        <div className="space-y-4">
          {evaluation.underwritingFeedback.map((entry, i) => (
            <div key={i} className="card p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div
                    className="section-label mb-2"
                    style={{ fontSize: "0.65rem" }}
                  >
                    Observation
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {entry.observation}
                  </p>
                </div>
                <div>
                  <div
                    className="section-label mb-2"
                    style={{ fontSize: "0.65rem" }}
                  >
                    Class impact
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {entry.classImpact}
                  </p>
                </div>
                <div>
                  <div
                    className="section-label mb-2"
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--accent-primary)",
                    }}
                  >
                    Recommended action
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {entry.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
