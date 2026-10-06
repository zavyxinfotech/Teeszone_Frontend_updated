import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { getProducts } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a bulk quote for custom t-shirts, polos, hoodies, school uniforms and sports jerseys. Chat with a real TeesZone expert on WhatsApp.",
};

const details = [
  { icon: MapPin, label: "Address", value: site.address },
  { icon: Phone, label: "Phone / WhatsApp", value: site.phoneDisplay },
  { icon: Mail, label: "Email", value: site.email },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9:30 AM – 7:00 PM IST" },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Chat with a Real Expert
        </h1>
        <p className="mt-3 text-lg">
          Share your requirement and we&apos;ll get back with a quote, fabric
          options and a mockup — usually within a few hours.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px]">
        <QuoteForm products={products} initialProduct={product} />

        <aside className="h-fit rounded-2xl bg-surface p-7">
          <h2 className="text-lg ">Reach us directly</h2>
          <ul className="mt-5 space-y-5">
            {details.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-body">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
