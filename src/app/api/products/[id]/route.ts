import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { deleteFromSupabase } from "@/lib/upload";

// GET /api/products/[id] — public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: parseJsonArray(product.images),
        variants: parseVariants(product.variants),
      },
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] — admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      description,
      image,
      images,
      categoryId,
      isActive,
      sortOrder,
      variants,
    } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check slug uniqueness (exclude current)
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
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
          // Moving up — shift others down
          await tx.product.updateMany({
            where: {
              sortOrder: { gte: finalSortOrder, lt: oldSortOrder },
              id: { not: id },
            },
            data: { sortOrder: { increment: 1 } },
          });
        } else if (finalSortOrder > oldSortOrder) {
          // Moving down — shift others up
          await tx.product.updateMany({
            where: {
              sortOrder: { gt: oldSortOrder, lte: finalSortOrder },
              id: { not: id },
            },
            data: { sortOrder: { decrement: 1 } },
          });
        }

        await tx.product.update({
          where: { id },
          data: {
            name: name ?? existing.name,
            slug: slug ?? existing.slug,
            description: description ?? existing.description,
            image: image ?? existing.image,
            images: images ? JSON.stringify(images) : existing.images,
            categoryId: categoryId ?? existing.categoryId,
            isActive: isActive ?? existing.isActive,
            sortOrder: finalSortOrder,
            variants: variants ? JSON.stringify(variants) : existing.variants,
            updatedAt: new Date(),
          },
        });
      });
    } else {
      await prisma.product.update({
        where: { id },
        data: {
          name: name ?? existing.name,
          slug: slug ?? existing.slug,
          description: description ?? existing.description,
          image: image ?? existing.image,
          images: images ? JSON.stringify(images) : existing.images,
          categoryId: categoryId ?? existing.categoryId,
          isActive: isActive ?? existing.isActive,
          sortOrder: finalSortOrder,
          variants: variants ? JSON.stringify(variants) : existing.variants,
          updatedAt: new Date(),
        },
      });
    }

    // Delete old image if changed
    if (image && image !== existing.image) {
      await deleteFromSupabase(existing.image || "");
    }

    const updated = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui",
      data: {
        ...updated,
        images: parseJsonArray(updated?.images),
        variants: parseVariants(updated?.variants),
      },
    });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui produk" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete images from Supabase
    if (product.image) {
      await deleteFromSupabase(product.image);
    }

    const imagesArray = parseJsonArray(product.images);
    for (const img of imagesArray) {
      await deleteFromSupabase(img);
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseVariants(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}