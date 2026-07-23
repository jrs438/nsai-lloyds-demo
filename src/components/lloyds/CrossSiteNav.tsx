// Fixed floating pills that mirror the P&C / L&A pattern on nsai4insurance.com.
// Moss-green background so they stand out against both light and dark pages —
// this is the same palette the main site uses, keeping the two properties
// visually stitched together.
import type { CSSProperties } from "react";

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "rgba(63, 94, 74, 0.88)",
  color: "#F4EFE6",
  border: "none",
  borderRadius: "4px",
  padding: "10px 14px",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "11px",
  letterSpacing: "0.08em",
  textDecoration: "none",
  whiteSpace: "nowrap",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.18)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  opacity: 0.82,
};

export function CrossSiteNav() {
  return (
    <>
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        <a href="https://nsai4insurance.com/" style={pillStyle}>
          ← NSAI
        </a>
      </div>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
        <a href="https://nsai4insurance.com/pc-deepdive.html" style={pillStyle}>
          P&amp;C →
        </a>
        <a href="https://nsai4insurance.com/lifedemo.html" style={pillStyle}>
          L&amp;A →
        </a>
      </div>
    </>
  );
}
