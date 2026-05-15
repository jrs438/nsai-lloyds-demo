import { UW_SCENARIO_LIST } from "@/data/underwriting-submissions";
import { evaluateUnderwriting } from "@/lib/underwriting-engine";
import { MercatorPortfolio } from "@/data/portfolio";
import { UnderwritingWorkbench } from "./UnderwritingWorkbench";

export default function UnderwritingDemoPage() {
  const scenarios = UW_SCENARIO_LIST.map((s) => ({
    scenario: s,
    decision: evaluateUnderwriting(s),
  }));

  return (
    <UnderwritingWorkbench
      scenarios={scenarios}
      portfolio={MercatorPortfolio}
    />
  );
}
