import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// GET /api/categories — public
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { Product: true } },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}

// POST /api/categories — admin only
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, slug, description, image, sortOrder } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Nama dan slug harus diisi" },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan" },
        { status: 400 }
      );
    }

    let finalSortOrder = sortOrder;
    if (!finalSortOrder || finalSortOrder === 0) {
      const maxOrder = await prisma.category.aggregate({
        _max: { sortOrder: true },
      });
      finalSortOrder = (maxOrder._max.sortOrder || 0) + 1;
    }

    const category = await prisma.category.create({
      data: {
        id: crypto.randomUUID(),
        name,
        slug,
        description: description || "",
        image: image || "",
        sortOrder: finalSortOrder,
      },
    });

    return NextResponse.json(
      { success: true, message: "Kategori berhasil ditambahkan", data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan kategori" },
      { status: 500 }
    );
  }
}

// PUT /api/categories — admin only
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, name, slug, description, image, sortOrder } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Slug sudah digunakan" },
          { status: 400 }
        );
      }
    }

    // Handle sortOrder renumbering
    let finalSortOrder = sortOrder ?? existing.sortOrder;
    const oldSortOrder = existing.sortOrder;

    if (finalSortOrder !== oldSortOrder) {
      await prisma.$transaction(async (tx) => {
        if (finalSortOrder < oldSortOrder) {
          await tx.category.updateMany({
            where: {
              sortOrder: { gte: finalSortOrder, lt: oldSortOrder },
              id: { not: id },
            },
            data: { sortOrder: { increment: 1 } },
          });
        } else if (finalSortOrder > oldSortOrder) {
          await tx.category.updateMany({
            where: {
              sortOrder: { gt: oldSortOrder, lte: finalSortOrder },
              id: { not: id },
            },
            data: { sortOrder: { decrement: 1 } },
          });
        }

        await tx.category.update({
          where: { id },
          data: {
            name: name ?? existing.name,
            slug: slug ?? existing.slug,
            description: description ?? existing.description,
            image: image ?? existing.image,
            sortOrder: finalSortOrder,
            updatedAt: new Date(),
          },
        });
      });
    } else {
      await prisma.category.update({
        where: { id },
        data: {
          name: name ?? existing.name,
          slug: slug ?? existing.slug,
          description: description ?? existing.description,
          image: image ?? existing.image,
          sortOrder: finalSortOrder,
          updatedAt: new Date(),
        },
      });
    }

    const updated = await prisma.category.findUnique({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories — admin only
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Kategori "${category.name}" memiliki ${productCount} produk. Pindahkan atau hapus produk terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}