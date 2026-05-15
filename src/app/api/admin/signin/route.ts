import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSession,
  setAdminCookie,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: string;
  };

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }

  const token = await createAdminSession();
  await setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
