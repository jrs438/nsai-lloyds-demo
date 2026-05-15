"use client";

import { useState } from "react";
import type { UnderwritingScenario } from "@/data/underwriting-submissions/types";
import type { UnderwritingDecision } from "@/lib/underwriting-engine";
import type { SyndicatePortfolio } from "@/data/portfolio/types";
import { RiskAnalysisTab } from "./tabs/RiskAnalysisTab";
import { PortfolioImpactTab } from "./tabs/PortfolioImpactTab";
import { PricingTab } from "./tabs/PricingTab";
import { RenewalComparisonTab } from "./tabs/RenewalComparisonTab";
import { UnderwritingReasoningTrace } from "./UnderwritingReasoningTrace";
import { ConclusionBadge } from "./ConclusionBadge";

interface ScenarioWithDecision {
  scenario: UnderwritingScenario;
  decision: UnderwritingDecision;
}

type Tab = "risk" | "portfolio" | "pricing" | "renewal";

export function UnderwritingWorkbench({
  scenarios,
  portfolio,
}: {
  scenarios: ScenarioWithDecision[];
  portfolio: SyndicatePortfolio;
}) {
  const [activeId, setActiveId] = useState(scenarios[0]?.scenario.scenarioId);
  const active =
    scenarios.find((s) => s.scenario.scenarioId === activeId) ?? scenarios[0];
  const [tab, setTab] = useState<Tab>("risk");

  const isRenewal = active.scenario.mode === "renewal";

  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="section-label">Demo 02 · Lead Underwriting Workbench</div>
          <h1 className="display-serif text-3xl lg:text-4xl mt-2">
            {portfolio.syndicateName}.
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {portfolio.bookSummary.totalRisks} bound risks ·{" "}
            ${(portfolio.bookSummary.totalSumInsured / 1_000_000).toFixed(0)}M
            sum insured ·{" "}
            {(portfolio.bookSummary.capacityUtilization * 100).toFixed(1)}%
            stamp utilization · as of {portfolio.asOfDate}
          </p>
        </div>

        {/* Scenario selector */}
        <div
          className="border border-subtle p-3 mb-6 grid md:grid-cols-3 gap-2"
          style={{ background: "var(--bg-secondary)" }}
        >
          {scenarios.map(({ scenario, decision }) => {
            const isActive = scenario.scenarioId === active.scenario.scenarioId;
            return (
              <button
                key={scenario.scenarioId}
                onClick={() => {
                  setActiveId(scenario.scenarioId);
                  if (scenario.mode !== "renewal" && tab === "renewal") {
                    setTab("risk");
                  }
                }}
                className="px-3 py-2.5 text-left transition-colors"
                style={{
                  background: isActive
                    ? "var(--bg-elevated)"
                    : "transparent",
                  border: isActive
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="font-mono text-xs"
                    style={{
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {scenario.label}
                  </span>
                  <ConclusionBadge conclusion={decision.conclusion} small />
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {scenario.shortSummary}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mode + storyline */}
        <div
          className="border border-subtle p-4 mb-6"
          style={{ background: "var(--bg-secondary)" }}
        >
          <div className="flex items-start gap-6">
            <div>
              <div className="section-label">Mode</div>
              <div
                className="font-serif text-lg mt-1"
                style={{
                  color: isRenewal
                    ? "var(--accent-secondary)"
                    : "var(--accent-primary)",
                }}
              >
                {isRenewal ? "Renewal Intelligence" : "New Risk Underwriting"}
              </div>
            </div>
            <div className="flex-1 border-l border-subtle pl-6">
              <div className="section-label mb-1">Storyline</div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {active.scenario.storyline}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="section-label">Conclusion</div>
              <div className="mt-2">
                <ConclusionBadge conclusion={active.decision.conclusion} />
              </div>
              <div
                className="font-mono text-xs mt-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                {active.decision.rulesPassed}/
                {active.decision.rulesPassed + active.decision.rulesFailed} rules
                passed
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="card">
              <div className="border-b border-subtle flex">
                <TabBtn
                  active={tab === "risk"}
                  onClick={() => setTab("risk")}
                  label="Risk analysis"
                  num="01"
                />
                <TabBtn
                  active={tab === "portfolio"}
                  onClick={() => setTab("portfolio")}
                  label="Portfolio impact"
                  num="02"
                />
                <TabBtn
                  active={tab === "pricing"}
                  onClick={() => setTab("pricing")}
                  label="Pricing & terms"
                  num="03"
                />
                {isRenewal && (
                  <TabBtn
                    active={tab === "renewal"}
                    onClick={() => setTab("renewal")}
                    label="Renewal comparison"
                    num="04"
                  />
                )}
              </div>
              <div className="p-6">
                {tab === "risk" && (
                  <RiskAnalysisTab
                    scenario={active.scenario}
                    decision={active.decision}
                  />
                )}
                {tab === "portfolio" && (
                  <PortfolioImpactTab
                    impact={active.decision.portfolioImpact}
                    portfolio={portfolio}
                  />
                )}
                {tab === "pricing" && (
                  <PricingTab decision={active.decision} />
                )}
                {tab === "renewal" && active.decision.renewalComparison && (
                  <RenewalComparisonTab
                    comparison={active.decision.renewalComparison}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <UnderwritingReasoningTrace decision={active.decision} />
          </div>
        </div>

        <div className="mt-12 card p-6">
          <div className="section-label mb-3">What this demonstrates</div>
          <div className="grid lg:grid-cols-2 gap-6 text-sm">
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>The same rule infrastructure from Demo 01 extended with portfolio-aware constraints</li>
              <li>Decisions consider both the risk in isolation AND its impact on the existing book</li>
              <li>Pricing derives technical, benchmark, and proposed rates — each step traceable</li>
            </ul>
            <ul
              className="space-y-2 list-disc list-inside"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>Renewal mode runs the same rule architecture against last-year facts vs this-year facts</li>
              <li>Material changes trigger explicit Insurance Act 2015 disclosure rule</li>
              <li>Zone aggregation flagged before binding, not after a loss</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabBtn({
  active,
  onClick,
  label,
  num,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  num: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 text-sm transition-colors relative flex items-baseline gap-2"
      style={{
        color: active ? "var(--text-primary)" : "var(--text-tertiary)",
        borderBottom: active
          ? "1px solid var(--accent-primary)"
          : "1px solid transparent",
        marginBottom: "-1px",
      }}
    >
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        {num}
      </span>
      <span>{label}</span>
    </button>
  );
}
