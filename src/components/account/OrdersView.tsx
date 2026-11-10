"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MessageCircle, ArrowRight, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { waLink } from "@/lib/site";
import { useAuth } from "@/lib/auth";

interface OrderItem {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  items: Array<{
    name: string;
    color: string;
    size: string;
    qty: number;
    unitPrice: number;
  }>;
  createdAt: string;
}

export function OrdersView() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
    fetch(`${backendUrl}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.orders) {
          setOrders(data.data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <AccountShell title="Your Orders">
      {({ user }) => (
        <div className="space-y-6">
          <p className="-mt-4 text-sm text-body">
            Track your custom apparel production and active wholesale shipments.
          </p>

          {/* User's Isolated Orders List */}
          {orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-ink">
                Recent Orders ({orders.length})
              </h3>
              <div className="divide-y divide-line border border-line bg-white">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink">{ord.orderNumber}</span>
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                          <CheckCircle size={11} /> {ord.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted flex items-center gap-1">
                        <Clock size={12} /> {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <div className="mt-2 text-xs text-body space-y-0.5">
                        {(ord.items || []).map((it, idx) => (
                          <p key={idx}>
                            • {it.name} ({it.color}, {it.size}) × {it.qty} pcs
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="text-right sm:self-center">
                      <span className="text-base font-extrabold text-[#80011F]">
                        ₹{ord.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold uppercase tracking-wide text-ink">
                    Active Production & WhatsApp Tracking
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
        </div>
      )}
    </AccountShell>
  );
}
