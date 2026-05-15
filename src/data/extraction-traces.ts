import type { SubmissionKey } from "./submissions";

export interface ExtractedFact {
  label: string;
  value: string;
  source: string;
  confidence: number;
}

export interface ExtractionTrace {
  computedInMs: number;
  overallConfidence: number;
  facts: ExtractedFact[];
}

export const EXTRACTION_TRACES: Record<SubmissionKey, ExtractionTrace> = {
  A: {
    computedInMs: 340,
    overallConfidence: 0.94,
    facts: [
      {
        label: "Insured",
        value: "Albacore Marine Ltd",
        source: "Slip presentation · page 1",
        confidence: 0.99,
      },
      {
        label: "Vessel",
        value: "MV Atlantic Pioneer (IMO 9521843)",
        source: "Slip presentation · page 2",
        confidence: 0.97,
      },
      {
        label: "Vessel type",
        value: "Capesize bulk carrier, 180,000 DWT",
        source: "Q88 questionnaire · field 14",
        confidence: 0.96,
      },
      {
        label: "Hull value",
        value: "USD 47,500,000",
        source: "Schedule of values · line 3",
        confidence: 0.99,
      },
      {
        label: "Vessel age",
        value: "12 years (built 2014)",
        source: "Class certificate · DNV",
        confidence: 0.99,
      },
      {
        label: "Last condition survey",
        value: "2024-03-15 (26 months ago)",
        source: "Class certificate · page 1",
        confidence: 0.94,
      },
      {
        label: "Flag",
        value: "Liberia (LR)",
        source: "Q88 questionnaire · field 8",
        confidence: 0.99,
      },
      {
        label: "Classification society",
        value: "DNV — active class",
        source: "Class certificate · DNV survey log",
        confidence: 0.98,
      },
      {
        label: "Trading area",
        value: "Worldwide ex sanctioned regions",
        source: "Slip presentation · page 3",
        confidence: 0.91,
      },
      {
        label: "Loss history",
        value:
          "1 incident — 2023-09-04, fender contact, USD 240,000 paid, settled",
        source: "Loss runs · 5y report",
        confidence: 0.87,
      },
      {
        label: "Requested lead line",
        value: "12.5% lead",
        source: "Broker covering letter",
        confidence: 0.93,
      },
    ],
  },
  B: {
    computedInMs: 280,
    overallConfidence: 0.96,
    facts: [
      {
        label: "Insured",
        value: "Northern Star Tankers AS",
        source: "Slip presentation · page 1",
        confidence: 0.99,
      },
      {
        label: "Vessel",
        value: "MT Nordlys (IMO 9847216)",
        source: "Slip presentation · page 2",
        confidence: 0.98,
      },
      {
        label: "Vessel type",
        value: "Handysize chemical tanker (IMO Type II), 25,000 DWT",
        source: "Q88 questionnaire · field 14",
        confidence: 0.97,
      },
      {
        label: "Hull value",
        value: "USD 38,000,000",
        source: "Schedule of values · line 1",
        confidence: 0.99,
      },
      {
        label: "Vessel age",
        value: "6 years (built 2020)",
        source: "Class certificate · DNV",
        confidence: 0.99,
      },
      {
        label: "Last condition survey",
        value: "2025-09-20 (8 months ago)",
        source: "DNV survey log",
        confidence: 0.97,
      },
      {
        label: "Flag",
        value: "Norway NIS",
        source: "Certificate of registry",
        confidence: 0.99,
      },
      {
        label: "Classification society",
        value: "DNV — active class, 1A ice class",
        source: "Class certificate",
        confidence: 0.98,
      },
      {
        label: "Trading area",
        value: "North Atlantic / NW Europe",
        source: "Slip presentation · page 3",
        confidence: 0.95,
      },
      {
        label: "Loss history",
        value: "Clean — 5y record",
        source: "Loss runs · 5y report",
        confidence: 0.94,
      },
      {
        label: "Requested lead line",
        value: "15% lead",
        source: "Broker covering letter",
        confidence: 0.94,
      },
    ],
  },
  C: {
    computedInMs: 390,
    overallConfidence: 0.88,
    facts: [
      {
        label: "Insured",
        value: "Pacific Container Lines (Pte) Ltd",
        source: "Slip presentation · page 1",
        confidence: 0.98,
      },
      {
        label: "Vessel",
        value: "MV Pacific Endeavour (IMO 9325617)",
        source: "Slip presentation · page 2",
        confidence: 0.97,
      },
      {
        label: "Vessel type",
        value: "Sub-Panamax container vessel, 2,800 TEU",
        source: "Q88 questionnaire · field 14",
        confidence: 0.94,
      },
      {
        label: "Hull value",
        value: "USD 18,500,000",
        source: "Schedule of values · line 1",
        confidence: 0.99,
      },
      {
        label: "Vessel age",
        value: "18 years (built 2008)",
        source: "Class certificate · NK",
        confidence: 0.99,
      },
      {
        label: "Last condition survey",
        value: "2024-08-30 (21 months ago)",
        source: "NK survey log",
        confidence: 0.92,
      },
      {
        label: "Flag",
        value: "Panama (PA)",
        source: "Certificate of registry",
        confidence: 0.98,
      },
      {
        label: "Classification society",
        value: "NK — active class",
        source: "Class certificate",
        confidence: 0.96,
      },
      {
        label: "Trading area",
        value: "Asia-Pacific including occasional Red Sea / GoA transits",
        source: "Slip presentation · page 3",
        confidence: 0.84,
      },
      {
        label: "Loss history",
        value:
          "2 incidents — 2024 engine fire (USD 1.85M); 2023 weather damage (USD 320k)",
        source: "Loss runs · 5y report",
        confidence: 0.79,
      },
      {
        label: "Requested lead line",
        value: "10% lead",
        source: "Broker covering letter",
        confidence: 0.90,
      },
    ],
  },
};
