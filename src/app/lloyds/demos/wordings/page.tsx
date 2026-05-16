import {
  LMA5395_TEXT,
  MANUSCRIPTED_TEXT,
  DEVIATIONS,
} from "@/data/wordings";
import { WordingsAnalysisDemo } from "./WordingsAnalysisDemo";

export default function WordingsDemoPage() {
  return (
    <WordingsAnalysisDemo
      standardText={LMA5395_TEXT}
      manuscriptText={MANUSCRIPTED_TEXT}
      deviations={DEVIATIONS}
    />
  );
}
