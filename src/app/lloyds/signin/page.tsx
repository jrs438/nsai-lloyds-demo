import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-token": "No sign-in token was provided.",
  "expired-or-used": "Your magic link has expired. Request a fresh one.",
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  if (error) {
    return (
      <section>
        <div className="max-w-xl mx-auto px-6 py-24">
          <div
            className="section-label mb-6"
            style={{ color: "var(--trace-rule-failed)" }}
          >
            Sign-in failed
          </div>
          <h1 className="display-serif text-4xl mb-6">
            {ERROR_MESSAGES[error] ?? "Sign-in failed."}
          </h1>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            <Link href="/lloyds/request-access" className="underline">
              Request access again
            </Link>{" "}
            or contact the demonstration team.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-xl mx-auto px-6 py-24">
        <div className="section-label mb-6">Sign in</div>
        <h1 className="display-serif text-4xl mb-6">Magic link sign-in.</h1>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Access to the demonstrations is via a magic link sent after approval.
          Open the link from the email we sent to sign in. Sessions persist for
          30 days.
        </p>
        <Link href="/lloyds/request-access" className="btn-primary">
          Request access →
        </Link>
      </div>
    </section>
  );
}
