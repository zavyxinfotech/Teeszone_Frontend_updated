"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, CircleUserRound, Heart, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import type { Collection, Segment } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

// nav underline
const topLink =
  "relative flex items-center gap-1 px-4 py-5 text-sm  uppercase tracking-wide transition-colors hover:text-accent after:absolute after:bottom-3.5 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100 motion-reduce:after:transition-none";

const useCaseLinks = [
  { label: "Corporate", href: "/products/mens-polo-half-sleeve-240" },
  { label: "Schools", href: "/products/kids-rn-half-180" },
  { label: "Sports Teams", href: "/products/aerosoft-polo-200" },
  { label: "Events & Merch", href: "/products/mens-oversize-french-terry-240" },
];

const featuredBySegment: Record<string, string> = {
  men: "/products/crew-black.svg",
  women: "/products/crew-white.svg",
  kids: "/products/jersey-red.svg",
  hoodies: "/products/crew-black.svg",
};

function getCategoryHref(segSlug: string, groupTitle: string): string {
  const t = groupTitle.toLowerCase();
  if (t.includes("polo")) return "/products?category=polo-t-shirts";
  if (t.includes("oversize")) return "/products?category=oversize-t-shirts";
  if (t.includes("round neck")) {
    if (segSlug === "women") return "/products?category=women";
    if (segSlug === "kids") return "/products?category=kids";
    return "/products?category=round-neck-t-shirts";
  }
  if (t.includes("unisex")) return "/products?category=unisex-hoodies";
  if (t.includes("without zip")) return "/products?category=without-zip";
  if (t.includes("zip")) return "/products?category=with-zip";
  if (t.includes("eco") || t.includes("biowash")) return "/products?category=eco-biowash";
  if (t.includes("performance")) return "/products?category=performance-fabrics";
  if (t.includes("organic")) return "/products?category=organic-collection";
  return `/products?category=${encodeURIComponent(t.replace(/\s+/g, "-"))}`;
}

