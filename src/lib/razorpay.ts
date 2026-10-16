export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CheckoutOptions {
  amountInRupees: number;
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  notes?: Record<string, string>;
  onSuccess?: (response: {
    payment_id: string;
    order_id: string;
    signature?: string;
  }) => void;
  onFailure?: (error: string) => void;
  onDismiss?: () => void;
}

// Ensure Razorpay SDK script is loaded
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  amountInRupees,
  user,
  notes,
  onSuccess,
  onFailure,
  onDismiss,
}: CheckoutOptions) {
  try {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
    }

    const amountInPaise = Math.round(amountInRupees * 100);
    if (amountInPaise < 100) {
      throw new Error("Order amount must be at least ₹1.");
    }

    // STEP 1: Call create-order endpoint to generate a secure Razorpay order_id
    const createRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const orderData = await createRes.json().catch(() => ({}));

    if (!createRes.ok || (!orderData.order_id && !orderData.id)) {
      const errorMsg =
        orderData.error ||
        orderData.message ||
        `Server returned ${createRes.status}: Unable to create Razorpay order. Please verify Razorpay API credentials.`;
      throw new Error(errorMsg);
    }

    const orderId: string = orderData.order_id || orderData.id;
    const orderAmount: number = orderData.amount || amountInPaise;
    const orderCurrency: string = orderData.currency || "INR";
    const razorpayKey =
      orderData.key_id ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    // STEP 2: Open Razorpay Checkout modal
    const options: any = {
      key: razorpayKey,
      amount: orderAmount,
      currency: orderCurrency,
      name: "TeesZone",
      description: "Custom Apparel Order Payment",
      order_id: orderId,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: {
        color: "#D92D20",
      },
      handler: async function (response: RazorpayPaymentSuccessResponse) {
        try {
          if (response.razorpay_signature && response.razorpay_order_id) {
            // STEP 3: Verify Signature on Backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.verified) {
              onSuccess?.({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
            } else {
              onFailure?.(verifyData.error || "Payment verification failed. Invalid signature.");
            }
          } else {
            // Direct payment without backend order signature
            onSuccess?.({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id || "direct_checkout",
            });
          }
        } catch (verifyErr: any) {
          onFailure?.(verifyErr.message || "Failed to verify payment with server.");
        }
      },
      modal: {
        ondismiss: function () {
          onDismiss?.();
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      const desc =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment could not be completed.";
      onFailure?.(desc);
    });

    rzp.open();
  } catch (err: any) {
    onFailure?.(err.message || "An unexpected error occurred during checkout.");
  }
}
