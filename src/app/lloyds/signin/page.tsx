import Link from "next/link";
import { AccessCodeForm } from "./AccessCodeForm";

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
  const sharedAccessEnabled = !!process.env.ACCESS_CODE_HASH;

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
          {sharedAccessEnabled && (
            <div className="mt-12 pt-8 border-t border-subtle">
              <div className="section-label mb-3">Have an access code?</div>
              <AccessCodeForm />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-xl mx-auto px-6 py-24">
        <div className="section-label mb-6">Sign in</div>
        <h1 className="display-serif text-4xl mb-6">Sign in.</h1>
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

        {sharedAccessEnabled && (
          <div className="mt-12 pt-8 border-t border-subtle">
            <div className="section-label mb-2">Have an access code?</div>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              If you were given a shared access code, enter it below to view the
              demonstrations.
            </p>
            <AccessCodeForm />
          </div>
        )}
      </div>
    </section>
  );
}
