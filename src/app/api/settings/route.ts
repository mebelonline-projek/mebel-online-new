import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, updateSettings } from "@/lib/site-config";
import { requireAdmin } from "@/lib/api-auth";
import { deleteFromSupabase } from "@/lib/upload";

const IMAGE_KEYS = ["logo", "heroImage", "aboutImage"];

// GET /api/settings — public (for landing page)
export async function GET() {
  try {
    const settings = await getAllSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil pengaturan" },
      { status: 500 }
    );
  }
}

// PUT /api/settings — admin only
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const currentSettings = await getAllSettings();

    // Handle image deletions
    for (const key of IMAGE_KEYS) {
      if (body[key] && body[key] !== (currentSettings as Record<string, unknown>)[key]) {
        const oldImage = (currentSettings as Record<string, unknown>)[key] as string;
        if (oldImage) {
          await deleteFromSupabase(oldImage);
        }
      }
    }

    const updated = await updateSettings(body);

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil disimpan",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}