"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  CheckCircle2,
  RefreshCw,
  Truck,
  Star,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { waLink } from "@/lib/site";
import { useAuth } from "@/lib/auth";
import { GoogleReviewModal } from "@/components/notifications/GoogleReviewModal";
import { SocialFollowModal } from "@/components/notifications/SocialFollowModal";

interface OrderItem {
  id: string;
  orderNumber: string;
  amount: number;
  status: "Order Placed" | "Processing" | "Dispatched" | string;
  paymentStatus?: string;
  items: Array<{
    name: string;
    color: string;
    size: string;
    qty: number;
    unitPrice: number;
    frontPreviewUrl?: string;
    backPreviewUrl?: string;
    image?: string;
    customNote?: string;
  }>;
  shippingAddress?: any;
  trackingId?: string | null;
  courierName?: string | null;
  statusUpdatedAt?: string | null;
  reviewStatus?: "Review Requested" | "Review Pending" | "Review Acknowledged" | string;
  internalRating?: number | null;
  reviewDismissedAt?: string | null;
  socialDismissed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function OrdersView() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [activeReviewOrder, setActiveReviewOrder] = useState<OrderItem | null>(null);
  // Social follow modal state
  const [activeSocialOrder, setActiveSocialOrder] = useState<OrderItem | null>(null);
  // Track temporarily dismissed order reviews in current browser session
  const [sessionDismissedReviews, setSessionDismissedReviews] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
    try {
      const res = await fetch(`${backendUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.orders) {
          const list: OrderItem[] = data.data.orders;
          setOrders(list);

          // Auto-trigger Google Review notification for the most recent eligible dispatched order
          // Only if not already acknowledged, not reviewed in this session, and modal is not already open
          const eligibleForReview = list.find(
            (o) =>
              o.status === "Dispatched" &&
              o.reviewStatus !== "Review Acknowledged"
          );

          if (eligibleForReview && !activeReviewOrder && !activeSocialOrder) {
            if (!sessionDismissedReviews.has(eligibleForReview.id)) {
              setActiveReviewOrder(eligibleForReview);
            }
          }
        }
      }
    } catch {
      // Silently catch fetch errors during background polling
    } finally {
      setLoading(false);
    }
  }, [token, activeReviewOrder, activeSocialOrder, sessionDismissedReviews]);

  // Initial fetch and dynamic real-time polling (every 8 seconds) so status updates reflect without page refresh
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Handler for customer submitting internal rating
  const handleSubmitRating = async (rating: number) => {
    if (!activeReviewOrder || !token) return;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
    const orderId = activeReviewOrder.id;

    try {
      await fetch(`${backendUrl}/orders/${orderId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "submit_rating",
          rating,
        }),
      });

      // Update local order state immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, reviewStatus: "Review Acknowledged", internalRating: rating }
            : o
        )
      );

      const completedOrder = activeReviewOrder;
      setActiveReviewOrder(null);

      // Immediately transition to Social Media Follow notification
      if (!completedOrder.socialDismissed) {
        setActiveSocialOrder(completedOrder);
      }
    } catch {
      setActiveReviewOrder(null);
    }
  };

  // Handler for "Review Later"
  const handleReviewLater = async () => {
    if (!activeReviewOrder) return;
    const orderId = activeReviewOrder.id;
    setSessionDismissedReviews((prev) => new Set(prev).add(orderId));
    setActiveReviewOrder(null);

    if (token) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
      fetch(`${backendUrl}/orders/${orderId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "review_later" }),
      }).catch(() => {});
    }
  };

  // Handler for closing Review modal without completing
  const handleCloseReview = () => {
    if (activeReviewOrder) {
      setSessionDismissedReviews((prev) => new Set(prev).add(activeReviewOrder.id));
    }
    setActiveReviewOrder(null);
  };

  // Handler for closing Social Media modal
  const handleCloseSocial = () => {
    if (activeSocialOrder && token) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
      fetch(`${backendUrl}/orders/${activeSocialOrder.id}/social-dismiss`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setActiveSocialOrder(null);
  };

  const renderStatusPill = (status: string) => {
    if (status === "Order Placed" || status === "PAID") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          <Clock size={11} className="text-sky-600" />
          <span>Order Placed</span>
        </span>
      );
    }
    if (status === "Processing") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          <RefreshCw size={11} className="text-amber-600 animate-spin" />
          <span>Processing</span>
        </span>
      );
    }
    if (status === "Dispatched") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          <Truck size={11} className="text-emerald-700" />
          <span>Dispatched</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
        <span>{status}</span>
      </span>
    );
  };

  return (
    <AccountShell title="Your Orders">
      {({ user }) => (
        <div className="space-y-6">
          <p className="-mt-4 text-sm text-body">
            Track your custom apparel production lifecycle, shipment updates, and order history.
          </p>

          {/* User's Isolated Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">
                  Recent Orders ({orders.length})
                </h3>
                <span className="text-[11px] text-muted flex items-center gap-1">
                  <RefreshCw size={11} className="animate-spin text-muted-foreground" />
                  <span>Real-time status sync active</span>
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-line bg-white rounded-xl shadow-xs overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    {/* Top order summary header */}
                    <div className="bg-slate-50/80 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-line flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-ink">{ord.orderNumber}</span>
                        {renderStatusPill(ord.status)}
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} /> {ord.paymentStatus || "PAID"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </span>
                        <span className="font-heading font-extrabold text-sm text-[#80011F]">
                          ₹{ord.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-4">
                      {/* STEP 2: Processing Notification Banner */}
                      {ord.status === "Processing" && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center gap-2">
                            <RefreshCw size={16} className="text-amber-600 animate-spin" />
                            <h4 className="font-heading font-bold text-sm sm:text-base text-amber-950">
                              Your Order Is Being Processed!
                            </h4>
                          </div>
                          <p className="text-xs sm:text-[13px] text-amber-900 leading-relaxed">
                            Your order has been confirmed and is currently being prepared by our TeesZone team. We will notify you once your order is dispatched.
                          </p>
                          <div className="pt-2 border-t border-amber-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-amber-950">
                            <div>
                              <span className="text-amber-700 block text-[10px] uppercase font-semibold">Order ID</span>
                              <span className="font-bold">{ord.orderNumber}</span>
                            </div>
                            <div>
                              <span className="text-amber-700 block text-[10px] uppercase font-semibold">Payment Status</span>
                              <span className="font-bold">{ord.paymentStatus || "PAID"}</span>
                            </div>
                            <div>
                              <span className="text-amber-700 block text-[10px] uppercase font-semibold">Current Status</span>
                              <span className="font-bold">Processing</span>
                            </div>
                            <div>
                              <span className="text-amber-700 block text-[10px] uppercase font-semibold">Last Update</span>
                              <span className="font-bold">
                                {ord.statusUpdatedAt
                                  ? new Date(ord.statusUpdatedAt).toLocaleTimeString("en-IN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Recently"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: Dispatched Notification Banner */}
                      {ord.status === "Dispatched" && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2.5 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck size={18} className="text-emerald-700" />
                              <h4 className="font-heading font-bold text-sm sm:text-base text-emerald-950">
                                Your Order Has Been Dispatched!
                              </h4>
                            </div>
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                              In Transit
                            </span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-emerald-900 leading-relaxed">
                            Great news! Your TeesZone order has been successfully dispatched. Thank you for choosing TeesZone.
                          </p>

                          {/* Tracking Details if available */}
                          {(ord.courierName || ord.trackingId) && (
                            <div className="bg-white/90 border border-emerald-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                              {ord.courierName && (
                                <div>
                                  <span className="text-muted text-[10px] block uppercase font-bold">Courier Partner</span>
                                  <span className="font-bold text-ink">{ord.courierName}</span>
                                </div>
                              )}
                              {ord.trackingId && (
                                <div>
                                  <span className="text-muted text-[10px] block uppercase font-bold">Tracking ID</span>
                                  <span className="font-mono font-bold text-[#80011F]">{ord.trackingId}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-emerald-950">
                            <div>
                              <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Order ID</span>
                              <span className="font-bold">{ord.orderNumber}</span>
                            </div>
                            <div>
                              <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Payment Status</span>
                              <span className="font-bold">{ord.paymentStatus || "PAID"}</span>
                            </div>
                            <div>
                              <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Order Status</span>
                              <span className="font-bold">Dispatched</span>
                            </div>
                            <div>
                              <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Last Update</span>
                              <span className="font-bold">
                                {ord.statusUpdatedAt
                                  ? new Date(ord.statusUpdatedAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                    })
                                  : "Recently"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Google Review Banner / Action Area for Dispatched Orders */}
                      {ord.status === "Dispatched" && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#80011F] text-amber-300 shrink-0">
                              <Star size={16} className="fill-amber-300 text-amber-300" />
                            </div>
                            <div>
                              <p className="font-heading font-bold text-xs sm:text-sm text-ink">
                                {ord.reviewStatus === "Review Acknowledged"
                                  ? "Thank you for your feedback!"
                                  : "We value your experience!"}
                              </p>
                              <p className="text-[11px] text-body">
                                {ord.reviewStatus === "Review Acknowledged"
                                  ? `You rated this order ⭐ ${ord.internalRating || 5}/5. We appreciate your support!`
                                  : "Share a 2-minute review on Google to help us improve."}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveReviewOrder(ord)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#80011F] hover:bg-[#680119] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer whitespace-nowrap self-end sm:self-auto"
                          >
                            <Star size={12} className="fill-amber-300 text-amber-300" />
                            <span>
                              {ord.reviewStatus === "Review Acknowledged"
                                ? "View / Update Review"
                                : "Write Google Review"}
                            </span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      )}

                      {/* Purchased Products List */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
                          Product Specifications ({ord.items?.length || 0})
                        </span>
                        <div className="divide-y divide-line/60 border border-line/60 rounded-lg overflow-hidden bg-white">
                          {(ord.items || []).map((it, idx) => {
                            const previewImg = it.frontPreviewUrl || it.image;
                            return (
                              <div
                                key={idx}
                                className="p-3 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  {previewImg ? (
                                    <div className="relative h-10 w-10 rounded border border-line bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={previewImg}
                                        alt={it.name}
                                        className="h-full w-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center shrink-0">
                                      <Package size={18} className="text-muted" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-ink">{it.name}</p>
                                    <p className="text-[11px] text-body">
                                      Color: <span className="font-semibold">{it.color}</span> · Size:{" "}
                                      <span className="font-semibold">{it.size}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold text-ink">
                                    {it.qty} pcs × ₹{it.unitPrice}
                                  </span>
                                  <p className="font-extrabold text-[#80011F]">
                                    ₹{(it.qty * it.unitPrice).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="border border-line bg-white p-8 text-center text-muted text-sm space-y-2">
              <RefreshCw size={24} className="mx-auto animate-spin text-[#80011F]" />
              <p>Loading your orders...</p>
            </div>
          ) : null}

          {/* Help & Direct Coordination Desk */}
          <div className="border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold uppercase tracking-wide text-ink">
                    Active Production &amp; WhatsApp Tracking
                  </h2>
                  <p className="text-xs text-body">
                    Wholesale and custom manufacturing orders are coordinated directly with our factory team.
                  </p>
                </div>
              </div>
              <a
                href={waLink(`Hi TeesZone! I'd like an update on my orders for account ${user.email}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={16} />
                Chat With Order Desk
              </a>
            </div>

            <div className="pt-6 grid gap-4 sm:grid-cols-2">
              <div className="border border-line/60 bg-bg p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Customer Account</span>
                <p className="mt-1 text-sm font-semibold text-ink">{user.name || "Customer"}</p>
                <p className="text-xs text-body">{user.email}</p>
                {user.phone && <p className="text-xs text-body">{user.phone}</p>}
              </div>

              <div className="border border-line/60 bg-bg p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Need a New Quote or Bulk Order?</span>
                <p className="mt-1 text-xs text-body">
                  Configure samples, bulk apparel, or view your current cart and saved items.
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                  >
                    Browse Catalog <ArrowRight size={12} />
                  </Link>
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-1 text-xs font-bold text-body hover:text-ink"
                  >
                    View Cart <ShoppingBag size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Google Review Modal */}
          {activeReviewOrder && (
            <GoogleReviewModal
              isOpen={Boolean(activeReviewOrder)}
              orderId={activeReviewOrder.id}
              orderNumber={activeReviewOrder.orderNumber}
              onClose={handleCloseReview}
              onReviewLater={handleReviewLater}
              onSubmitRating={handleSubmitRating}
            />
          )}

          {/* Social Follow Modal */}
          {activeSocialOrder && (
            <SocialFollowModal
              isOpen={Boolean(activeSocialOrder)}
              orderNumber={activeSocialOrder.orderNumber}
              onClose={handleCloseSocial}
            />
          )}
        </div>
      )}
    </AccountShell>
  );
}
