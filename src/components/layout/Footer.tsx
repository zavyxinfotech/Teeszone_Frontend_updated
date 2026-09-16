import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
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
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Image src="/logo.png" alt="TeesZone" width={168} height={33} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {site.legalName} — direct manufacturer of blank and custom apparel
            from Tiruppur. Bulk orders, custom printing & embroidery,
            delivered pan-India.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-ink" />
              {site.address}
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2.5 hover:text-accent">
                <Phone size={15} className="shrink-0 text-ink" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-accent">
                <Mail size={15} className="shrink-0 text-ink" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={waLink(defaultWaMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-accent"
              >
                <MessageCircle size={15} className="shrink-0 text-ink" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">
            Shop
          </h3>
          <ul className="space-y-2.5 text-sm">
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
              <Link href="/collections/best-sellers" className="hover:text-accent">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link href="/collections/new-arrival" className="hover:text-accent">
                New Arrival
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">
            Help
          </h3>
          <ul className="space-y-2.5 text-sm">
            {help.map((h) => (
              <li key={h.label}>
                <Link href={h.href} className="hover:text-accent">
                  {h.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">
            Stay in the Loop
          </h3>
          <p className="text-sm leading-relaxed">
            New ranges, fabric drops and bulk offers — straight to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-body sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>Manufactured with pride in Tiruppur, Tamil Nadu.</p>
        </div>
      </div>
    </footer>
  );
}