export function Header({
  segments,
  collections,
}: {
  segments: Segment[];
  collections: Collection[];
}) {
  const [open, setOpen] = useState(false); // mobile drawer
  const [openSegment, setOpenSegment] = useState<string | null>(null); // mobile accordion
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const router = useRouter();

  const firstName = user?.name ? user.name.split(" ")[0] : null;
  const accountLinks = [
    { label: "Your Account", href: "/account" },
    { label: "Login & Security", href: "/account/security" },
    { label: "Your Addresses", href: "/account/addresses" },
    { label: "Your Wishlist", href: "/wishlist" },
  ];
  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  const shopMore = collections.filter((c) => c.segment === "shop-more");
  const collectionBySlug = new Map(collections.map((c) => [c.slug, c]));
  const getCollection = (slug: string) => collectionBySlug.get(slug);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-1 sm:gap-4 px-2 sm:px-6">
        <button
          className="p-1.5 sm:p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5 sm:h-[22px] sm:w-[22px]" /> : <Menu className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />}
        </button>

        <Link href="/" aria-label="TeesZone home" className="shrink-0">
          <Image
            src="/logo.png"
            alt="TeesZone — elevate your style with custom tees"
            width={168}
            height={33}
            className="w-[125px] sm:w-[168px] h-auto object-contain"
            preload
          />
        </Link>

        {/* Desktop mega menu */}
        <nav className="hidden flex-1 items-center justify-center lg:flex">
          {segments.map((seg) => (
            <div key={seg.slug} className="group">
              <button className={`${topLink} text-ink`}>
                {seg.name}
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </button>
              {/* Mega panel */}
              <div className="invisible absolute inset-x-0 top-full z-50 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0">
                <div className="border-t-2 border-accent bg-white shadow-xl">
                  <div className="mx-auto flex max-w-[1320px] justify-start lg:justify-center gap-8 xl:gap-12 px-6 py-8">
                    {/* Groups and Products */}
                    {seg.groups.map((group) => (
                      <div key={group.title} className="min-w-[190px] max-w-[280px]">
                        <Link
                          href={getCategoryHref(seg.slug, group.title)}
                          className="mb-3 block text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:text-ink whitespace-nowrap"
                        >
                          {group.title}
                        </Link>
                        <ul className="space-y-2">
                          {group.collections.map((slug) => {
                            const col = getCollection(slug);
                            if (!col) return null;
                            return (
                              <li key={slug}>
                                <Link
                                  href={`/products/${slug}`}
                                  className="block text-sm text-body transition-colors hover:text-accent leading-snug"
                                >
                                  {col.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}

                    {/* By Use Case column */}
                    <div className="min-w-[160px] border-l border-line pl-8 xl:pl-12">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                        By Use Case
                      </p>
                      <ul className="space-y-2">
                        {useCaseLinks.map((u) => (
                          <li key={u.label}>
                            <Link
                              href={u.href}
                              className="block text-sm text-body transition-colors hover:text-accent"
                            >
                              {u.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Image tile */}
                    <Link
                      href={getCategoryHref(seg.slug, seg.groups[0]?.title ?? "")}
                      className="group/tile relative hidden w-44 overflow-hidden bg-surface xl:block"
                    >
                      <Image
                        src={featuredBySegment[seg.slug] ?? "/products/crew-white.svg"}
                        alt={`${seg.name} range`}
                        width={220}
                        height={220}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/tile:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-white">
                        Shop {seg.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}


          <Link href="/contact" className={`${topLink} text-ink`}>
            Bulk Order
          </Link>
          <div className="group relative">
            <button className={`${topLink} text-ink`}>
              Shop More
              <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute right-0 top-full z-50 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <ul className="min-w-44 space-y-2 border border-line bg-white px-6 py-5 shadow-xl">
                {shopMore.map((col) => (
                  <li key={col.slug}>
                    <Link
                      href={`/collections/${col.slug}`}
                      className="whitespace-nowrap text-sm text-body transition-colors hover:text-accent"
                    >
                      {col.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Account */}
          <div className="group relative">
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? `Account, signed in as ${user.name || user.email}` : "Sign in"}
              className="flex items-center gap-1.5 p-1.5 sm:p-2 text-ink transition-colors hover:text-accent"
            >
              <CircleUserRound className="h-5 w-5 sm:h-5 sm:w-5" />
              <span className="hidden text-left leading-tight xl:block">
                <span className="block max-w-28 truncate text-[10px] text-body">
                  {user ? `Hi, ${firstName ?? user.email}` : "Hello, Sign in"}
                </span>
                <span className="block text-xs font-bold uppercase tracking-wide">Account</span>
              </span>
            </Link>
            <div className="invisible absolute right-0 top-full z-50 hidden opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 lg:block">
              <div className="w-60 border border-line bg-white px-5 py-4 shadow-xl">
                {user ? (
                  <>
                    <p className="border-b border-line pb-3 text-sm font-bold text-ink">
                      Hi, {user.name || user.email}
                    </p>
                    <ul className="space-y-2 py-3">
                      {accountLinks.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="text-sm text-body transition-colors hover:text-accent"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 border-t border-line pt-3 text-sm font-bold text-body transition-colors hover:text-accent"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block bg-accent px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent-dark"
                    >
                      Sign In
                    </Link>
                    <p className="pt-3 text-center text-xs text-body">
                      New customer?{" "}
                      <Link href="/register" className=" text-accent hover:underline">
                        Start here
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative p-1.5 sm:p-2 text-ink transition-colors hover:text-accent"
          >
            <Heart className="h-5 w-5 sm:h-5 sm:w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[9px] sm:text-[10px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${totalItems} items`}
            className="relative p-1.5 sm:p-2 text-ink transition-colors hover:text-accent"
          >
            <ShoppingBag className="h-5 w-5 sm:h-5 sm:w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[9px] sm:text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="max-h-[75vh] overflow-y-auto border-t border-line bg-white px-4 pb-8 pt-2 lg:hidden">
          {segments.map((seg) => (
            <div key={seg.slug} className="border-b border-line">
              <button
                onClick={() =>
                  setOpenSegment(openSegment === seg.slug ? null : seg.slug)
                }
                className="flex w-full items-center justify-between py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
                aria-expanded={openSegment === seg.slug}
              >
                {seg.name}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openSegment === seg.slug ? "rotate-180" : ""}`}
                />
              </button>
              {openSegment === seg.slug && (
                <div className="pb-4" onClick={() => setOpen(false)}>
                  {seg.groups.map((group) => (
                    <div key={group.title} className="mb-3">
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-body">
                        {group.title}
                      </p>
                      {group.collections.map((slug) => {
                        const col = getCollection(slug);
                        if (!col) return null;
                        return (
                          <Link
                            key={slug}
                            href={`/products/${slug}`}
                            className="block py-1.5 pl-3 text-sm text-ink"
                          >
                            {col.name}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div onClick={() => setOpen(false)}>
            <Link
              href="/contact"
              className="block border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
            >
              Bulk Order
            </Link>
            {shopMore.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="block border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
              >
                {col.name}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center gap-2 border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
            >
              <CircleUserRound size={16} />
              {user ? "Your Account" : "Sign In / Register"}
            </Link>
            <Link
              href="/cart"
              className="mt-4 flex items-center justify-center gap-2 bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
            >
              <ShoppingBag size={15} />
              View Cart{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
