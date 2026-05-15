import Link from "next/link";

export default function PositioningPage() {
  return (
    <article>
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 space-y-20">
        <header>
          <div className="section-label mb-6">Competitive positioning</div>
          <h1 className="display-serif text-4xl lg:text-6xl mb-6 max-w-3xl">
            What NSAI does that LLM platforms don&apos;t.
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            We don&apos;t claim LLM platforms are wrong. We claim a different
            architecture is right for a specific class of problems. The case below
            is meant to be rigorous, not promotional.
          </p>
        </header>

        <Section number="01" title="The vendor landscape today">
          <p>
            Insurance AI has matured rapidly. The competitors are sophisticated
            and the messaging is honest: most cite their sources, emphasize human
            review, and acknowledge probabilistic limitations.
          </p>
          <VendorTable />
          <p className="mt-6">
            This is not a naive market. Differentiation has to be argued
            precisely, not by strawmanning the competition.
          </p>
        </Section>

        <Section number="02" title="What these tools actually do — and don't">
          <p>
            The honest categorization isn&apos;t &quot;they hallucinate, we
            don&apos;t.&quot; All modern systems reduce hallucination with
            citations. The categorization that matters is what kind of question
            each system can answer about its own output.
          </p>
          <CapabilityTable />
        </Section>

        <Section
          number="03"
          title='The "but citations are enough" counterargument'
        >
          <PullQuote>
            A citation says &quot;here is where I read this.&quot; A proof chain
            says &quot;given these facts and these rules, this conclusion
            follows.&quot; Both are valuable — but they answer different
            questions.
          </PullQuote>
          <p>
            Citations answer &quot;did the model make this up?&quot; Proof chains
            answer &quot;would another reasonable underwriter applying our
            guidelines reach the same conclusion?&quot; For straightforward
            extraction — &quot;what is the insured&apos;s address&quot; —
            citations are sufficient. For underwriting and claims decisions that
            the PRA, NAIC, NYDFS, and EU AI Act increasingly demand insurers be
            able to defend, citations are necessary but not sufficient.
          </p>
          <p>
            The regulators are not asking &quot;did your AI hallucinate?&quot;
            They are asking &quot;what was the specific factual and regulatory
            basis for this decision?&quot; A citation to a passage does not
            answer that. A proof chain does.
          </p>
        </Section>

        <Section number="04" title="Where other tools are genuinely strong">
          <p>This is critical for credibility. NSAI is not universally superior.</p>
          <ul className="space-y-3 mt-4">
            <Bullet>
              <strong>High-volume extraction with human review</strong>:
              Sixfold, Eigen, Cytora are excellent — and probably easier to
              deploy.
            </Bullet>
            <Bullet>
              <strong>Algorithmic follow within established appetite</strong>:
              Ki, Artificial Labs Smart Follow work well.
            </Bullet>
            <Bullet>
              <strong>Data quality monitoring</strong>: DQPro is dominant for a
              reason.
            </Bullet>
            <Bullet>
              <strong>Early-stage market entry without engineering
              investment</strong>: standard LLM tooling is faster to deploy.
            </Bullet>
          </ul>
          <h3 className="font-serif text-xl mt-10 mb-4">
            NSAI is the right choice when:
          </h3>
          <ul className="space-y-3">
            <Bullet>
              Decisions need to be defensible to regulators with specific
              reasoning
            </Bullet>
            <Bullet>
              The underwriting or claims logic is genuinely complex and
              rule-bound
            </Bullet>
            <Bullet>Determinism matters — same risk, same decision, always</Bullet>
            <Bullet>
              The rule set is dynamic and needs to be inspectable and editable
              by domain experts without retraining
            </Bullet>
            <Bullet>
              Bias must be provably absent on specific attributes — rule-level
              inspection, not statistical post-hoc audit
            </Bullet>
            <Bullet>
              The decision pipeline involves multi-constraint optimization —
              pricing, capacity, treaty terms, regulatory filings, all together
            </Bullet>
          </ul>
        </Section>

        <Section number="05" title="The regulatory direction is the tailwind">
          <p>
            The regulatory direction does not mandate NSAI. It mandates
            explainability. NSAI is the architecture that delivers explainability
            natively rather than as an add-on.
          </p>
          <ul className="space-y-3 mt-6">
            <Bullet>
              <strong>NAIC Model Bulletin on AI</strong> (adopted by 24 US states
              as of 2026) — documented governance, transparency, explainability
              for AI-influenced decisions.
            </Bullet>
            <Bullet>
              <strong>NYDFS Circular Letter 2024-7</strong> — demonstration that
              AI does not proxy protected classes, with explanatory
              documentation.
            </Bullet>
            <Bullet>
              <strong>Colorado §10-3-1104.9</strong> — prohibits unfair
              discrimination via external data and predictive models; requires
              quantitative disparate-impact testing.
            </Bullet>
            <Bullet>
              <strong>EU AI Act</strong> (Articles 13, 14) — transparency and
              human-oversight requirements for high-risk AI, including
              insurance underwriting.
            </Bullet>
            <Bullet>
              <strong>UK PRA / FCA</strong> — principles-based explainability,
              fairness, accountability, contestability. UK AI Bill expected
              2026.
            </Bullet>
            <Bullet>
              <strong>LMA AI Survey 2026</strong> — 93% of Lloyd&apos;s market
              firms now have AI governance frameworks (up from ~50% with
              limited implementation in 2025).
            </Bullet>
          </ul>
        </Section>

        <div className="pt-12 border-t border-subtle">
          <Link href="/lloyds/demos" className="btn-primary">
            Explore the demonstrations →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-8">
          <div
            className="font-mono text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {number} /
          </div>
          <h2 className="section-label mt-2">{title}</h2>
        </div>
      </div>
      <div className="lg:col-span-3 space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </section>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="font-serif text-2xl font-light leading-snug my-8 py-4 pl-6 border-l-2"
      style={{ borderColor: "var(--accent-primary)", color: "var(--text-primary)" }}
    >
      {children}
    </blockquote>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span style={{ color: "var(--accent-primary)" }}>—</span>
      <span>{children}</span>
    </li>
  );
}

