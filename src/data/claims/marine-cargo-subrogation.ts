import type { MarineClaim } from "@/ontology/classes/claim";

// Marine cargo claim with subrogation potential against the carrier.
// Manuscript E-2026-02 preserves subrogation rights despite standard
// B/L limitations — demonstrates rule activation by endorsement.
export const ClaimMarineCargoSubrogation: MarineClaim = {
  claimId: "MR-CL-2026-0114",
  policyId: "MR2891-2026-CG-0023",
  type: "marine",
  status: "investigating",
  lossDate: "2026-03-22",
  noticeDate: "2026-03-25",
  insured: {
    name: "Pacific Container Lines (Pte) Ltd",
    domicile: "SG",
  },
  jurisdiction: "English law / High Court of Justice (Commercial Court)",
  alleged: {
    cause: "Container stack collapse during heavy weather; water ingress damage",
    quantum: 2_850_000,
    currency: "USD",
    description:
      "Heavy weather during eastbound transit Singapore-Yokohama. Three container stacks on the foredeck collapsed; 47 containers lost overboard, 124 containers suffered water ingress damage to cargo. Insured cargo: industrial chemicals (USD 1.8M) and consumer electronics (USD 1.05M).",
  },
  policy: {
    wording: "LMA5377",
    manuscriptEndorsements: ["E-2026-02"],
    inceptionDate: "2026-01-01",
    expiryDate: "2026-12-31",
    limit: 5_000_000,
    deductible: 25_000,
  },
  vessel: {
    name: "MV Pacific Endeavour",
    imoNumber: "9325617",
    type: "Sub-Panamax Container Vessel",
  },
  loss: {
    causeCategory: "heavy-weather",
    causeDetail:
      "Carrier (Asia Lines Pte Ltd) operated vessel through a severe storm system despite available weather routing advisories suggesting deviation. Lashing inspection records show non-compliance with standard CSS Code requirements at the affected stack positions.",
    subrogationPotential: "high",
    thirdPartyInvolved: "Asia Lines Pte Ltd (carrier) — potential negligent navigation and inadequate cargo securing",
  },
  externalReports: [
    {
      type: "surveyor",
      firm: "Brookes Bell Singapore",
      dateReceived: "2026-04-02",
      summary:
        "Survey at Yokohama discharge confirms stack collapse caused by inadequate lashing arrangement. Master's decision to maintain course through storm route is documentable from VDR data. Strong evidence of carrier negligence.",
    },
    {
      type: "lawyer",
      firm: "Hill Dickinson (Singapore)",
      dateReceived: "2026-04-15",
      summary:
        "Subrogation prospects strong. Standard Hague-Visby package limits would cap recovery at ~USD 600k; manuscript E-2026-02 preserves direct claim against carrier under negligence theory.",
    },
  ],
};
