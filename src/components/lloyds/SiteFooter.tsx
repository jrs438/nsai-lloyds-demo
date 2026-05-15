export function SiteFooter() {
  return (
    <footer className="border-t border-subtle mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="section-label">NSAI for Insurance</div>
            <div className="section-label mt-1" style={{ color: "var(--text-tertiary)" }}>
              Lloyd&apos;s Market Demonstrations · v0.1
            </div>
            <p
              className="text-sm mt-4 max-w-md"
              style={{ color: "var(--text-tertiary)" }}
            >
              Neurosymbolic AI — reasoning systems for decisions that must be
              defensible. Architecturally distinct from generative LLM platforms.
            </p>
          </div>
          <div
            className="text-xs font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            <div>nsai4insurance.com</div>
            <div className="mt-1">Restricted demonstration platform</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
