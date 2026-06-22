import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// GET /api/products — public (landing page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // If requesting all (including inactive), require auth
    if (all) {
      const authError = await requireAdmin();
      if (authError) return authError;
    }

    const where: Record<string, unknown> = {};

    if (!all) {
      where.isActive = true;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          Category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const parsedProducts = products.map((p) => ({
      ...p,
      images: parseJsonArray(p.images),
      variants: parseVariants(p.variants),
    }));

    return NextResponse.json({
      success: true,
      data: parsedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

// POST /api/products — admin only
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
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

    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Nama, slug, dan kategori harus diisi" },
        { status: 400 }
      );
    }

    // Check unique slug
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "Slug sudah digunakan" },
        { status: 400 }
      );
    }

    // Auto-fill sortOrder
    let finalSortOrder = sortOrder;
    if (!finalSortOrder || finalSortOrder === 0) {
      const maxOrder = await prisma.product.aggregate({
        _max: { sortOrder: true },
      });
      finalSortOrder = (maxOrder._max.sortOrder || 0) + 1;
    }

    const product = await prisma.product.create({
      data: {
        id: crypto.randomUUID(),
        name,
        slug,
        description: description || "",
        image: image || "",
        images: images ? JSON.stringify(images) : "[]",
        categoryId,
        isActive: isActive ?? true,
        sortOrder: finalSortOrder,
        variants: variants ? JSON.stringify(variants) : "[]",
      },
      include: {
        Category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan",
        data: {
          ...product,
          images: parseJsonArray(product.images),
          variants: parseVariants(product.variants),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan produk" },
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