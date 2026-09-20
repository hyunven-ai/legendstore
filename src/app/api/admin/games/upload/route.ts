import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

// POST /api/admin/games/upload
// Body: FormData { file: File, slug: string }

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slug = (formData.get("slug") as string | null)?.trim();

    if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    if (!slug)  return NextResponse.json({ error: "Slug game diperlukan" }, { status: 400 });

    // Validate image type
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Format file tidak didukung. Gunakan PNG, JPG, atau WebP" }, { status: 400 });
    }

    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 2MB" }, { status: 400 });
    }

    const ext      = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
    const filename = `games/${slug}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    let coverUrl: string;

    // 1. Coba upload ke Cloudflare R2 jika dikonfigurasi
    const { isR2Configured, uploadToR2 } = await import("@/lib/r2");
    if (isR2Configured) {
      const res = await uploadToR2({
        key: filename,
        buffer,
        contentType: file.type,
      });
      coverUrl = res.url;
    } else {
      // 2. Fallback ke Supabase Storage
      const db = createServerSupabase();
      const { error: uploadError } = await db.storage
        .from("game-assets")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        return NextResponse.json({ error: "Gagal mengupload ke storage: " + uploadError.message }, { status: 500 });
      }

      const { data: urlData } = db.storage.from("game-assets").getPublicUrl(filename);
      coverUrl = urlData.publicUrl;
    }

    const db = createServerSupabase();

    // Update Supabase DB
    try {
      await db.from("games").update({ cover: coverUrl }).eq("slug", slug);
    } catch { /* ignore DB update errors, cover will be saved during handleSave */ }

    return NextResponse.json({
      success: true,
      cover: coverUrl,
      coverBust: `${coverUrl}?v=${Date.now()}`,
      filename,
    });
  } catch (err) {
    console.error("Upload game image error:", err);
    return NextResponse.json({ error: "Gagal mengupload gambar" }, { status: 500 });
  }
}
