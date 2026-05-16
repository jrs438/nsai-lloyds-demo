import { CLAIM_LIST } from "@/data/claims";
import { evaluateClaim } from "@/lib/claims-engine";
import { ClaimsDemo } from "./ClaimsDemo";

export default function ClaimsDemoPage() {
  const claims = CLAIM_LIST.map((c) => ({
    key: c.key,
    label: c.label,
    shortSummary: c.shortSummary,
    claim: c.claim,
    evaluation: evaluateClaim(c.claim),
  }));

  return <ClaimsDemo claims={claims} />;
}
