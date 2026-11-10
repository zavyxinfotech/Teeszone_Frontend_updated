"use client";

const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4010/api";

export type ActivityType =
  | "LOGIN"
  | "REGISTER"
  | "CART_ADD"
  | "CART_REMOVE"
  | "CART_QTY"
  | "CART_CLEAR"
  | "WISHLIST_ADD"
  | "WISHLIST_REMOVE"
  | "CUSTOMIZE_PRODUCT"
  | "LOGO_UPLOAD"
  | "DESIGN_SAVE"
  | "CHECKOUT_START"
  | "ORDER_PLACED"
  | "PAYMENT_SUCCESS"
  | "ENQUIRY_SUBMIT";

export interface LogActivityParams {
  activityType: ActivityType;
  productId?: string;
  productName?: string;
  orderId?: string;
  status?: string;
  details?: Record<string, unknown>;
  userName?: string;
  userEmail?: string;
}

/**
 * Centrally log customer activity for administrative monitoring.
 * Runs non-blocking in background with zero UI delay.
 */
export async function logCustomerActivity(params: LogActivityParams): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const token = localStorage.getItem("teeszone-token-v1");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    await fetch(`${CLIENT_API_URL}/activity`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        activityType: params.activityType,
        productId: params.productId || null,
        productName: params.productName || null,
        orderId: params.orderId || null,
        status: params.status || "COMPLETED",
        details: params.details || null,
        userName: params.userName || null,
        userEmail: params.userEmail || null,
      }),
    });
  } catch {
    // Fail silently in background to preserve smooth customer experience
  }
}
