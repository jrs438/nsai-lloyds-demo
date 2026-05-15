import Link from "next/link";
import { redirect } from "next/navigation";
import { db, magicLinkTokens } from "@/lib/db";
import { hashToken, createSession, setSessionCookie } from "@/lib/auth";
import { and, eq, gt, isNull } from "drizzle-orm";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { token?: string; error?: string };
}) {
  const token = searchParams.token;

  if (token) {
    const result = await consumeToken(token);
    if (result.ok) {
      await setSessionCookie(result.session);
      redirect("/lloyds/demos");
    }
    return (
      <section>
        <div className="max-w-xl mx-auto px-6 py-24">
          <div className="section-label mb-6" style={{ color: "var(--trace-rule-failed)" }}>
            Sign-in failed
          </div>
          <h1 className="display-serif text-4xl mb-6">{result.reason}</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
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
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
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

async function consumeToken(
  token: string,
): Promise<
  | { ok: true; session: string }
  | { ok: false; reason: string }
> {
  const tokenHash = hashToken(token);
  const now = new Date();

  const rows = await db
    .select()
    .from(magicLinkTokens)
    .where(
      and(
        eq(magicLinkTokens.tokenHash, tokenHash),
        gt(magicLinkTokens.expiresAt, now),
        isNull(magicLinkTokens.usedAt),
      ),
    )
    .limit(1);

  const record = rows[0];
  if (!record) {
    return { ok: false, reason: "Link expired or already used." };
  }

  // Mark token used
  await db
    .update(magicLinkTokens)
    .set({ usedAt: now })
    .where(eq(magicLinkTokens.id, record.id));

  const sessionJwt = await createSession({ email: record.email });
  return { ok: true, session: sessionJwt };
}
