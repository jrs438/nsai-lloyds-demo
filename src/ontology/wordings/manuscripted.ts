export interface ManuscriptModification {
  type: "deactivates" | "activates" | "modifies";
  ruleId: string;
  reason: string;
  parameters?: Record<string, unknown>;
}

export interface ManuscriptEndorsement {
  id: string;
  title: string;
  baseWording: string;
  description: string;
  effectiveDate: string;
  modifications: ManuscriptModification[];
  effectiveScope: string;
  draftedBy: string;
  agreedAt: string;
}

// E-2024-07: classic example from the brief — expanded electrical-equipment
// coverage that REMOVES a standard exclusion and ADDS a sub-limit.
export const Endorsement_E_2024_07: ManuscriptEndorsement = {
  id: "E-2024-07",
  title: "Expanded Coverage — Electrical Equipment Causation",
  baseWording: "LMA5395",
  description:
    "Endorsement removes the standard electrical equipment exclusion at clause 7.3.1 and introduces a USD 5,000,000 sub-limit for losses arising from electrical equipment malfunction. Higher deductible of USD 250,000 applies for this peril specifically.",
  effectiveDate: "2024-07-01",
  modifications: [
    {
      type: "deactivates",
      ruleId: "COV-EXCL-031",
      reason: "Endorsement explicitly removes standard electrical equipment exclusion (clause 7.3.1)",
    },
    {
      type: "activates",
      ruleId: "COV-SUB-LIMIT-042",
      reason: "Endorsement adds a sub-limit of USD 5,000,000 for losses arising from electrical equipment causation",
      parameters: { subLimit: 5_000_000 },
    },
    {
      type: "modifies",
      ruleId: "COV-DED-001",
      reason: "Endorsement applies elevated deductible of USD 250,000 per occurrence for this peril",
      parameters: { deductible: 250_000 },
    },
  ],
  effectiveScope: "electrical-equipment-causation",
  draftedBy: "Carrier Underwriting (manuscript drafting team)",
  agreedAt: "2024-06-12",
};

// E-2025-03: Cyber — affirmative coverage for ransomware payment with carrier consent.
export const Endorsement_E_2025_03: ManuscriptEndorsement = {
  id: "E-2025-03",
  title: "Ransomware Payment — Affirmative Coverage",
  baseWording: "LMA5599",
  description:
    "Endorsement affirms that ransomware extortion payments are covered subject to carrier pre-approval and OFAC/sanctions screening of the threat actor wallet address.",
  effectiveDate: "2025-03-01",
  modifications: [
    {
      type: "activates",
      ruleId: "COV-CYB-RANSOM-001",
      reason: "Endorsement affirmatively covers ransomware extortion payments",
    },
    {
      type: "activates",
      ruleId: "COV-CYB-OFAC-001",
      reason: "Pre-payment OFAC screening of wallet addresses is required",
    },
  ],
  effectiveScope: "ransomware-extortion",
  draftedBy: "Cyber Underwriting Team",
  agreedAt: "2025-02-20",
};

// E-2026-02: Marine — extended subrogation rights for cargo carrier liability
export const Endorsement_E_2026_02: ManuscriptEndorsement = {
  id: "E-2026-02",
  title: "Extended Subrogation — Cargo Carrier Liability",
  baseWording: "LMA5377",
  description:
    "Endorsement preserves subrogation rights against named carriers notwithstanding standard Bills of Lading limitations.",
  effectiveDate: "2026-02-01",
  modifications: [
    {
      type: "activates",
      ruleId: "CLM-SUB-CARRIER-001",
      reason: "Preserved subrogation against named carrier despite standard B/L Himalaya/Hague-Visby limitations",
    },
  ],
  effectiveScope: "subrogation",
  draftedBy: "Marine Cargo Team",
  agreedAt: "2026-01-15",
};

export const ALL_MANUSCRIPTS: Record<string, ManuscriptEndorsement> = {
  "E-2024-07": Endorsement_E_2024_07,
  "E-2025-03": Endorsement_E_2025_03,
  "E-2026-02": Endorsement_E_2026_02,
};
