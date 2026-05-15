import { RequestAccessForm } from "./RequestAccessForm";

export default function RequestAccessPage() {
  return (
    <section>
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
        <div className="section-label mb-6">Access · Step 01</div>
        <h1 className="display-serif text-4xl lg:text-5xl mb-6">
          Request access to the demonstrations.
        </h1>
        <p
          className="text-base leading-relaxed mb-12 max-w-2xl"
          style={{ color: "var(--text-secondary)" }}
        >
          We review each request manually. If approved, you&apos;ll receive a
          magic link by email — typically within a working day. The link is valid
          for 7 days from issue.
        </p>

        <RequestAccessForm />
      </div>
    </section>
  );
}
