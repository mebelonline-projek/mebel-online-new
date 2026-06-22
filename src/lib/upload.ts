const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = "furniture-images";

export async function uploadToSupabase(
  file: File,
  folder: string = "products"
): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const fileName = `${folder}/${crypto.randomUUID()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: file,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { url: "", error: `Upload failed: ${errorText}` };
    }

    const { data: publicUrlData } = await fetch(
      `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`,
      { method: "GET" }
    ).then(() => ({
      data: { publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}` },
    }));

    return {
      url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { url: "", error: "Gagal mengupload gambar" };
  }
}

export async function deleteFromSupabase(
  url: string
): Promise<{ success: boolean; error?: string }> {
  if (!url || !url.includes(SUPABASE_URL)) {
    return { success: true }; // Not a Supabase URL, skip
  }

  try {
    // Extract file path from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/object/public/${BUCKET_NAME}/`);

    if (pathParts.length < 2) {
      return { success: true };
    }

    const filePath = pathParts[1];

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filePath}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Delete warning:", errorText);
      // Don't fail if file doesn't exist
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Gagal menghapus gambar" };
  }
}

export async function uploadBase64Image(
  base64Data: string,
  fileName: string,
  folder: string = "products"
): Promise<{ url: string; error?: string }> {
  try {
    const base64Content = base64Data.split(",")[1] || base64Data;
    const buffer = Buffer.from(base64Content, "base64");

    const filePath = `${folder}/${fileName}`;

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filePath}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "content-type": "image/jpeg",
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { url: "", error: `Upload failed: ${errorText}` };
    }

    return {
      url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`,
    };
  } catch (error) {
    console.error("Upload base64 error:", error);
    return { url: "", error: "Gagal mengupload gambar" };
  }
}