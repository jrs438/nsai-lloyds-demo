import type { MarineHullSubmission } from "@/ontology/classes/marine";
import { formatCurrency } from "@/lib/utils";

export function SubmissionViewer({
  submission,
}: {
  submission: MarineHullSubmission;
}) {
  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="section-label">Submission</div>
        <div
          className="font-mono text-xs mt-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {submission.submissionId} · Lloyd&apos;s slip
        </div>
      </header>

      <div className="p-5 space-y-6 text-sm">
        <Section title="Insured">
          <KV label="Name" value={submission.insured.name} />
          <KV label="Domicile" value={submission.insured.domicile} />
          <KV
            label="UBO"
            value={submission.insured.ultimateBeneficialOwners.join("; ")}
          />
        </Section>

        <Section title="Broker">
          <KV label="Firm" value={submission.broker.name} />
          <KV
            label="Lloyd's accredited"
            value={submission.broker.lloydsAccredited ? "Yes" : "No"}
          />
          <KV label="Contact" value={submission.broker.contactRole} />
        </Section>

        <Section title="Vessel">
          <KV label="Name" value={submission.vessel.name} />
          <KV label="IMO" value={submission.vessel.imoNumber} />
          <KV
            label="Type"
            value={`${submission.vessel.type} (${submission.vessel.subClass})`}
          />
          <KV
            label="Built"
            value={`${submission.vessel.yearBuilt} (${submission.vessel.vesselAgeYears}y old)`}
          />
          <KV label="Flag" value={submission.vessel.flagState} />
          <KV
            label="GT / DWT"
            value={`${submission.vessel.grossTonnage.toLocaleString()} / ${submission.vessel.deadweight.toLocaleString()}`}
          />
          <KV
            label="Length / material"
            value={`${submission.vessel.length}m · ${submission.vessel.hullMaterial}`}
          />
          <KV
            label="Class"
            value={`${submission.vessel.classificationSociety} (${submission.vessel.classStatus})`}
          />
          <KV
            label="Last survey"
            value={`${submission.vessel.lastSurveyDate} (${submission.vessel.surveyAgeMonths}mo)`}
          />
          <KV label="Manager" value={submission.vessel.technicalManager} />
          <KV
            label="ISM / detentions"
            value={`${submission.vessel.ISMCompliance ? "Yes" : "No"} · ${submission.vessel.detentionHistory} in 5y`}
          />
        </Section>

        <Section title="Coverage">
          <KV
            label="Hull value"
            value={formatCurrency(
              submission.coverage.hullValue,
              submission.coverage.currency,
            )}
          />
          <KV
            label="Increased value"
            value={formatCurrency(
              submission.coverage.increasedValue,
              submission.coverage.currency,
            )}
          />
          <KV
            label="Deductible"
            value={formatCurrency(
              submission.coverage.deductible,
              submission.coverage.currency,
            )}
          />
          <KV
            label="Interest"
            value={submission.coverage.interest.join(", ")}
          />
          <KV
            label="Period"
            value={`${submission.coverage.inceptionDate} → ${submission.coverage.expiryDate}`}
          />
          <KV
            label="Wording"
            value={submission.coverage.preferredWording}
          />
        </Section>

        <Section title="Trading">
          <p
            className="text-sm leading-relaxed mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {submission.tradingArea.description}
          </p>
          <div
            className="text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            Routes:{" "}
            {submission.tradingArea.primaryRoutes.join("; ")}
          </div>
        </Section>

        <Section title="Loss history (5y)">
          {submission.lossHistory.length === 0 ? (
            <p style={{ color: "var(--text-tertiary)" }}>Clean record.</p>
          ) : (
            <div className="space-y-2">
              {submission.lossHistory.map((l, i) => (
                <div
                  key={i}
                  className="pl-3 border-l border-subtle text-xs"
                >
                  <div className="font-mono">{l.date}</div>
                  <div>{l.type}</div>
                  <div style={{ color: "var(--text-tertiary)" }}>
                    {formatCurrency(
                      l.paidAmount,
                      submission.coverage.currency,
                    )}{" "}
                    · {l.status}
                  </div>
                  <div
                    className="mt-1 italic"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {l.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {submission.context && (
          <Section title="Broker request">
            <KV
              label="Requested lead line"
              value={`${(submission.context.requestedLeadLine * 100).toFixed(1)}%`}
            />
            <KV
              label="Total placement"
              value={`${(submission.context.requestedTotalPlacement * 100).toFixed(0)}%`}
            />
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
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline gap-3 text-sm">
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-tertiary)", minWidth: "120px" }}
      >
        {label}
      </span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
