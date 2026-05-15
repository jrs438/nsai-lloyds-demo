import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, accessRequests, magicLinkTokens } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateMagicLinkToken } from "@/lib/auth";
import { sendEmail, magicLinkEmailTemplate } from "@/lib/email";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(accessRequests)
    .where(eq(accessRequests.id, params.id))
    .limit(1);
  const req = rows[0];

  if (!req) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Update request
  await db
    .update(accessRequests)
    .set({ status: "approved", approvedAt: new Date() })
    .where(eq(accessRequests.id, params.id));

  // Generate magic link
  const { token, tokenHash, expiresAt } = generateMagicLinkToken();
  await db.insert(magicLinkTokens).values({
    email: req.email,
    tokenHash,
    expiresAt,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/api/auth/signin?token=${token}`;

  const template = magicLinkEmailTemplate({
    url,
    recipientName: req.name,
  });

  try {
    await sendEmail({ to: req.email, ...template });
  } catch (err) {
    console.error("Failed to send magic link email:", err);
    return NextResponse.json(
      { error: "Email send failed; request is approved but link not delivered" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
