import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email harus diisi" },
        { status: 400 }
      );
    }

    // Check rate limit by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateCheck = await checkRateLimit(
      `forgot:${ip}`,
      "forgotPassword"
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

    // Check if admin exists with this email
    const admin = await prisma.admin.findUnique({ where: { email } });

    // Always return success even if email not found (security best practice)
    if (!admin) {
      return NextResponse.json({
        success: true,
        message:
          "Jika email terdaftar, link reset password akan dikirim ke email Anda.",
      });
    }

    // Generate reset token
    const rawToken = crypto.randomUUID();
    const hashedToken = await bcrypt.hash(rawToken, 10);

    // Delete old tokens
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        id: crypto.randomUUID(),
        email,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email
    await sendPasswordResetEmail(email, rawToken);

    return NextResponse.json({
      success: true,
      message:
        "Jika email terdaftar, link reset password akan dikirim ke email Anda.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}