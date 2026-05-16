import type { AnyClaim } from "@/ontology/classes/claim";
import { formatCurrency } from "@/lib/utils";
import { FileText, AlertCircle } from "lucide-react";

export function ClaimFile({ claim }: { claim: AnyClaim }) {
  return (
    <div className="card">
      <header
        className="px-5 py-4 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="flex items-center gap-2">
          <FileText
            className="w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <div className="section-label">Claim file</div>
        </div>
        <div
          className="font-mono text-xs mt-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {claim.claimId} · status: {claim.status}
        </div>
      </header>

      <div className="p-5 space-y-6 text-sm">
        <Section title="FNOL">
          <KV label="Insured" value={claim.insured.name} />
          <KV label="Policy" value={claim.policyId} />
          <KV label="Loss date" value={claim.lossDate} />
          <KV label="Notice date" value={claim.noticeDate} />
          <KV label="Jurisdiction" value={claim.jurisdiction} />
        </Section>

        <Section title="Alleged">
          <KV label="Cause" value={claim.alleged.cause} />
          <KV
            label="Quantum"
            value={formatCurrency(claim.alleged.quantum, claim.alleged.currency)}
          />
          <p
            className="text-xs leading-relaxed mt-2 italic"
            style={{ color: "var(--text-tertiary)" }}
          >
            {claim.alleged.description}
          </p>
        </Section>

        <Section title="Policy">
          <KV label="Wording" value={claim.policy.wording} />
          {claim.policy.manuscriptEndorsements.length > 0 && (
            <div>
              <div
                className="font-mono text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Manuscripts:
              </div>
              <div className="mt-1 space-y-1">
                {claim.policy.manuscriptEndorsements.map((e) => (
                  <div
                    key={e}
                    className="font-mono text-xs px-2 py-1 inline-block mr-1"
                    style={{
                      background: "rgba(155, 107, 255, 0.1)",
                      color: "var(--trace-ontology)",
                      border: "1px solid var(--trace-ontology)",
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          )}
          <KV
            label="Period"
            value={`${claim.policy.inceptionDate} → ${claim.policy.expiryDate}`}
          />
          <KV
            label="Limit"
            value={formatCurrency(claim.policy.limit, claim.alleged.currency)}
          />
          <KV
            label="Deductible"
            value={formatCurrency(
              claim.policy.deductible,
              claim.alleged.currency,
            )}
          />
        </Section>

        {claim.type === "property" && (
          <Section title="Property">
            <KV label="Type" value={claim.property.type} />
            <KV label="Location" value={claim.property.location} />
            <KV label="Construction" value={claim.property.construction} />
            <KV label="Year built" value={claim.property.yearBuilt.toString()} />
          </Section>
        )}

        {claim.type === "marine" && (
          <Section title="Vessel">
            <KV
              label="Vessel"
              value={`${claim.vessel.name} (IMO ${claim.vessel.imoNumber})`}
            />
            <KV label="Type" value={claim.vessel.type} />
            <KV
              label="Subrogation potential"
              value={claim.loss.subrogationPotential}
            />
            {claim.loss.thirdPartyInvolved && (
              <KV
                label="Third party"
                value={claim.loss.thirdPartyInvolved}
              />
            )}
          </Section>
        )}

        {claim.type === "cyber" && (
          <Section title="Cyber incident">
            <KV label="Type" value={claim.loss.incidentType} />
            <KV label="Industry" value={claim.insuredOperations.industry} />
            <KV
              label="Records affected"
              value={(claim.loss.recordsAffected ?? 0).toLocaleString()}
            />
            {claim.loss.ransomPaid && (
              <KV
                label="Ransom paid"
                value={formatCurrency(claim.loss.ransomPaid, "USD")}
              />
            )}
            <KV label="Forensics" value={claim.loss.forensicsFirm} />
          </Section>
        )}

        <Section title="Loss detail">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {claim.type === "property" && claim.loss.causeDetail}
            {claim.type === "marine" && claim.loss.causeDetail}
            {claim.type === "cyber" && claim.loss.incidentDetail}
          </p>
        </Section>

        <Section title="External reports">
          <div className="space-y-3">
            {claim.externalReports.map((r, i) => (
              <div key={i} className="pl-3 border-l border-subtle">
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className="w-3 h-3 shrink-0"
                    style={{ color: "var(--text-tertiary)" }}
                  />
                  <span className="font-mono text-xs">{r.type}</span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {r.firm} · {r.dateReceived}
                  </span>
                </div>
                <p
                  className="text-xs mt-1 italic leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {r.summary}
                </p>
              </div>
            ))}
          </div>
        </Section>
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

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 text-sm">
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-tertiary)", minWidth: "100px" }}
      >
        {label}
      </span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
