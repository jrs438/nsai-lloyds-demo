"use client";

import { useState } from "react";
import type { SubmissionKey } from "@/data/submissions";
import type { ExtractionTrace } from "@/data/extraction-traces";
import type { LlmComparison } from "@/data/llm-comparisons";
import type { MarineHullSubmission } from "@/ontology/classes/marine";
import type { PlacementRecommendation } from "@/lib/placement-engine";
import { SubmissionViewer } from "./SubmissionViewer";
import { PlacementRecommendationPanel } from "./PlacementRecommendation";
import { ReasoningTrace } from "@/components/reasoning/ReasoningTrace";
import { SlipBuilder } from "./SlipBuilder";

interface SubmissionItem {
  key: SubmissionKey;
  label: string;
  summary: string;
  submission: MarineHullSubmission;
  placement: PlacementRecommendation;
  extraction: ExtractionTrace;
  llmComparison: LlmComparison;
}

export function BrokerDemo({
  submissions,
}: {
  submissions: SubmissionItem[];
}) {
  const [activeKey, setActiveKey] = useState<SubmissionKey>("A");
  const [slipOpen, setSlipOpen] = useState(false);
  const active = submissions.find((s) => s.key === activeKey) ?? submissions[0];

  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="section-label">Demo 01 · Broker Intelligence</div>
          <h1 className="display-serif text-3xl lg:text-4xl mt-2">
            Submission analysis and slip structuring.
          </h1>
        </div>

        <div
          className="border border-subtle p-3 mb-6 flex flex-wrap gap-2"
          style={{ background: "var(--bg-secondary)" }}
        >
          {submissions.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              className="px-3 py-2 text-sm flex-1 min-w-[200px] text-left transition-colors"
              style={{
                background:
                  s.key === activeKey
                    ? "var(--bg-elevated)"
                    : "transparent",
                border:
                  s.key === activeKey
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-subtle)",
                color:
                  s.key === activeKey
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
            >
              <div className="font-mono text-xs mb-1">
                {s.label.split("·")[0].trim()}
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {s.summary}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <SubmissionViewer submission={active.submission} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <PlacementRecommendationPanel
              placement={active.placement}
              onBuildSlip={() => setSlipOpen(true)}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ReasoningTrace
              extraction={active.extraction}
              placement={active.placement}
              llmComparison={active.llmComparison}
              submission={active.submission}
            />
          </div>
        </div>

        <div className="mt-12 card p-6">
          <div className="section-label mb-3">Why this matters</div>
          <div className="grid lg:grid-cols-2 gap-6 text-sm">
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>The reasoning trace IS the audit record — no separate documentation needed</li>
              <li>Same submission, same recommendation, every time — verify with re-run</li>
              <li>Adding a new syndicate or changing appetite is editing a config file</li>
            </ul>
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>A new wording variation triggers reconsideration of which rules apply — automatically</li>
              <li>Sixfold / Cytora / Artificial Labs extract well but do not produce derivations</li>
              <li>NSAI extracts AND derives — proof chains, not just citations</li>
            </ul>
          </div>
        </div>
      </div>

      <SlipBuilder
        open={slipOpen}
        onOpenChange={setSlipOpen}
        submission={active.submission}
        placement={active.placement}
      />
    </section>
  );
}
