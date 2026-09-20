import { NextRequest, NextResponse } from "next/server";
import { getR2Client, isR2Configured } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!isR2Configured) {
    return new NextResponse("R2 not configured", { status: 500 });
  }

  try {
    const { path } = await params;
    const key = path.join("/");
    const client = getR2Client();
    const bucket = process.env.R2_BUCKET_NAME || "legend";

    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!response.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const byteArray = await response.Body.transformToByteArray();
    const contentType = response.ContentType || "application/octet-stream";

    return new NextResponse(Buffer.from(byteArray), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    const error = err as { name?: string };
    if (error.name === "NoSuchKey") {
      return new NextResponse("Not Found", { status: 404 });
    }
    console.error("R2 file serve error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
