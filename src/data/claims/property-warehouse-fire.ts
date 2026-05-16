import type { PropertyClaim } from "@/ontology/classes/claim";

// THE headline claim. Demonstrates wording-to-rule binding:
// - Base LMA5395 would exclude this loss (electrical equipment exclusion)
// - Manuscript E-2024-07 deactivates the exclusion
// - But activates a sub-limit cap of USD 5M
// - And imposes a higher deductible of USD 250K for this peril
// Result: covered, but capped well below the alleged quantum.
export const ClaimPropertyWarehouseFire: PropertyClaim = {
  claimId: "PR-CL-2026-0421",
  policyId: "MR2891-2026-PR-0048",
  type: "property",
  status: "investigating",
  lossDate: "2026-02-14",
  noticeDate: "2026-02-15",
  insured: {
    name: "Cascade Cold Storage LLC",
    domicile: "US-WA",
  },
  jurisdiction: "Washington State, USA — King County Superior Court",
  alleged: {
    cause: "Electrical malfunction in HVAC system",
    quantum: 8_400_000,
    currency: "USD",
    description:
      "Fire originated in a rooftop HVAC unit control panel at 03:24 local time on 14 February. Fire spread to roof structure, causing partial collapse over the loading dock area. Damage to building, fixed plant, and refrigerated cargo. Operations halted 47 days.",
  },
  policy: {
    wording: "LMA5395",
    manuscriptEndorsements: ["E-2024-07"],
    inceptionDate: "2025-12-01",
    expiryDate: "2026-12-01",
    limit: 12_000_000,
    deductible: 50_000,
    sumInsured: 12_000_000,
  },
  property: {
    type: "Cold storage warehouse (food distribution)",
    location: "Tacoma, WA, USA",
    construction: "Steel frame, insulated panel cladding, single-storey, 18,000 m²",
    yearBuilt: 2014,
  },
  loss: {
    causeCategory: "fire",
    causeDetail:
      "Electrical malfunction in rooftop HVAC equipment — short circuit in compressor control panel ignited insulation material; fire propagated through the void above the false ceiling.",
    elementsAffected: [
      "Roof structure (partial collapse)",
      "Refrigeration plant (3 of 12 compressors total loss)",
      "Refrigerated cargo (USD 1.2M perishable goods)",
      "Loading dock canopy",
    ],
    businessInterruption: true,
    estimatedDaysOffline: 47,
  },
  externalReports: [
    {
      type: "loss-adjuster",
      firm: "McLarens (Pacific Northwest)",
      dateReceived: "2026-02-19",
      summary:
        "On-site investigation confirms ignition source as electrical fault in HVAC control panel. Cause consistent with insured's account. Quantum supportable but pending detailed schedule.",
    },
    {
      type: "expert",
      firm: "Fire Cause & Origin Specialists (FCOS)",
      dateReceived: "2026-03-04",
      summary:
        "Forensic examination confirms HVAC compressor electrical fault as origin. No evidence of incendiary action or contributory cause.",
    },
  ],
};