function VendorTable() {
  const rows = [
    {
      category: "Submission intake / triage (LLM-based)",
      vendors: "Sixfold · Cytora (Applied Systems) · Artificial Labs Ava · Federato",
    },
    {
      category: "Document extraction",
      vendors: "Eigen Technologies · V7 Go",
    },
    { category: "Algorithmic follow", vendors: "Ki · Artificial Labs Smart Follow" },
    { category: "Portfolio monitoring", vendors: "Federato · Cytora" },
    { category: "Data quality", vendors: "DQPro (45% of Lloyd's)" },
    { category: "Pricing / risk scoring", vendors: "Convr · Kalepa · Planck" },
  ];
  return (
    <div className="my-8 border border-subtle">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.category}
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <td
                className="px-4 py-3 align-top"
                style={{ color: "var(--text-primary)", width: "40%" }}
              >
                {r.category}
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                {r.vendors}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CapabilityTable() {
  const headers = ["Capability", "LLM platforms", "RAG-LLMs", "Neurosymbolic"];
  const rows: Array<[string, string, string, string]> = [
    ["Read unstructured documents", "✓ Strong", "✓ Strong", "✓ Strong (neural front-end)"],
    ["Cite source of information", "✓ Yes", "✓ Yes", "✓ Yes (with binding)"],
    ["Produce deterministic output", "✗ Probabilistic", "✗ Probabilistic", "✓ Deterministic"],
    ["Show reasoning as proof chain", "✗ Plausible narrative", "✗ Citations + narrative", "✓ Explicit derivation tree"],
    ["Inspect & edit decision rules", "✗ In weights / prompts", "✗ In weights", "✓ Inspectable code"],
    ["Guarantee a specific rule fires", "✗ Cannot", "✗ Cannot", "✓ Logical guarantee"],
    ["Multi-step constraint satisfaction", "⚠ Unreliable", "⚠ Unreliable", "✓ Solver-based"],
    ["Audit-trail for regulator", "⚠ Narrative", "⚠ Citations + narrative", "✓ Proof chain = audit trail"],
    ["Bias testing on protected attributes", "Statistical, post-hoc", "Statistical, post-hoc", "Rule-level inspection"],
    ["Run cost per decision", "Higher (LLM tokens)", "Higher (LLM + retrieval)", "Lower (logic + cached neural)"],
  ];

  return (
    <div className="my-8 border border-subtle overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}>
            {headers.map((h, i) => (
              <th
                key={h}
                className="text-left px-3 py-3 section-label"
                style={{
                  color: i === 3 ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td className="px-3 py-2.5 font-mono" style={{ color: "var(--text-primary)" }}>{r[0]}</td>
              <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{r[1]}</td>
              <td className="px-3 py-2.5" style={{ color: "var(--text-secondary)" }}>{r[2]}</td>
              <td className="px-3 py-2.5" style={{ color: "var(--accent-primary)" }}>{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
