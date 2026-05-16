"use client";

import { useState } from "react";
import type { ClaimKey } from "@/data/claims";
import type { AnyClaim } from "@/ontology/classes/claim";
import type { ClaimsEvaluationOutput } from "@/lib/claims-engine";
import { ClaimFile } from "./ClaimFile";
import { ClaimDecisionPanel } from "./ClaimDecisionPanel";
import { ClaimReasoningTrace } from "./ClaimReasoningTrace";
import { UnderwritingFeedbackPanel } from "./UnderwritingFeedbackPanel";

interface ClaimItem {
  key: ClaimKey;
  label: string;
  shortSummary: string;
  claim: AnyClaim;
  evaluation: ClaimsEvaluationOutput;
}

export function ClaimsDemo({ claims }: { claims: ClaimItem[] }) {
  const [activeKey, setActiveKey] = useState<ClaimKey>(claims[0]?.key ?? "property");
  const active = claims.find((c) => c.key === activeKey) ?? claims[0];

  const [view, setView] = useState<"handler" | "underwriting">("handler");

  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="section-label">Demo 03 · Claims Intelligence</div>
          <h1 className="display-serif text-3xl lg:text-4xl mt-2">
            FNOL · coverage logic · settlement strategy.
          </h1>
        </div>

        {/* Claim selector */}
        <div
          className="border border-subtle p-3 mb-6 grid md:grid-cols-3 gap-2"
          style={{ background: "var(--bg-secondary)" }}
        >
          {claims.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveKey(c.key)}
              className="px-3 py-2.5 text-left transition-colors"
              style={{
                background:
                  c.key === activeKey ? "var(--bg-elevated)" : "transparent",
                border:
                  c.key === activeKey
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className="font-mono text-xs"
                  style={{
                    color:
                      c.key === activeKey
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {c.label}
                </span>
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {c.shortSummary}
              </div>
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("handler")}
            className="text-sm px-4 py-2 transition-colors"
            style={{
              background:
                view === "handler" ? "var(--bg-elevated)" : "transparent",
              border:
                view === "handler"
                  ? "1px solid var(--accent-primary)"
                  : "1px solid var(--border-subtle)",
              color:
                view === "handler"
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
            }}
          >
            Claims handler view
          </button>
          <button
            onClick={() => setView("underwriting")}
            className="text-sm px-4 py-2 transition-colors"
            style={{
              background:
                view === "underwriting" ? "var(--bg-elevated)" : "transparent",
              border:
                view === "underwriting"
                  ? "1px solid var(--accent-secondary)"
                  : "1px solid var(--border-subtle)",
              color:
                view === "underwriting"
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
            }}
          >
            Underwriting feedback view
          </button>
        </div>

        {view === "handler" ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4">
              <ClaimFile claim={active.claim} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <ClaimDecisionPanel evaluation={active.evaluation} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <ClaimReasoningTrace evaluation={active.evaluation} />
            </div>
          </div>
        ) : (
          <UnderwritingFeedbackPanel evaluation={active.evaluation} />
        )}

        <div className="mt-12 card p-6">
          <div className="section-label mb-3">The headline demonstration</div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            The Property claim shows what NSAI does that LLM/RAG approaches
            structurally cannot. The base LMA5395 wording would deny this loss
            (electrical-equipment exclusion at clause 7.3.1). A manuscript
            endorsement (E-2024-07) <em>deactivates</em> that exclusion rule,
            <em> activates</em> a sub-limit rule, and <em>modifies</em> the
            deductible rule for this peril. The evaluator picks up which rules
            to apply directly from the policy&apos;s manuscript references —
            this is wording-to-rule binding, the architectural piece that gives
            you provable consistency between the policy contract and the
            claims decision.
          </p>
        </div>
      </div>
    </section>
  );
}
