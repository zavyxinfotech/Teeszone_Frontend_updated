import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
        },
        { status: 400 }
      );
    }

    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";

    // Call Fastify backend
    try {
      const res = await fetch(`${backendUrl}/payments/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }),
      });

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (backendError: any) {
      // Fallback local verification
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json(
          { success: false, error: "Razorpay secret key not configured." },
          { status: 500 }
        );
      }

      const dataToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(dataToSign)
        .digest("hex");

      const expBuf = Buffer.from(generatedSignature, "utf-8");
      const sigBuf = Buffer.from(razorpay_signature, "utf-8");
      const isSignatureValid = expBuf.length === sigBuf.length && crypto.timingSafeEqual(expBuf, sigBuf);

      if (!isSignatureValid) {
        return NextResponse.json(
          { success: false, verified: false, error: "Signature verification failed." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Payment verified successfully",
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
