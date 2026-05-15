import type { UnderwritingScenario } from "@/data/underwriting-submissions/types";
import type { UnderwritingDecision } from "@/lib/underwriting-engine";
import { formatCurrency } from "@/lib/utils";

export function RiskAnalysisTab({
  scenario,
  decision,
}: {
  scenario: UnderwritingScenario;
  decision: UnderwritingDecision;
}) {
  const sub = scenario.submission;

  return (
    <div className="space-y-8">
      <Section title="Insured & risk">
        <Grid>
          <KV label="Insured" value={sub.insured.name} />
          <KV label="Domicile" value={sub.insured.domicile} />
          <KV label="Broker" value={sub.broker.name} />
          <KV label="Submission" value={sub.submissionId} />
          <KV
            label="UBO"
            value={sub.insured.ultimateBeneficialOwners.join("; ")}
            span2
          />
        </Grid>
      </Section>

      <Section title="Vessel">
        <Grid>
          <KV
            label="Vessel"
            value={`${sub.vessel.name} · IMO ${sub.vessel.imoNumber}`}
            span2
          />
          <KV
            label="Type"
            value={`${sub.vessel.type} (${sub.vessel.subClass})`}
          />
          <KV
            label="Age"
            value={`${sub.vessel.vesselAgeYears}y (built ${sub.vessel.yearBuilt})`}
          />
          <KV
            label="Flag · Class"
            value={`${sub.vessel.flagState} · ${sub.vessel.classificationSociety}`}
          />
          <KV
            label="GT / DWT"
            value={`${sub.vessel.grossTonnage.toLocaleString()} / ${sub.vessel.deadweight.toLocaleString()}`}
          />
          <KV
            label="Last survey"
            value={`${sub.vessel.lastSurveyDate} (${sub.vessel.surveyAgeMonths}mo)`}
          />
          <KV label="Manager" value={sub.vessel.technicalManager} />
          <KV
            label="ISM · detentions"
            value={`${sub.vessel.ISMCompliance ? "Yes" : "No"} · ${sub.vessel.detentionHistory} in 5y`}
          />
        </Grid>
      </Section>

      <Section title="Coverage requested">
        <Grid>
          <KV
            label="Hull value"
            value={formatCurrency(sub.coverage.hullValue, sub.coverage.currency)}
          />
          <KV
            label="Increased value"
            value={formatCurrency(
              sub.coverage.increasedValue,
              sub.coverage.currency,
            )}
          />
          <KV
            label="Deductible"
            value={formatCurrency(sub.coverage.deductible, sub.coverage.currency)}
          />
          <KV
            label="Period"
            value={`${sub.coverage.inceptionDate} → ${sub.coverage.expiryDate}`}
          />
          <KV
            label="Wording"
            value={sub.coverage.preferredWording}
          />
          <KV
            label="Requested lead"
            value={`${((sub.context?.requestedLeadLine ?? 0) * 100).toFixed(1)}%`}
          />
        </Grid>
      </Section>

      <Section title="Trading & loss record">
        <p
          className="text-sm leading-relaxed mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          {sub.tradingArea.description}
        </p>
        <div className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
          Routes: {sub.tradingArea.primaryRoutes.join("; ")}
        </div>
        <div className="section-label mb-2">Loss history (5y)</div>
        {sub.lossHistory.length === 0 ? (
          <p
            className="text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            Clean record.
          </p>
        ) : (
          <div className="space-y-2">
            {sub.lossHistory.map((l, i) => (
              <div
                key={i}
                className="pl-3 border-l border-subtle text-sm"
              >
                <div className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {l.date}
                </div>
                <div>{l.type}</div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {formatCurrency(l.paidAmount, sub.coverage.currency)} ·{" "}
                  {l.status}
                </div>
                <div
                  className="mt-1 italic text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {l.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {decision.conclusionReasoning.length > 0 && (
        <Section title="Headline reasoning">
          <ul className="space-y-2 text-sm">
            {decision.conclusionReasoning.map((r, i) => (
              <li
                key={i}
                className="flex gap-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <span style={{ color: "var(--accent-primary)" }}>→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
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
      <div className="section-label mb-3">{title}</div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">{children}</div>;
}

function KV({
  label,
  value,
  span2,
}: {
  label: string;
  value: string;
  span2?: boolean;
}) {
  return (
    <div className={`text-sm ${span2 ? "md:col-span-2" : ""}`}>
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>{" "}
      <span>{value}</span>
    </div>
  );
}
