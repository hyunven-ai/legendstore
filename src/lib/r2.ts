import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "legend";
const endpoint =
  process.env.R2_ENDPOINT ||
  (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");

// Cek apakah konfigurasi R2 lengkap
export const isR2Configured = Boolean(
  endpoint && accessKeyId && secretAccessKey && bucketName
);

let r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!r2Client) {
    if (!isR2Configured) {
      throw new Error("Cloudflare R2 is not configured in environment variables.");
    }
    r2Client = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    });
  }
  return r2Client;
}

/**
 * Mendapatkan Public URL untuk file yang di-upload ke R2.
 * Jika NEXT_PUBLIC_R2_PUBLIC_URL didefinisikan (misal: https://pub-xxx.r2.dev atau https://cdn.legendstore.com),
 * URL publik tersebut akan dipakai. Jika belum disetel, fallback ke route serve internal /api/r2/[...path].
 */
export function getR2PublicUrl(key: string): string {
  const cleanKey = key.replace(/^\/+/, "");
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (publicBase) {
    return `${publicBase}/${cleanKey}`;
  }
  // Fallback: layani via endpoint Next.js (gunakan relative path agar aman di semua host/port)
  return `/api/r2/${cleanKey}`;
}

/**
 * Upload file/buffer ke Cloudflare R2
 */
export async function uploadToR2({
  key,
  buffer,
  contentType,
}: {
  key: string;
  buffer: Buffer | Uint8Array;
  contentType: string;
}): Promise<{ key: string; url: string }> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return {
    key: cleanKey,
    url: getR2PublicUrl(cleanKey),
  };
}

/**
 * Hapus file dari Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured) return false;
  try {
    const client = getR2Client();
    const cleanKey = key.replace(/^\/+/, "");
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      })
    );
    return true;
  } catch (err) {
    console.error("Error deleting from R2:", err);
    return false;
  }
}
