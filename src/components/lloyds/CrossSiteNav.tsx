// Fixed-position floating link back to the NSAI for Insurance parent site.
// Matches the aesthetic of nsai4insurance.com's own P&C / L&A floating pills.
export function CrossSiteNav() {
  return (
    <a
      href="https://nsai4insurance.com/"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:inline-flex items-center transition-opacity hover:opacity-100"
      style={{
        background: "rgba(15, 20, 25, 0.82)",
        color: "#F4EFE6",
        border: "1px solid rgba(244, 239, 230, 0.14)",
        padding: "10px 14px",
        borderRadius: "4px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textDecoration: "none",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.28)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: 0.82,
      }}
    >
      ← NSAI
    </a>
  );
}
