import type { SubmissionKey } from "./submissions";

export interface LlmRun {
  runId: string;
  timestamp: string;
  output: string;
}

export interface LlmComparison {
  runs: LlmRun[];
  observations: string[];
}

export const LLM_COMPARISONS: Record<SubmissionKey, LlmComparison> = {
  A: {
    runs: [
      {
        runId: "Run 1",
        timestamp: "08:14:22",
        output:
          "Based on the submission, I'd recommend approaching Apex, Mercator, and Beacon as lead candidates given their stated appetite for blue-water marine hull. The vessel's age (12 years) and value (~USD 47M) appear within typical bluewater appetites. Suggested pricing in the 0.7–0.9% range, subject to broker negotiation.",
      },
      {
        runId: "Run 2",
        timestamp: "08:14:34",
        output:
          "I would suggest leading with Mercator or Salient. While Apex has marine hull appetite, their underwriting profile typically favors newer vessels. The vessel's survey appears recent enough for the market. Pricing might be around 0.6–0.8% on hull value.",
      },
      {
        runId: "Run 3",
        timestamp: "08:14:51",
        output:
          "For this risk, Apex, Mercator, and Ironclad would be reasonable lead candidates. The vessel and trading area look acceptable for the London market. Note that the condition survey is 26 months old which may be a concern at some markets. Pricing in the 0.65–0.85% range seems appropriate.",
      },
    ],
    observations: [
      "Different syndicate sets recommended each run (Apex/Mercator/Beacon vs Mercator/Salient vs Apex/Mercator/Ironclad)",
      "Run 2 missed the survey-age issue entirely",
      "Run 3 mentioned survey age but did not apply a rule or quantify the impact",
      "No rule citation, no derivation, no proof chain",
      "Pricing ranges vary across runs (0.6–0.9%)",
    ],
  },
  B: {
    runs: [
      {
        runId: "Run 1",
        timestamp: "10:02:14",
        output:
          "This is a clean account — modern Norwegian-flagged chemical tanker with clean loss history. Apex, Mercator, Beacon, Salient and Ironclad would all be plausible lead candidates. Pricing around 0.6–0.75%.",
      },
      {
        runId: "Run 2",
        timestamp: "10:02:29",
        output:
          "Strong submission. Lead recommendation: Mercator or Beacon. Apex would also be a candidate; Ironclad less likely given its tighter age threshold. Pricing in the 0.55–0.7% range.",
      },
      {
        runId: "Run 3",
        timestamp: "10:02:47",
        output:
          "Excellent fit for the London market. I'd recommend approaching any of the major lead-capable syndicates — Apex, Mercator, Beacon, Covenant. Possibly competitive on rating; suggested 0.5–0.65% range to win.",
      },
    ],
    observations: [
      "All three runs broadly accept the submission, but recommended syndicate sets differ",
      "Pricing range varies meaningfully (0.5% to 0.75%)",
      "No quantitative derivation of base rate × modifiers",
      "Run 3 missed Ironclad's actual age threshold (12y) which would have included this vessel; not flagged",
    ],
  },
  C: {
    runs: [
      {
        runId: "Run 1",
        timestamp: "11:43:08",
        output:
          "This will be challenging given the vessel's age (18y) and loss history. I'd suggest exploring Mercator (broader appetite) and possibly Beacon. Pricing likely 1.0% or higher with appropriate deductible adjustments.",
      },
      {
        runId: "Run 2",
        timestamp: "11:43:21",
        output:
          "Given the 18-year age, most leads will decline. Mercator is the most likely candidate given the wider age tolerance. Salient may consider it. Rate will need to be priced for the recent fire loss — perhaps in the 1.2–1.5% range.",
      },
      {
        runId: "Run 3",
        timestamp: "11:43:35",
        output:
          "Difficult risk. Apex, Mercator, Beacon, Covenant could all be approached, but expect declinations from most given the loss record. Consider whether war/political risk wording is needed for GoA transits. Pricing 0.9–1.3% range as a starting point.",
      },
    ],
    observations: [
      "Three runs suggest different syndicate sets; only one consistently identifies Mercator's broader age tolerance",
      "Run 3 recommends Apex and Ironclad — both have 12y and 15y age thresholds that would auto-decline this 18y vessel",
      "Pricing spreads 0.9–1.5% across runs",
      "No run captures the multi-rule failure (age, survey, loss history) deterministically",
    ],
  },
};
