import { BrokerDemo } from "./BrokerDemo";
import { SUBMISSION_LIST } from "@/data/submissions";
import { EXTRACTION_TRACES } from "@/data/extraction-traces";
import { LLM_COMPARISONS } from "@/data/llm-comparisons";
import { generatePlacementRecommendation } from "@/lib/placement-engine";

export default function BrokerDemoPage() {
  const submissions = SUBMISSION_LIST.map((s) => ({
    key: s.key,
    label: s.label,
    summary: s.summary,
    submission: s.submission,
    placement: generatePlacementRecommendation(s.submission),
    extraction: EXTRACTION_TRACES[s.key],
    llmComparison: LLM_COMPARISONS[s.key],
  }));

  return <BrokerDemo submissions={submissions} />;
}
