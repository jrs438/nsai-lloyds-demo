import { Scenario1CleanFit } from "./scenario-1-clean-fit";
import { Scenario2PortfolioConstrained } from "./scenario-2-portfolio-constrained";
import { Scenario3RenewalChanges } from "./scenario-3-renewal";

export const UW_SCENARIOS = {
  S1: Scenario1CleanFit,
  S2: Scenario2PortfolioConstrained,
  S3: Scenario3RenewalChanges,
};

export const UW_SCENARIO_LIST = [
  Scenario1CleanFit,
  Scenario2PortfolioConstrained,
  Scenario3RenewalChanges,
];

export type ScenarioKey = keyof typeof UW_SCENARIOS;
export { Scenario1CleanFit, Scenario2PortfolioConstrained, Scenario3RenewalChanges };
export type { UnderwritingScenario } from "./types";
