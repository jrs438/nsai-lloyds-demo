import { cookies } from "next/headers";
import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "nsai_session";
const SESSION_DURATION_DAYS = 30;
const MAGIC_LINK_DURATION_DAYS = 30;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateMagicLinkToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + MAGIC_LINK_DURATION_DAYS);
  return { token, tokenHash, expiresAt };
}

export interface SessionPayload {
  email: string;
  name?: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const jwt = await new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSecret());

  return jwt;
}

export async function setSessionCookie(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

  // COOKIE_DOMAIN=.nsai4insurance.com in Production enables SSO across
  // both apex and the lloyds subdomain. Leave unset in Preview / dev.
  const domain = process.env.COOKIE_DOMAIN || undefined;

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain,
    expires,
  });
}

export async function clearSessionCookie() {
  const domain = process.env.COOKIE_DOMAIN || undefined;
  cookies().delete({ name: SESSION_COOKIE_NAME, path: "/", domain });
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
