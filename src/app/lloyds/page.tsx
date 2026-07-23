import { redirect } from "next/navigation";

// The lloyds root now opens directly on the positioning page — a public,
// ungated read of the case. Demonstrations live one click away in the header
// and remain behind the request-access gate.
export default function LloydsRoot() {
  redirect("/lloyds/positioning");
}
