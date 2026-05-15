import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

const demos = [
  {
    number: "01",
    slug: "broker",
    title: "Broker Intelligence",
    subtitle: "Submission analysis · syndicate matching · slip structuring",
    description:
      "Pre-bind risk analysis with syndicate appetite matching, line-size optimization, and structured slip recommendation. Every conclusion traces to a specific rule from a specific syndicate's underwriting manual.",
    status: "available",
  },
  {
    number: "02",
    slug: "underwriting",
    title: "Lead Underwriting Workbench",
    subtitle: "Risk analysis · portfolio context · renewal intelligence",
    description:
      "Full underwriting decision support with portfolio impact, treaty implications, and rate-adequacy derivation. New-risk and renewal modes show the same reasoning architecture applied to different starting points.",
    status: "phase-2",
  },
  {
    number: "03",
    slug: "claims",
    title: "Claims Intelligence",
    subtitle: "FNOL processing · coverage logic · settlement strategy",
    description:
      "Coverage analysis applies real wording-to-rule binding. When a manuscripted endorsement modifies the base wording, the rule evaluator picks up which rules to activate or deactivate. The claims trace becomes the litigation defense.",
    status: "phase-3",
  },
  {
    number: "04",
    slug: "wordings",
    title: "Wordings & Coverage Analysis",
    subtitle: "Manuscripted deviation analysis · audit trail",
    description:
      "Side-by-side analysis of standard LMA wordings against manuscripted variants, classifying every deviation as broadening, narrowing, ambiguous, or neutral — with risk implication and downstream rule effect.",
    status: "phase-4",
  },
];

export default function LloydsLanding() {
  return (
    <div>
      <section className="border-b border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="section-label mb-8">A working demonstration</div>
          <h1 className="display-serif text-5xl lg:text-7xl max-w-4xl mb-8">
            Neurosymbolic AI for the London market.
          </h1>
          <p
            className="text-lg lg:text-xl max-w-2xl leading-relaxed mb-12"
            style={{ color: "var(--text-secondary)" }}
          >
            Lloyd&apos;s runs on unstructured documents, bespoke wordings, and
            judgment under constraint. The market needs reasoning systems that can
            be audited — not language models that approximate.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/lloyds/request-access" className="btn-primary">
              Request access <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lloyds/signin"
              className="text-sm hover:text-white transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              I already have access →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <div className="section-label mb-4">The premise</div>
              <h2 className="font-serif text-2xl font-light leading-snug">
                Citations are not proof chains.
              </h2>
            </div>
            <div className="lg:col-span-2 space-y-6 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                LLM-based platforms have made real progress on document intake and
                triage. They cite their sources, reduce hallucination, and
                accelerate underwriters. But a citation answers a different
                question than a proof chain. A citation says: <em>here is where I
                read this</em>. A proof chain says: <em>given these facts and these
                rules, this conclusion follows</em>.
              </p>
              <p>
                For decisions that the PRA, NAIC, NYDFS, and EU AI Act increasingly
                demand insurers be able to defend, citations are necessary but not
                sufficient. The regulator is not asking whether the model
                hallucinated. The regulator is asking what the specific factual and
                regulatory basis was for the decision. Proof chains answer that.
              </p>
              <p>
                This platform is a working demonstration of that architecture
                applied to four core London market workflows. Same inputs, same
                outputs, every time. Every conclusion traces to a specific rule.
                Rules are inspectable, editable, ownable by domain experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="section-label mb-12">The four demonstrations</div>
          <div className="grid lg:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-subtle">
            {demos.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>
          <div
            className="mt-12 text-sm flex items-center gap-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Lock className="w-4 h-4" /> All four demonstrations are gated. Access
            is granted to qualified market participants.
          </div>
        </div>
      </section>

      <section className="border-t border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="section-label mb-6">The honest framing</div>
              <p className="font-serif text-2xl font-light leading-snug mb-6">
                We are not claiming LLMs are wrong. We are claiming a different
                architecture is right for a specific class of problems.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                NSAI is the right choice when decisions must be defensible to
                regulators with specific reasoning, when the underwriting or claims
                logic is genuinely complex and rule-bound, when determinism
                matters, and when domain experts need to inspect and edit
                decision rules without retraining a model.
              </p>
            </div>
            <div>
              <div className="section-label mb-6">Where this lives</div>
              <p className="font-serif text-2xl font-light leading-snug mb-6">
                Behind a request-and-approve gate.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                We restrict access because the demonstrations contain proprietary
                rule structures and ontology design. Approved viewers receive a
                7-day magic link. Sessions persist 30 days after first sign-in.
              </p>
              <Link
                href="/lloyds/request-access"
                className="btn-secondary mt-8 text-sm"
              >
                Request access →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DemoCard({ demo }: { demo: (typeof demos)[number] }) {
  const isAvailable = demo.status === "available";
  return (
    <div
      className="p-10 bg-[var(--bg-primary)] flex flex-col gap-6 min-h-[280px]"
      style={{ opacity: isAvailable ? 1 : 0.55 }}
    >
      <div className="flex items-start justify-between">
        <div className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
          {demo.number}
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} />
          {!isAvailable && (
            <span className="section-label" style={{ fontSize: "0.65rem" }}>
              {demo.status.replace("phase-", "Phase ")}
            </span>
          )}
        </div>
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
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {demo.description}
      </p>
      {isAvailable && (
        <Link
          href="/lloyds/signin"
          className="text-sm self-start"
          style={{ color: "var(--accent-primary)" }}
        >
          Open demonstration →
        </Link>
      )}
    </div>
  );
}
