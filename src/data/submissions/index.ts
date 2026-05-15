import { MarineHullSubmissionA } from "./marine-hull-a";
import { MarineHullSubmissionB } from "./marine-hull-b";
import { MarineHullSubmissionC } from "./marine-hull-c";

export const SUBMISSIONS = {
  A: MarineHullSubmissionA,
  B: MarineHullSubmissionB,
  C: MarineHullSubmissionC,
};

export const SUBMISSION_LIST = [
  {
    key: "A" as const,
    label: "Submission A — Marine Hull",
    summary: "MV Atlantic Pioneer · Capesize bulk carrier · Albacore Marine",
    submission: MarineHullSubmissionA,
  },
  {
    key: "B" as const,
    label: "Submission B — Marine Hull",
    summary: "MT Nordlys · Handysize chemical tanker · Northern Star",
    submission: MarineHullSubmissionB,
  },
  {
    key: "C" as const,
    label: "Submission C — Marine Hull",
    summary: "MV Pacific Endeavour · Sub-Panamax container · Pacific Container",
    submission: MarineHullSubmissionC,
  },
];

export type SubmissionKey = keyof typeof SUBMISSIONS;
export { MarineHullSubmissionA, MarineHullSubmissionB, MarineHullSubmissionC };
