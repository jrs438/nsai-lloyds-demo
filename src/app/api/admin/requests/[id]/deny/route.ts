import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, accessRequests } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(accessRequests)
    .set({ status: "denied" })
    .where(eq(accessRequests.id, params.id));

  return NextResponse.json({ ok: true });
}
