export interface LmaClause {
  id: string;
  title: string;
  category: string;
  description: string;
  effectiveDate: string;
  typicalUse: string;
}

export const LMA_CLAUSES: Record<string, LmaClause> = {
  LMA5395: {
    id: "LMA5395",
    title: "Marine Hull Clauses — Time (1/11/2002)",
    category: "Marine Hull",
    description:
      "Standard hull and machinery cover for vessels insured on a time policy. Includes perils of the sea, fire, jettison, piracy, contact, latent defect in hull or machinery, and collision liability. Subject to standard exclusions including war, strikes, malicious acts, and radioactive contamination.",
    effectiveDate: "2002-11-01",
    typicalUse:
      "Default form for blue-water and brown-water hull placements at Lloyd's.",
  },
  LMA5396: {
    id: "LMA5396",
    title: "Increased Value and Excess Liabilities Clauses",
    category: "Marine Hull — IV",
    description:
      "Companion form to LMA5395, providing increased-value cover and excess liabilities (collision excess of policy limit).",
    effectiveDate: "2002-11-01",
    typicalUse: "Almost always written alongside LMA5395.",
  },
  LMA5418: {
    id: "LMA5418",
    title: "Marine Hull War, Strikes, Terrorism (Time)",
    category: "Marine Hull — War",
    description:
      "Time policy form for war, strikes, malicious acts, and terrorism risks excluded from the standard LMA5395 hull form.",
    effectiveDate: "2010-01-01",
    typicalUse:
      "Companion war-risk cover; subject to 7-day notice of cancellation and named-areas exclusions per JWLA list.",
  },
  LMA5377: {
    id: "LMA5377",
    title: "Institute Cargo Clauses (A)",
    category: "Marine Cargo",
    description:
      "Widest cargo cover form — all risks of loss or damage subject to specified exclusions.",
    effectiveDate: "2009-01-01",
    typicalUse: "Default for high-value or hazardous cargo placements.",
  },
};
