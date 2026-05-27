import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const hash = process.env.ACCESS_CODE_HASH;
  if (!hash) {
    return NextResponse.json(
      { error: "Shared access is not enabled" },
      { status: 503 },
    );
  }

  const valid = await bcrypt.compare(code.trim(), hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  const jwt = await createSession({
    email: "shared-access@nsai4insurance.com",
    name: "Shared access",
  });
  await setSessionCookie(jwt);

  return NextResponse.json({ ok: true });
}
