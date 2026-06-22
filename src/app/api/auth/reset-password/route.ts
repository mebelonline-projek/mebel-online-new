import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Token dan password baru harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    // Check rate limit by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateCheck = await checkRateLimit(
      `reset:${ip}`,
      "resetPassword"
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
        },
        { status: 429 }
      );
    }

    // Get all valid (non-expired) tokens
    const storedTokens = await prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() } },
    });

    if (storedTokens.length === 0) {
      return NextResponse.json(
        { success: false, error: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // Find matching token by comparing bcrypt hashes
    let matchedToken = null;
    for (const stored of storedTokens) {
      const isValid = await bcrypt.compare(token, stored.token);
      if (isValid) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      return NextResponse.json(
        { success: false, error: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.admin.update({
      where: { email: matchedToken.email },
      data: { password: hashedPassword, updatedAt: new Date() },
    });

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { id: matchedToken.id },
    });

    // Clean up any other tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: matchedToken.email },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil direset. Silakan login dengan password baru.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}