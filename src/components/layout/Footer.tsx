import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { site, waLink, defaultWaMessage } from "@/lib/site";
import type { Segment } from "@/lib/types";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const help = [
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
  { label: "Bulk & Wholesale Enquiries", href: "/contact" },
  { label: "All Products", href: "/products" },
];

export function Footer({ segments }: { segments: Segment[] }) {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start lg:col-span-2">
          <Image
            src="/logo.webp"
            alt="TeesZone"
            width={168}
            height={33}
            className="mx-auto md:mx-0"
          />
          <p className="mt-4 max-w-sm text-base md:text-sm font-normal leading-relaxed text-body">
            {site.legalName} — direct manufacturer of blank and custom apparel
            from Tiruppur. Bulk orders, custom printing & embroidery,
            delivered pan-India.
          </p>
          <ul className="mt-5 space-y-3 md:space-y-2.5 text-base md:text-sm font-normal flex flex-col items-center md:items-start">
            <li className="flex flex-col md:flex-row items-center md:items-start gap-1.5 md:gap-2.5 text-center md:text-left">
              <MapPin size={16} className="mt-0.5 shrink-0 text-ink" />
              <span>{site.address}</span>
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center justify-center md:justify-start gap-2.5 hover:text-accent">
                <Phone size={16} className="shrink-0 text-ink" />
                <span>{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center justify-center md:justify-start gap-2.5 hover:text-accent">
                <Mail size={16} className="shrink-0 text-ink" />
                <span>{site.email}</span>
              </a>
            </li>
            <li>
              <a
                href={waLink(defaultWaMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2.5 hover:text-accent"
              >
                <MessageCircle size={16} className="shrink-0 text-ink" />
                <span>Chat on WhatsApp</span>
              </a>
            </li>
            <li className="flex items-start justify-center md:justify-start gap-2.5 text-xs text-body pt-0.5">
              <Clock size={16} className="mt-0.5 shrink-0 text-ink" />
              <div className="flex flex-col">
                <span>Mon–Fri: 9:30 AM – 6:00 PM IST</span>
                <span>Sat: 9:30 AM – 6:00 PM IST • Sun: Holiday</span>
              </div>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-4 pt-1.5">
              <a
                href="https://www.facebook.com/teeszoneindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TeesZone on Facebook"
                className="transition-transform hover:scale-110 cursor-pointer"
                title="Follow us on Facebook"
              >
                <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/teeszoneindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TeesZone on Instagram"
                className="transition-transform hover:scale-110 cursor-pointer"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <defs>
                    <radialGradient id="footer-insta-grad" cx="20%" cy="100%" r="100%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="10%" stopColor="#fdf497" />
                      <stop offset="50%" stopColor="#fd5949" />
                      <stop offset="70%" stopColor="#d6249f" />
                      <stop offset="100%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <path
                    fill="url(#footer-insta-grad)"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="mb-4 text-sm md:text-xs font-bold uppercase tracking-wider text-ink">
            Shop
          </h3>
          <ul className="space-y-3 md:space-y-2.5 text-base md:text-sm font-normal">
            {segments.map((seg) => (
              <li key={seg.slug}>
                <Link
                  href={`/collections/${seg.groups[0].collections[0]}`}
                  className="hover:text-accent"
                >
                  {seg.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="hover:text-accent">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-accent">
                New Arrival
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="mb-4 text-sm md:text-xs font-bold uppercase tracking-wider text-ink">
            Help
          </h3>
          <ul className="space-y-3 md:space-y-2.5 text-base md:text-sm font-normal">
            {help.map((h) => (
              <li key={h.label}>
                <Link href={h.href} className="hover:text-accent">
                  {h.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="mb-4 text-sm md:text-xs font-bold uppercase tracking-wider text-ink">
            Stay in the Loop
          </h3>
          <p className="text-base md:text-sm font-normal leading-relaxed text-body max-w-sm">
            New ranges, fabric drops and bulk offers — straight to your inbox.
          </p>
          <div className="w-full max-w-sm mt-1">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 px-4 py-5 text-sm md:text-xs font-normal text-body sm:flex-row sm:px-6 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved. Developed with ❤️ by{" "}
            <a
              href="https://zavyx.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-accent transition-colors hover:underline"
            >
              ZAVYX InfoTech
            </a>
          </p>
          <p>Manufactured with pride in Tiruppur, Tamil Nadu.</p>
        </div>
      </div>
    </footer>
  );
}
