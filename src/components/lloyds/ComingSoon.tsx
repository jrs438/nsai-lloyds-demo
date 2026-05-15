import Link from "next/link";

interface ComingSoonProps {
  number: string;
  title: string;
  summary: string;
  phase: string;
}

export function ComingSoon({ number, title, summary, phase }: ComingSoonProps) {
  return (
    <section>
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="section-label mb-6">
          Demo {number} · {phase}
        </div>
        <h1 className="display-serif text-4xl lg:text-5xl mb-6">{title}</h1>
        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {summary}
        </p>
        <p
          className="text-sm mb-12"
          style={{ color: "var(--text-tertiary)" }}
        >
          This demonstration is under development. Phase 1 ships Demo 01 (Broker
          Intelligence). Subsequent demonstrations build on the same ontology
          and reasoning architecture.
        </p>
        <div className="flex gap-4">
          <Link href="/lloyds/demos/broker" className="btn-primary">
            Open Demo 01 →
          </Link>
          <Link href="/lloyds/demos" className="btn-secondary">
            All demonstrations
          </Link>
        </div>
      </div>
    </section>
  );
}
