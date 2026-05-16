export type DeviationClassification =
  | "broadening"
  | "narrowing"
  | "ambiguous"
  | "neutral";

export interface WordingDeviation {
  id: string;
  clauseReference: string;
  standardText: string;
  manuscriptText: string;
  changeType: "addition" | "deletion" | "modification";
  classification: DeviationClassification;
  classificationReasoning: string;
  rulesTriggered: string[];
  ruleImpact: {
    activatesRules?: string[];
    deactivatesRules?: string[];
    modifiesRules?: string[];
  };
  riskImplication: string;
  precedent?: string;
  reviewer?: string;
}

export const DEVIATIONS: WordingDeviation[] = [
  {
    id: "DEV-001",
    clauseReference: "Clause 1.1 — Navigation / Towage",
    standardText:
      'it is warranted that the Vessel shall not be towed, except as is customary or to the first safe port or place when in need of assistance, or undertake towage or salvage services under a contract previously arranged...',
    manuscriptText:
      "Towage and salvage services under previously arranged contracts shall not prejudice this insurance.",
    changeType: "deletion",
    classification: "broadening",
    classificationReasoning:
      "The standard warranty restricting towage activity has been removed and replaced with affirmative permission. The insured can now undertake towage/salvage under prior contracts without prejudicing the policy.",
    rulesTriggered: ["WRD-CLA-001", "WRD-SCO-002"],
    ruleImpact: {
      deactivatesRules: ["MH-WTY-TOW-001"],
    },
    riskImplication:
      "Eliminates a key defence against towage-related losses. Materially broadens cover; underwriting needs visibility into towage exposure as part of normal operations.",
    precedent:
      "Trafigura v Mediterranean Shipping (Comm Ct 2019) — held that similar deletion converts an implied warranty into a covered activity.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-002",
    clauseReference: "Clause 4.1.5 — Piracy",
    standardText: "piracy",
    manuscriptText: "piracy, including piracy by persons acting from a political motive",
    changeType: "modification",
    classification: "broadening",
    classificationReasoning:
      "Standard piracy peril is narrowed by the corresponding 7.1.5 terrorism exclusion. The manuscript expressly clarifies that politically-motivated piracy is covered under the piracy peril, narrowing the scope of the terrorism exclusion.",
    rulesTriggered: ["WRD-CLA-001", "WRD-PER-EXT-001"],
    ruleImpact: {
      modifiesRules: ["MH-COV-PIRACY-001", "MH-EXCL-TERROR-001"],
    },
    riskImplication:
      "Important in transits through Gulf of Aden / Strait of Hormuz where actors may have mixed political/criminal motives. Cover responds to losses that would otherwise be excluded.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-003",
    clauseReference: "Clause 4.1.9 — Contact with floating objects",
    standardText: "(not present in LMA5395)",
    manuscriptText:
      "contact with floating objects, including ice and submerged debris",
    changeType: "addition",
    classification: "broadening",
    classificationReasoning:
      "Adds a new peril category. Contact with floating objects (including ice growlers, submerged containers, derelict debris) is not within the standard LMA5395 named perils and may fall outside 'perils of the seas' depending on jurisdiction.",
    rulesTriggered: ["WRD-CLA-001", "WRD-NEW-PER-001"],
    ruleImpact: {
      activatesRules: ["MH-COV-FLOATING-OBJ-001"],
    },
    riskImplication:
      "Material broadening. Particularly relevant for the Asia-Pacific trades where container loss has been increasing; closes an interpretive gap that has been contested in litigation.",
    precedent:
      "Maersk Eindhoven (EWHC 2024) — held that submerged container was not within 'perils of the seas' under standard wording; loss denied.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-004",
    clauseReference: "Clause 4.2 — Due diligence proviso",
    standardText:
      "provided such loss or damage has not resulted from want of due diligence by the Assured, Owners or Managers.",
    manuscriptText:
      "(due diligence proviso deleted from this clause; remains implicit per Marine Insurance Act)",
    changeType: "deletion",
    classification: "broadening",
    classificationReasoning:
      "Removes the express contractual due-diligence proviso. The statutory duty under MIA 1906 s.55 remains, but the contractual defense is more readily available than the statutory one in litigation.",
    rulesTriggered: ["WRD-CLA-001", "WRD-DUE-DIL-001"],
    ruleImpact: {
      deactivatesRules: ["MH-EXCL-DUE-DIL-001"],
    },
    riskImplication:
      "Reduces underwriter defenses in latent-defect and crew-negligence claims. Significant narrowing of coverage exclusions and therefore significant broadening of cover.",
    precedent:
      "The Cendor MOPU [2011] UKSC 5 — Supreme Court interpretation gives latitude to insurers on statutory due diligence, but contractual proviso is clearer.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-005",
    clauseReference: "Clause 6.1 — Deductible aggregation",
    standardText:
      "the aggregate of all such claims arising out of each separate accident or occurrence (including claims under Clauses 8, 11 and 13) exceeds the deductible",
    manuscriptText:
      "the aggregate of all such claims arising out of each separate accident or occurrence exceeds the deductible",
    changeType: "deletion",
    classification: "narrowing",
    classificationReasoning:
      "Removed cross-reference to Clauses 8 (Notice), 11 (Sue & Labour) and 13 (Collision) means those claim categories are not aggregated for deductible purposes. Each is subject to the deductible separately.",
    rulesTriggered: ["WRD-CLA-001", "WRD-DED-AGG-001"],
    ruleImpact: {
      modifiesRules: ["MH-CLM-DED-AGG-001"],
    },
    riskImplication:
      "Narrowing of cover — each protect-and-indemnity-adjacent claim must independently exceed the deductible. The insured may face multiple deductibles per occurrence.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-006",
    clauseReference: "Clause 7.1.2 — War / capture exclusion",
    standardText: "capture, seizure, arrest, restraint or detainment",
    manuscriptText:
      "capture, seizure, arrest, restraint or detainment (excluding piracy and barratry which remain covered under Clauses 4.1.5 and 4.2.4)",
    changeType: "modification",
    classification: "broadening",
    classificationReasoning:
      "Narrows the war/capture exclusion by carving out piracy and barratry. This reinforces the manuscript's piracy-coverage expansion and prevents overlap-driven denials.",
    rulesTriggered: ["WRD-CLA-001", "WRD-EXC-NARROW-001"],
    ruleImpact: {
      modifiesRules: ["MH-EXCL-CAPTURE-001"],
    },
    riskImplication:
      "Closes the gap between Clauses 4 (perils) and 7 (exclusions) — coverage for piracy clearly responds even when the same fact pattern could arguably engage the capture exclusion.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-007",
    clauseReference: "Clause 13 — Collision liability",
    standardText: "three-fourths of any sum or sums paid by the Assured",
    manuscriptText: "the full amount of any sum or sums paid by the Assured",
    changeType: "modification",
    classification: "broadening",
    classificationReasoning:
      "Standard 3/4ths collision liability replaced with 4/4ths (full) collision liability. Insured no longer carries the 1/4 retention typically borne by P&I.",
    rulesTriggered: ["WRD-CLA-001", "WRD-LIM-001"],
    ruleImpact: {
      modifiesRules: ["MH-COV-COLL-001"],
    },
    riskImplication:
      "Materially broadening — increases potential indemnification on collision claims by 33%. Removes P&I as the de facto co-insurer of collision liability and may create overlap with P&I cover.",
    reviewer: "Senior Marine Wordings Counsel",
  },
  {
    id: "DEV-008",
    clauseReference: "Clause 23.1 — Law and jurisdiction",
    standardText: "This insurance is subject to English law and practice.",
    manuscriptText:
      "This insurance is subject to English law and practice, save that the parties may agree in writing to refer specific disputes to arbitration in Singapore under SCMA Rules.",
    changeType: "modification",
    classification: "ambiguous",
    classificationReasoning:
      "The forum-selection extension may be procedurally efficient for Asia-Pacific incidents but introduces uncertainty about applicable arbitral standards, costs, and enforceability across jurisdictions. Net direction of risk impact is not clear-cut.",
    rulesTriggered: ["WRD-CLA-001", "WRD-JUR-001"],
    ruleImpact: {
      modifiesRules: ["MH-JUR-001"],
    },
    riskImplication:
      "Refer to claims practice manager. Some carriers prefer single-jurisdiction policies; others welcome arbitration optionality. No automatic broadening or narrowing.",
    reviewer: "Senior Marine Wordings Counsel + Claims Director",
  },
];
