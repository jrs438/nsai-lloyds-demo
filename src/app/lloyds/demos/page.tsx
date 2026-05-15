import Link from "next/link";
import { ArrowRight } from "lucide-react";

const demos = [
  {
    number: "01",
    slug: "broker",
    title: "Broker Intelligence",
    subtitle: "Submission analysis · syndicate matching · slip structuring",
    status: "available" as const,
  },
  {
    number: "02",
    slug: "underwriting",
    title: "Lead Underwriting Workbench",
    subtitle: "Risk analysis · portfolio context · renewal intelligence",
    status: "coming" as const,
  },
  {
    number: "03",
    slug: "claims",
    title: "Claims Intelligence",
    subtitle: "FNOL processing · coverage logic · settlement strategy",
    status: "coming" as const,
  },
  {
    number: "04",
    slug: "wordings",
    title: "Wordings & Coverage Analysis",
    subtitle: "Manuscripted deviation analysis · audit trail",
    status: "coming" as const,
  },
];

export default function DemosIndex() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="section-label mb-6">Demonstrations</div>
        <h1 className="display-serif text-4xl lg:text-5xl mb-4">
          Four neurosymbolic demonstrations.
        </h1>
        <p
          className="text-base max-w-2xl mb-12"
          style={{ color: "var(--text-secondary)" }}
        >
          Each demonstrates the same architectural principle on a different
          London market workflow. The reasoning trace component is identical
          across all four; the rule sets, ontology, and data shape change.
        </p>

        <div className="grid lg:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-subtle">
          {demos.map((demo) => (
            <DemoTile key={demo.slug} demo={demo} />
          ))}
        </div>

        <div className="mt-16">
          <Link
            href="/lloyds/positioning"
            className="btn-secondary text-sm"
          >
            View competitive positioning →
          </Link>
        </div>
      </div>
    </section>
  );
}

function DemoTile({ demo }: { demo: (typeof demos)[number] }) {
  const available = demo.status === "available";
  return (
    <div
      className="p-10 bg-[var(--bg-primary)] flex flex-col gap-6 min-h-[220px]"
      style={{ opacity: available ? 1 : 0.5 }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          {demo.number}
        </span>
        <span className="section-label" style={{ fontSize: "0.65rem" }}>
          {available ? "Live" : "Coming"}
        </span>
      </div>
      <div>
        <h3 className="font-serif text-2xl font-light mb-2">{demo.title}</h3>
        <div
          className="text-xs font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          {demo.subtitle}
        </div>
      </div>
      <div className="mt-auto">
        {available ? (
          <Link
            href={`/lloyds/demos/${demo.slug}`}
            className="text-sm inline-flex items-center gap-2"
            style={{ color: "var(--accent-primary)" }}
          >
            Open <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-tertiary)" }}
          >
            Under development
          </span>
        )}
      </div>
    </div>
  );
}
