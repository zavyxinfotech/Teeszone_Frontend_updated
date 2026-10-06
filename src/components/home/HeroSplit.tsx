import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

import heroImg1 from "@/assets/T-shirt_hero_img1.png";
import heroImg2 from "@/assets/Hoodie_hero_img2.png";
import heroImg3 from "@/assets/T-shirt_hero_img3.png";
import heroImg4 from "@/assets/T-shirt_hero_img4.png";

const collage = [
  { src: heroImg1, alt: "Custom T-shirt", offset: "translate-y-6" },
  { src: heroImg2, alt: "Custom Hoodie", offset: "" },
  { src: heroImg3, alt: "Custom T-shirt", offset: "translate-y-6" },
  { src: heroImg4, alt: "Custom T-shirt", offset: "" },
];

const stats = [
  { end: 100, suffix: "%", label: "In-House Production" },
  { end: 6, suffix: "", label: "QC Checks Per Piece" },
  { end: 25, suffix: "+", label: "Product Lines" },
];

export function HeroSplit() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Tiruppur · India&apos;s Knitwear Capital
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Factory-Direct
              <br />
              Custom Apparel
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-md text-base leading-relaxed sm:text-lg">
              Tees, polos, hoodies and uniforms — cut, stitched, printed and
              quality-checked under one roof, then delivered anywhere in India
              with your branding on every piece.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group flex items-center gap-2 bg-accent px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lg"
              >
                Shop the Range
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 border border-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <MessageCircle size={16} />
                Bulk Enquiry
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink/10 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-heading text-3xl font-bold text-accent">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </dd>
                  <dd className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-body">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          {collage.map((c, i) => (
            <Reveal key={c.src.src} delay={i * 90} className={c.offset}>
              <div className="overflow-hidden bg-white shadow-sm transition-transform duration-300 hover:scale-[1.03]">
                <Image
                  src={c.src}
                  alt={c.alt}
                  width={400}
                  height={400}
                  preload={i < 2}
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
