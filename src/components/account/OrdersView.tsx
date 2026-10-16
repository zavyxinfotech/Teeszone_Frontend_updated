"use client";

import Link from "next/link";
import { Package, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { waLink } from "@/lib/site";

export function OrdersView() {
  return (
    <AccountShell title="Your Orders">
      {({ user }) => (
        <div className="space-y-6">
          <p className="-mt-4 text-sm text-body">
            Track your custom apparel production and active wholesale shipments.
          </p>

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
