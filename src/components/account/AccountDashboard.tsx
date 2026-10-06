"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  KeyRound,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/lib/auth";
import { waLink } from "@/lib/site";

const cards = [
  {
    icon: Package,
    title: "Your Orders",
    text: "Orders currently confirm over WhatsApp — history lands here with online checkout.",
    href: waLink("Hi TeesZone! I'd like an update on my order."),
    external: true,
  },
  {
    icon: KeyRound,
    title: "Login & Security",
    text: "Edit your name, phone and password; see linked sign-in methods.",
    href: "/account/security",
  },
  {
    icon: MapPin,
    title: "Your Addresses",
    text: "Add, edit and choose the default delivery address.",
    href: "/account/addresses",
  },
  {
    icon: Heart,
    title: "Your Wishlist",
    text: "Products you've saved for later.",
    href: "/wishlist",
  },
  {
    icon: ShoppingBag,
    title: "Your Cart",
    text: "Pick up where you left off with your bulk order.",
    href: "/cart",
  },
  {
    icon: MessageCircle,
    title: "Help & Support",
    text: "Wholesale enquiries, quotes and anything else — talk to us.",
    href: "/contact",
  },
];

export function AccountDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <AccountShell>
      {({ user }) => (
        <>
          <p className="-mt-4 mb-8 text-sm text-body">
            Hi <span className=" text-ink">{user.name || user.email}</span> — manage
            your details, addresses and saved products here.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) =>
              card.external ? (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md motion-reduce:hover:translate-y-0"
                >
                  <card.icon size={26} className="shrink-0 text-accent" />
                  <div>
                    <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink group-hover:text-accent">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-body">{card.text}</p>
                  </div>
                </a>
              ) : (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex gap-4 border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md motion-reduce:hover:translate-y-0"
                >
                  <card.icon size={26} className="shrink-0 text-accent" />
                  <div>
                    <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink group-hover:text-accent">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-body">{card.text}</p>
                  </div>
                </Link>
              ),
            )}
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-body transition-colors hover:text-accent"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </>
      )}
    </AccountShell>
  );
}
