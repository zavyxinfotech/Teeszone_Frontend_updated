import { NextRequest } from "next/server";
import { handleS3MediaStream } from "@/lib/s3MediaStream";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleS3MediaStream(req, context);
}
