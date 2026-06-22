import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")?.value;

  const { pathname } = request.nextUrl;
  const isPublicPath =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";
  const isAdminPath = pathname.startsWith("/admin");

  if (!isAdminPath) return NextResponse.next();
  if (isPublicPath) return NextResponse.next();
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};