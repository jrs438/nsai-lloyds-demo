import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "nsai_session";
const ADMIN_COOKIE = "nsai_admin";

async function verify(token: string | undefined): Promise<unknown | null> {
  if (!token) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload;
  } catch {
    return null;
  }
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  // Either a regular user session OR an admin session grants access.
  const userPayload = await verify(req.cookies.get(SESSION_COOKIE)?.value);
  if (userPayload) return true;

  const adminPayload = await verify(req.cookies.get(ADMIN_COOKIE)?.value);
  if (adminPayload && (adminPayload as { admin?: boolean }).admin === true) {
    return true;
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPath =
    pathname.startsWith("/lloyds/demos") ||
    pathname.startsWith("/lloyds/positioning");

  if (!protectedPath) {
    return NextResponse.next();
  }

  if (await isAuthenticated(req)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/lloyds/signin";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/lloyds/demos/:path*", "/lloyds/positioning/:path*"],
};
