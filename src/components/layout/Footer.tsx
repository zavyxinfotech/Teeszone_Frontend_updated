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
