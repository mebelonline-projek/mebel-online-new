import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const { pathname } = request.nextUrl;
  const isPublicPath =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";
  const isAdminPath = pathname.startsWith("/admin");

  // Allow non-admin paths
  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Allow admin public pages
  if (isPublicPath) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify JWT using jose (Edge-compatible, no Prisma dependency)
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) {
    try {
      const secretKey = new TextEncoder().encode(secret);
      await jose.jwtDecrypt(token, secretKey);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Fallback if no NEXTAUTH_SECRET
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};