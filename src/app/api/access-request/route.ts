import { NextResponse } from "next/server";
import { z } from "zod";
import { db, accessRequests } from "@/lib/db";
import { sendEmail, adminNotificationTemplate } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  role: z.string().min(2),
  notes: z.string().optional(),
});

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

    const [request] = await db
      .insert(accessRequests)
      .values({
        name,
        email: email.toLowerCase(),
        company,
        role,
        notes: notes ?? null,
        status: "pending",
      })
      .returning();

    // Notify admin (don't fail request if email fails)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const template = adminNotificationTemplate({
        request: {
          id: request.id,
          email: request.email,
          name: request.name,
          company: request.company,
          role: request.role,
          notes: request.notes,
        },
        adminUrl: `${baseUrl}/lloyds/admin`,
      });
      try {
        await sendEmail({ to: adminEmail, ...template });
      } catch (err) {
        console.error("Failed to send admin notification:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Access request error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
