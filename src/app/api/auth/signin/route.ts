import { NextResponse, type NextRequest } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, magicLinkTokens } from "@/lib/db";
import {
  hashToken,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

function errorRedirect(req: NextRequest, reason: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/lloyds/signin";
  url.searchParams.delete("token");
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return errorRedirect(req, "missing-token");
  }

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
    return errorRedirect(req, "expired-or-used");
  }

  await db
    .update(magicLinkTokens)
    .set({ usedAt: now })
    .where(eq(magicLinkTokens.id, record.id));

  const jwt = await createSession({ email: record.email });
  await setSessionCookie(jwt);

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/lloyds/demos";
  redirectUrl.search = "";
  return NextResponse.redirect(redirectUrl);
}
