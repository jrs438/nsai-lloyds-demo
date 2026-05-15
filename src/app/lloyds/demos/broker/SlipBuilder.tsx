"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Minus, Printer, AlertTriangle, Check } from "lucide-react";
import type { MarineHullSubmission } from "@/ontology/classes/marine";
import type {
  PlacementRecommendation,
  SyndicateEvaluation,
} from "@/lib/placement-engine";
import { formatCurrency } from "@/lib/utils";

interface SlipLine {
  syndicateId: string;
  percentage: number;
  isLead: boolean;
}

interface SlipBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: MarineHullSubmission;
  placement: PlacementRecommendation;
}

function initialLines(placement: PlacementRecommendation): SlipLine[] {
  const lead =
    placement.recommendedLeads[0] ?? placement.conditionalLeads[0] ?? null;

  const lines: SlipLine[] = [];

  if (lead) {
    lines.push({
      syndicateId: lead.syndicate.id,
      percentage: Math.round(lead.recommendedLeadLine * 100 * 10) / 10,
      isLead: true,
    });
  }

  for (const ev of placement.recommendedFollowers) {
    if (ev.syndicate.id === lead?.syndicate.id) continue;
    lines.push({
      syndicateId: ev.syndicate.id,
      percentage: Math.round(ev.recommendedFollowLine * 100 * 10) / 10,
      isLead: false,
    });
  }

  // Add eligible non-lead syndicates to bring closer to 100
  const used = new Set(lines.map((l) => l.syndicateId));
  for (const ev of placement.recommendedLeads.slice(1)) {
    if (used.has(ev.syndicate.id)) continue;
    lines.push({
      syndicateId: ev.syndicate.id,
      percentage: Math.round(ev.recommendedFollowLine * 100 * 10) / 10,
      isLead: false,
    });
  }

  return lines;
}

