import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// POST /api/products/renumber — admin only
export async function POST() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const products = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    await prisma.$transaction(
      products.map((product, index) =>
        prisma.product.update({
          where: { id: product.id },
          data: { sortOrder: index + 1, updatedAt: new Date() },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diurutkan ulang",
    });
  } catch (error) {
    console.error("POST /api/products/renumber error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengurutkan ulang produk" },
      { status: 500 }
    );
  }
}