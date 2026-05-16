"use client";

import { useState } from "react";
import type { WordingDeviation } from "@/data/wordings/deviations";
import { WordingDiff } from "./WordingDiff";
import { DeviationDetail } from "./DeviationDetail";
import { WordingsReasoningTrace } from "./WordingsReasoningTrace";
import { ClassificationSummary } from "./ClassificationSummary";

export function WordingsAnalysisDemo({
  standardText,
  manuscriptText,
  deviations,
}: {
  standardText: string;
  manuscriptText: string;
  deviations: WordingDeviation[];
}) {
  const [activeDev, setActiveDev] = useState<WordingDeviation>(deviations[0]);

  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="section-label">Demo 04 · Wordings & Coverage Analysis</div>
          <h1 className="display-serif text-3xl lg:text-4xl mt-2">
            Standard LMA5395 vs. manuscripted variant.
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {deviations.length} deviations identified, classified, and bound to
            rule impacts. Each classification traces to a wording-analysis rule
            with its own authority citation.
          </p>
        </div>

        <ClassificationSummary
          deviations={deviations}
          activeId={activeDev.id}
          onSelect={(d) => setActiveDev(d)}
        />

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 lg:col-span-7">
            <WordingDiff
              standardText={standardText}
              manuscriptText={manuscriptText}
              deviations={deviations}
              activeId={activeDev.id}
              onSelect={(d) => setActiveDev(d)}
            />
            <div className="mt-6">
              <DeviationDetail deviation={activeDev} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <WordingsReasoningTrace
              deviations={deviations}
              activeId={activeDev.id}
            />
          </div>
        </div>

        <div className="mt-12 card p-6">
          <div className="section-label mb-3">Why this matters</div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            An LLM can summarise differences between two wordings — fluently, often
            usefully. But it cannot bind a deviation to a rule. When the
            manuscript deletes the towage warranty (DEV-001), the underwriting
            and claims rule set must know to deactivate the corresponding
            warranty rule. When the collision liability moves from 3/4ths to
            4/4ths (DEV-007), the indemnification calculation must reflect it.
            The same deviation appears here in the wordings demo, in the claims
            demo as a manuscript endorsement, and in the underwriting demo as
            a pricing adjustment — bound together by rule ID, not by prose.
          </p>
        </div>
      </div>
    </section>
  );
}
