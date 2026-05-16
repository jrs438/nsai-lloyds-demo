import { ClaimPropertyWarehouseFire } from "./property-warehouse-fire";
import { ClaimMarineCargoSubrogation } from "./marine-cargo-subrogation";
import { ClaimCyberRansomware } from "./cyber-ransomware";

export const CLAIMS = {
  property: ClaimPropertyWarehouseFire,
  marine: ClaimMarineCargoSubrogation,
  cyber: ClaimCyberRansomware,
};

export const CLAIM_LIST = [
  {
    key: "property" as const,
    label: "Property — Warehouse fire",
    shortSummary: "Cascade Cold Storage · HVAC electrical fire · USD 8.4M alleged",
    claim: ClaimPropertyWarehouseFire,
  },
  {
    key: "marine" as const,
    label: "Marine — Cargo subrogation",
    shortSummary:
      "Pacific Container · stack collapse · USD 2.85M alleged · carrier negligence",
    claim: ClaimMarineCargoSubrogation,
  },
  {
    key: "cyber" as const,
    label: "Cyber — Ransomware",
    shortSummary: "Cascade Health · 412k records · USD 2.8M ransom paid · USD 18.5M total",
    claim: ClaimCyberRansomware,
  },
];

export type ClaimKey = keyof typeof CLAIMS;
export { ClaimPropertyWarehouseFire, ClaimMarineCargoSubrogation, ClaimCyberRansomware };
