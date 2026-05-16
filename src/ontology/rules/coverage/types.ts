import type { AnyClaim } from "../../classes/claim";
import type { ManuscriptEndorsement } from "../../wordings/manuscripted";

export interface CoverageFacts {
  claim: AnyClaim;
  manuscripts: ManuscriptEndorsement[];
}

export interface CoverageContext {
  currentDate: Date;
  // Set of rule IDs the manuscripts have activated or deactivated
  activatedRules: Set<string>;
  deactivatedRules: Set<string>;
  // Parameters injected by manuscripts (e.g. sub-limit, modified deductible)
  ruleParameters: Map<string, Record<string, unknown>>;
}

export function buildCoverageContext(
  manuscripts: ManuscriptEndorsement[],
): CoverageContext {
  const activatedRules = new Set<string>();
  const deactivatedRules = new Set<string>();
  const ruleParameters = new Map<string, Record<string, unknown>>();

  for (const m of manuscripts) {
    for (const mod of m.modifications) {
      if (mod.type === "activates") activatedRules.add(mod.ruleId);
      if (mod.type === "deactivates") deactivatedRules.add(mod.ruleId);
      if (mod.parameters) ruleParameters.set(mod.ruleId, mod.parameters);
    }
  }

  return {
    currentDate: new Date("2026-05-15"),
    activatedRules,
    deactivatedRules,
    ruleParameters,
  };
}
