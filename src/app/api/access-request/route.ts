import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db, accessRequests, magicLinkTokens } from "@/lib/db";
import {
  sendEmail,
  adminNotificationTemplate,
  magicLinkEmailTemplate,
} from "@/lib/email";
import { generateMagicLinkToken } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  role: z.string().min(2),
  notes: z.string().optional(),
});

function getOriginFromRequest(req: Request): string {
  // Prefer the actual request origin so magic links land where the
  // requester is browsing (production, preview, or local).
  try {
    const url = new URL(req.url);
    return url.origin;
  } catch {
    return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, company, role, notes } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const origin = getOriginFromRequest(req);

    // If this email already has an approved request, just issue a new
    // magic link directly — no admin re-approval needed.
    const existing = await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.email, normalizedEmail))
      .orderBy(desc(accessRequests.requestedAt))
      .limit(1);

    const prior = existing[0];

    if (prior?.status === "approved") {
      await issueMagicLink({
        email: normalizedEmail,
        name: prior.name,
        origin,
      });
      return NextResponse.json({ ok: true, mode: "reissued" });
    }

    if (prior?.status === "pending") {
      return NextResponse.json({ ok: true, mode: "already-pending" });
    }

    const [request] = await db
      .insert(accessRequests)
      .values({
        name,
        email: normalizedEmail,
        company,
        role,
        notes: notes ?? null,
        status: "pending",
      })
      .returning();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const template = adminNotificationTemplate({
        request: {
          id: request.id,
          email: request.email,
          name: request.name,
          company: request.company,
          role: request.role,
          notes: request.notes,
        },
        adminUrl: `${origin}/lloyds/admin`,
      });
      try {
        await sendEmail({ to: adminEmail, ...template });
      } catch (err) {
        console.error("Failed to send admin notification:", err);
      }
    }

    return NextResponse.json({ ok: true, mode: "new" });
  } catch (err) {
    console.error("Access request error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function issueMagicLink({
  email,
  name,
  origin,
}: {
  email: string;
  name: string;
  origin: string;
}) {
  const { token, tokenHash, expiresAt } = generateMagicLinkToken();
  await db.insert(magicLinkTokens).values({
    email,
    tokenHash,
    expiresAt,
  });

  const url = `${origin}/api/auth/signin?token=${token}`;
  const template = magicLinkEmailTemplate({ url, recipientName: name });

  try {
    await sendEmail({ to: email, ...template });
  } catch (err) {
    console.error("Failed to send magic link:", err);
  }
}
