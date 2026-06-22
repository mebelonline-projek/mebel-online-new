export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    // Match all admin routes except login, forgot-password, and reset-password
    "/admin/dashboard/:path*",
    // Also protect API routes for admin
    "/api/admin/:path*",
  ],
};