export function SlipBuilder({
  open,
  onOpenChange,
  submission,
  placement,
}: SlipBuilderProps) {
  const [lines, setLines] = useState<SlipLine[]>(() => initialLines(placement));

  const evaluationsById = useMemo(() => {
    const map = new Map<string, SyndicateEvaluation>();
    for (const ev of placement.syndicateEvaluations) {
      map.set(ev.syndicate.id, ev);
    }
    return map;
  }, [placement]);

  const totalSigned = useMemo(
    () => lines.reduce((sum, l) => sum + l.percentage, 0),
    [lines],
  );

  const totalsValid = Math.abs(totalSigned - 100) < 0.01;

  const lineWarnings = useMemo(() => {
    return lines.map((line) => {
      const ev = evaluationsById.get(line.syndicateId);
      if (!ev) return null;
      const cap = line.isLead
        ? ev.recommendedLeadLine * 100
        : ev.recommendedFollowLine * 100;
      if (line.percentage > cap) {
        return `Exceeds ${line.isLead ? "lead" : "follow"} line cap of ${cap.toFixed(1)}%`;
      }
      if (ev.status === "decline" || ev.status === "soft-decline") {
        return "Syndicate is out of appetite for this risk";
      }
      if (ev.status === "conditional") {
        return "Subject to condition (survey update or similar)";
      }
      return null;
    });
  }, [lines, evaluationsById]);

  function updatePercentage(idx: number, value: number) {
    setLines((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, percentage: Math.max(0, value) } : l,
      ),
    );
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function setLead(idx: number) {
    setLines((prev) => prev.map((l, i) => ({ ...l, isLead: i === idx })));
  }

  function addAvailableSyndicate(syndicateId: string) {
    const ev = evaluationsById.get(syndicateId);
    if (!ev) return;
    setLines((prev) => [
      ...prev,
      {
        syndicateId,
        percentage: Math.round(ev.recommendedFollowLine * 100 * 10) / 10,
        isLead: false,
      },
    ]);
  }

  const availableToAdd = placement.syndicateEvaluations.filter(
    (ev) =>
      !lines.find((l) => l.syndicateId === ev.syndicate.id) &&
      (ev.status === "eligible" || ev.status === "conditional"),
  );

  const leadLine = lines.find((l) => l.isLead);
  const leadEv = leadLine ? evaluationsById.get(leadLine.syndicateId) : null;

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 slip-overlay"
          style={{ background: "rgba(0,0,0,0.85)" }}
        />
        <Dialog.Content
          className="fixed inset-0 z-50 overflow-y-auto slip-dialog"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
            {/* Chrome — hidden when printing */}
            <div className="slip-chrome flex items-center justify-between mb-8">
              <div>
                <div className="section-label">Slip builder</div>
                <div
                  className="font-mono text-xs mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Lloyd&apos;s Market Reform Contract · v3.0
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  disabled={!totalsValid}
                  className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="w-4 h-4" /> Print / PDF
                </button>
                <Dialog.Close className="btn-secondary text-sm">
                  <X className="w-4 h-4" /> Close
                </Dialog.Close>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
              {/* Slip document */}
              <div className="slip-document">
                <SlipDocument
                  submission={submission}
                  lines={lines}
                  evaluationsById={evaluationsById}
                  leadEv={leadEv}
                  totalSigned={totalSigned}
                />
              </div>

              {/* Line editor — hidden when printing */}
              <aside className="slip-chrome">
                <div className="card sticky top-6">
                  <header
                    className="px-5 py-4 border-b border-subtle"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <div className="section-label">Lines</div>
                    <div
                      className="text-xs font-mono mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Adjust % per syndicate · total must = 100%
                    </div>
                  </header>

                  <div className="p-4 space-y-3">
                    {lines.map((line, idx) => {
                      const ev = evaluationsById.get(line.syndicateId);
                      const warning = lineWarnings[idx];
                      return (
                        <div
                          key={`${line.syndicateId}-${idx}`}
                          className="border border-subtle p-3"
                          style={{ background: "var(--bg-primary)" }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <button
                              onClick={() => setLead(idx)}
                              className="text-xs font-mono"
                              style={{
                                color: line.isLead
                                  ? "var(--accent-primary)"
                                  : "var(--text-tertiary)",
                              }}
                              title="Set as slip leader"
                            >
                              {line.isLead ? "★ LEAD" : "set lead"}
                            </button>
                            <button
                              onClick={() => removeLine(idx)}
                              className="text-xs"
                              style={{ color: "var(--text-tertiary)" }}
                              title="Remove"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-serif text-sm">
                            {ev?.syndicate.name ?? line.syndicateId}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={line.percentage}
                              onChange={(e) =>
                                updatePercentage(
                                  idx,
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="input text-sm flex-1"
                              style={{ padding: "0.4rem 0.6rem" }}
                            />
                            <span
                              className="text-xs font-mono"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              %
                            </span>
                          </div>
                          {warning && (
                            <div
                              className="text-xs mt-2 flex items-start gap-1.5"
                              style={{ color: "#d68744" }}
                            >
                              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                              <span>{warning}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {lines.length === 0 && (
                      <div
                        className="text-xs italic"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        No lines yet — add a syndicate below.
                      </div>
                    )}
                  </div>

                  {availableToAdd.length > 0 && (
                    <div className="p-4 border-t border-subtle">
                      <div className="section-label mb-2" style={{ fontSize: "0.65rem" }}>
                        Add syndicate
                      </div>
                      <div className="space-y-1">
                        {availableToAdd.map((ev) => (
                          <button
                            key={ev.syndicate.id}
                            onClick={() => addAvailableSyndicate(ev.syndicate.id)}
                            className="w-full text-left text-xs py-1 px-2 hover:bg-[var(--bg-elevated)] transition-colors flex items-center justify-between gap-2"
                          >
                            <span>{ev.syndicate.name}</span>
                            <Plus
                              className="w-3 h-3"
                              style={{ color: "var(--text-tertiary)" }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 border-t border-subtle">
                    <div className="flex items-center justify-between">
                      <span className="section-label">Total signed</span>
                      <span
                        className="font-mono text-sm font-medium"
                        style={{
                          color: totalsValid
                            ? "var(--trace-rule-fired)"
                            : "var(--trace-rule-failed)",
                        }}
                      >
                        {totalSigned.toFixed(1)}%
                      </span>
                    </div>
                    <div
                      className="text-xs mt-1 flex items-center gap-1.5"
                      style={{
                        color: totalsValid
                          ? "var(--trace-rule-fired)"
                          : "var(--text-tertiary)",
                      }}
                    >
                      {totalsValid ? (
                        <>
                          <Check className="w-3 h-3" /> Slip is fully signed
                        </>
                      ) : (
                        <>
                          {totalSigned > 100
                            ? `${(totalSigned - 100).toFixed(1)}% over`
                            : `${(100 - totalSigned).toFixed(1)}% to place`}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SlipDocument({
  submission,
  lines,
  evaluationsById,
  leadEv,
  totalSigned,
}: {
  submission: MarineHullSubmission;
  lines: SlipLine[];
  evaluationsById: Map<string, SyndicateEvaluation>;
  leadEv: SyndicateEvaluation | null | undefined;
  totalSigned: number;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const umr = `B${submission.submissionId.replace(/[^0-9]/g, "").slice(0, 10) || "0000000000"}`;

  return (
    <article
      className="slip-paper"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <header
        className="p-8 border-b border-subtle"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="section-label">Lloyd&apos;s Market Reform Contract</div>
            <h1 className="display-serif text-3xl mt-2">
              Slip — Marine Hull & Machinery
            </h1>
          </div>
          <div
            className="text-xs font-mono text-right"
            style={{ color: "var(--text-tertiary)" }}
          >
            <div>UMR · {umr}</div>
            <div>Slip prepared · {today}</div>
            <div>MRC v3.0</div>
          </div>
        </div>
      </header>

      <SlipSection title="Section A · Risk Details">
        <Field label="Insured" value={submission.insured.name} />
        <Field
          label="Insured Domicile"
          value={submission.insured.domicile}
        />
        <Field
          label="Type of Contract"
          value="Marine Hull & Machinery (LMA5395) — H&M and Increased Value"
        />
        <Field
          label="Period of Insurance"
          value={`12 months at noon ${submission.coverage.inceptionDate} to noon ${submission.coverage.expiryDate} (both dates GMT)`}
        />
        <Field
          label="Vessel"
          value={`${submission.vessel.name} (IMO ${submission.vessel.imoNumber}) — ${submission.vessel.subClass}, ${submission.vessel.yearBuilt} built, ${submission.vessel.flagState} flag, classed by ${submission.vessel.classificationSociety}`}
        />
        <Field
          label="Interest"
          value="Hull, Machinery, Tackle, Apparel, Furniture, Boats and everything connected with the vessel; Increased Value."
        />
        <Field
          label="Sum Insured"
          value={`${formatCurrency(submission.coverage.hullValue, submission.coverage.currency)} Hull & Machinery; ${formatCurrency(submission.coverage.increasedValue, submission.coverage.currency)} Increased Value`}
        />
        <Field
          label="Geographical Limits"
          value={submission.tradingArea.description}
        />
        <Field
          label="Deductible"
          value={`${formatCurrency(submission.coverage.deductible, submission.coverage.currency)} each accident or occurrence`}
        />
      </SlipSection>

      <SlipSection title="Section B · Conditions & Wording">
        <ConditionItem label="Wording">
          LMA5395 — Marine Hull Clauses Time (1/11/2002)
        </ConditionItem>
        <ConditionItem label="Increased Value">
          LMA5396 — Increased Value and Excess Liabilities (1/11/2002)
        </ConditionItem>
        <ConditionItem label="Law & Jurisdiction">
          English Law and Practice. Exclusive jurisdiction of the High Court
          of Justice in London.
        </ConditionItem>
        <ConditionItem label="Cancellation">
          7 days notice in writing in respect of war and strikes risks per
          LMA5418; otherwise per LMA5395.
        </ConditionItem>
        <ConditionItem label="Sanctions">
          LMA3100 Sanction Limitation and Exclusion Clause
        </ConditionItem>
        <ConditionItem label="Subjectivities">
          {submission.vessel.surveyAgeMonths > 24
            ? `Subject to receipt and underwriters' satisfactory review of updated condition survey (current survey dated ${submission.vessel.lastSurveyDate}).`
            : "No conditions precedent."}
        </ConditionItem>
      </SlipSection>

      <SlipSection title="Section C · Security Details / Signing Slip">
        <div className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
          The following syndicates participate in the placement on the lines
          set against their respective stamps.
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
              <th className="text-left section-label py-2">Syndicate</th>
              <th className="text-left section-label py-2">Managing Agent</th>
              <th className="text-right section-label py-2">Written line %</th>
              <th className="text-center section-label py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const ev = evaluationsById.get(line.syndicateId);
              if (!ev) return null;
              return (
                <tr
                  key={line.syndicateId}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td className="py-2.5">
                    <div className="font-serif">{ev.syndicate.name}</div>
                    <div
                      className="text-xs font-mono"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {ev.syndicate.id}
                    </div>
                  </td>
                  <td
                    className="py-2.5 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {ev.syndicate.managingAgent}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {line.percentage.toFixed(2)}%
                  </td>
                  <td className="py-2.5 text-center">
                    {line.isLead ? (
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        SLIP LEAD
                      </span>
                    ) : (
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        FOLLOW
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr style={{ borderTop: "2px solid var(--border-strong)" }}>
              <td colSpan={2} className="py-2.5 section-label">
                Total written
              </td>
              <td
                className="py-2.5 text-right font-mono"
                style={{
                  color:
                    Math.abs(totalSigned - 100) < 0.01
                      ? "var(--trace-rule-fired)"
                      : "var(--trace-rule-failed)",
                }}
              >
                {totalSigned.toFixed(2)}%
              </td>
              <td />
            </tr>
          </tbody>
        </table>

        {leadEv && (
          <div className="mt-6 pt-4 border-t border-subtle">
            <div className="section-label mb-1">Slip leader</div>
            <div className="text-sm">
              <span className="font-serif">{leadEv.syndicate.name}</span> —
              acting as Slip Leader and Bureaux Leader for and on behalf of
              all subscribing underwriters.
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Managing Agent: {leadEv.syndicate.managingAgent} · Stamp
              Capacity {formatCurrency(leadEv.syndicate.stampCapacity, "GBP")}
            </div>
          </div>
        )}
      </SlipSection>

      <SlipSection title="Section D · Fiscal & Regulatory">
        <Field label="Premium Currency" value={submission.coverage.currency} />
        <Field label="Brokerage" value="10.000% of gross premium" />
        <Field label="Taxes" value="IPT not applicable (marine non-life)" />
        <Field
          label="Regulatory Risk Country"
          value={submission.insured.domicile}
        />
      </SlipSection>

      <SlipSection title="Section E · Broker Remuneration & Deductions">
        <ConditionItem label="Broker">
          {submission.broker.name} ({submission.broker.contactRole})
        </ConditionItem>
        <ConditionItem label="Total deductions">
          Brokerage 10.000%. No additional fees.
        </ConditionItem>
      </SlipSection>

      <footer
        className="p-6 border-t border-strong text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        <div>
          This slip is supported by a complete reasoning trace produced by
          neurosymbolic placement analysis, including syndicate appetite
          evaluation against {evaluationsById.size > 0 ? "24" : "0"} inspectable
          rules per syndicate. The trace constitutes the audit record for this
          placement decision.
        </div>
        <div className="mt-3 font-mono">UMR {umr} · Prepared {today}</div>
      </footer>
    </article>
  );
}

function SlipSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-8 border-b border-subtle">
      <h2 className="section-label mb-5" style={{ fontSize: "0.8rem" }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 text-sm slip-field">
      <div
        className="font-mono text-xs pt-0.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}

function ConditionItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 text-sm slip-field">
      <div
        className="font-mono text-xs pt-0.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </div>
      <div style={{ color: "var(--text-secondary)" }}>{children}</div>
    </div>
  );
}
