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
  "relative flex items-center gap-1 px-4 py-5 text-sm font-medium uppercase tracking-wide transition-colors hover:text-accent after:absolute after:bottom-3.5 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100 motion-reduce:after:transition-none";

const useCaseLinks = [
  { label: "Corporate", href: "/collections/unisex-polo" },
  { label: "Schools", href: "/collections/kids-polo" },
  { label: "Sports Teams", href: "/collections/active-round-neck" },
  { label: "Events & Merch", href: "/collections/mens-oversized-tee" },
];

const featuredBySegment: Record<string, string> = {
  unisex: "/products/crew-white.svg",
  men: "/products/crew-black.svg",
  women: "/products/crew-white.svg",
  kids: "/products/jersey-red.svg",
};

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
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
        <button
          className="p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" aria-label="TeesZone home" className="shrink-0">
          <Image
            src="/logo.png"
            alt="TeesZone — elevate your style with custom tees"
            width={168}
            height={33}
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
                  <div className="mx-auto flex max-w-[1320px] justify-center gap-12 px-6 py-8">
                  {seg.groups.map((group) => (
                    <div key={group.title} className="min-w-36">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                        {group.title}
                      </p>
                      <ul className="space-y-2">
                        {group.collections.map((slug) => {
                          const col = getCollection(slug);
                          if (!col) return null;
                          return (
                            <li key={slug}>
                              <Link
                                href={`/collections/${slug}`}
                                className="whitespace-nowrap text-sm text-body transition-colors hover:text-accent"
                              >
                                {col.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}

                  <div className="min-w-36 border-l border-line pl-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                      By Use Case
                    </p>
                    <ul className="space-y-2">
                      {useCaseLinks.map((u) => (
                        <li key={u.label}>
                          <Link
                            href={u.href}
                            className="whitespace-nowrap text-sm text-body transition-colors hover:text-accent"
                          >
                            {u.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/collections/${seg.groups[0].collections[0]}`}
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

          <Link href="/collections/mega-sale" className={`${topLink} text-accent`}>
            Mega Sale
          </Link>
          <Link href="/contact" className={`${topLink} text-ink`}>
            Wholesale
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

        <div className="flex items-center gap-1">
          {/* Account */}
          <div className="group relative">
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? `Account, signed in as ${user.name || user.email}` : "Sign in"}
              className="flex items-center gap-1.5 p-2 text-ink transition-colors hover:text-accent"
            >
              <CircleUserRound size={20} />
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
                    <p className="border-b border-line pb-3 text-sm font-semibold text-ink">
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
                      className="flex w-full items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-body transition-colors hover:text-accent"
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
                      <Link href="/register" className="font-semibold text-accent hover:underline">
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
            className="relative p-2 text-ink transition-colors hover:text-accent"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${totalItems} items`}
            className="relative p-2 text-ink transition-colors hover:text-accent"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
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
                            href={`/collections/${slug}`}
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
              href="/collections/mega-sale"
              className="block border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-accent"
            >
              Mega Sale
            </Link>
            {shopMore
              .filter((c) => c.slug !== "mega-sale")
              .map((col) => (
                <Link
                  key={col.slug}
                  href={`/collections/${col.slug}`}
                  className="block border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
                >
                  {col.name}
                </Link>
              ))}
            <Link
              href="/contact"
              className="block border-b border-line py-3.5 text-sm font-bold uppercase tracking-wide text-ink"
            >
              Wholesale
            </Link>
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
