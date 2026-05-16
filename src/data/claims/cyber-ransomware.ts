import type { CyberClaim } from "@/ontology/classes/claim";

// Cyber ransomware claim demonstrating that ransom payment coverage
// requires both an affirmative manuscript (E-2025-03) AND OFAC clearance.
export const ClaimCyberRansomware: CyberClaim = {
  claimId: "CY-CL-2026-0089",
  policyId: "MR2891-2026-CY-0017",
  type: "cyber",
  status: "investigating",
  lossDate: "2026-04-03",
  noticeDate: "2026-04-04",
  insured: {
    name: "Cascade Health Systems",
    domicile: "US-OR",
  },
  jurisdiction: "Oregon, USA — US District Court District of Oregon",
  alleged: {
    cause: "Ransomware encryption of EHR and clinical systems",
    quantum: 18_500_000,
    currency: "USD",
    description:
      "Ransomware deployed via compromised vendor remote access on 3 April. Approximately 280 servers across 12 facilities encrypted including the EHR system. Operations were degraded for 11 days; full restore took 23 days. Ransom demand USD 4.5M (paid USD 2.8M after negotiation). BI loss, forensics, restoration, and notification costs together total quantum.",
  },
  policy: {
    wording: "LMA5599",
    manuscriptEndorsements: ["E-2025-03"],
    inceptionDate: "2026-01-15",
    expiryDate: "2027-01-15",
    limit: 25_000_000,
    deductible: 250_000,
  },
  insuredOperations: {
    industry: "Healthcare (regional non-profit hospital system)",
    employees: 3_500,
    annualRevenue: 850_000_000,
  },
  loss: {
    incidentType: "ransomware",
    incidentDetail:
      "Threat actor 'BlackCat / ALPHV' affiliate. Initial access via compromised vendor (cardiology imaging platform); lateral movement enabled by flat AD network and missing EDR coverage on certain server segments. Encryption deployed approximately 18 hours after initial compromise.",
    forensicsFirm: "Mandiant (Google Cloud)",
    daysToDetection: 0,
    dataExfiltrated: true,
    recordsAffected: 412_000,
    ransomDemand: 4_500_000,
    ransomPaid: 2_800_000,
    businessInterruption: true,
    estimatedDaysOffline: 11,
  },
  externalReports: [
    {
      type: "expert",
      firm: "Mandiant (Google Cloud)",
      dateReceived: "2026-04-08",
      summary:
        "Forensic timeline confirms initial compromise via Symphony Imaging (vendor) on 1 April; encryption 3 April. 412k patient records exfiltrated (confirmed via dark web listing). Ransom payment to wallet bc1q[…] — verified clean against OFAC SDN list at time of payment.",
    },
    {
      type: "lawyer",
      firm: "Mullen Coughlin (cyber breach coach)",
      dateReceived: "2026-04-09",
      summary:
        "OCR breach notification required within 60 days; Oregon AG notification within 45 days. Affirmative coverage for ransom payment confirmed under manuscript E-2025-03 subject to OFAC sign-off (received).",
    },
  ],
};
