import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// POST /api/categories/renumber — admin only
export async function POST() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    await prisma.$transaction(
      categories.map((category, index) =>
        prisma.category.update({
          where: { id: category.id },
          data: { sortOrder: index + 1, updatedAt: new Date() },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diurutkan ulang",
    });
  } catch (error) {
    console.error("POST /api/categories/renumber error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengurutkan ulang kategori" },
      { status: 500 }
    );
  }
}