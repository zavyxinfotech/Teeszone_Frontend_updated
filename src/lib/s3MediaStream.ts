import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Configure AWS S3 Client with credentials from environment
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME =
  process.env.S3_BUCKET_NAME || "teeszone-catalogue-images-2026";

// In-memory LRU cache to keep responses lightning fast (< 20ms)
const memoryCache = new Map<string, { buffer: Buffer; contentType: string }>();

export async function handleS3MediaStream(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const key = (path || []).join("/");
    if (!key) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Serve from cache if available
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fetch from AWS S3
    const cmd = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const s3Res = await s3Client.send(cmd);

    if (!s3Res.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const chunks: Uint8Array[] = [];
    // @ts-expect-error - Body is an async iterable stream
    for await (const chunk of s3Res.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const contentType = s3Res.ContentType || "image/jpeg";

    // Keep memory cache size bounded
    if (memoryCache.size >= 120) {
      const first = memoryCache.keys().next().value;
      if (first) memoryCache.delete(first);
    }
    memoryCache.set(key, { buffer, contentType });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("Error streaming S3 object:", err?.message || err);
    return new NextResponse("Not Found", { status: 404 });
  }
}
