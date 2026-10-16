import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body || {};

    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, error: "Invalid amount. Minimum amount is 100 paise (₹1)." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";

    // Call Fastify backend
    try {
      const res = await fetch(`${backendUrl}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, receipt, notes }),
      });

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (backendError: any) {
      // Fallback directly to Razorpay API if backend service is unreachable
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        return NextResponse.json(
          { success: false, error: "Backend unreachable and server Razorpay credentials not found." },
          { status: 500 }
        );
      }

      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency: (currency || "INR").toUpperCase(),
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {},
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        return NextResponse.json(
          { success: false, error: rzpData.error?.description || "Razorpay API error" },
          { status: rzpRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        order_id: rzpData.id,
        id: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        key_id: keyId,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
