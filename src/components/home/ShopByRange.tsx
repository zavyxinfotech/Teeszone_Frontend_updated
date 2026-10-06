import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const feature = {
  title: "Unisex Essentials",
  text: "Round necks, polos and winterwear — the core of every bulk order.",
  href: "/collections/unisex-round-neck",
  image: "/products/crew-white.svg",
};

const tiles = [
  { title: "Men", href: "/collections/mens-oversized-tee", image: "/products/crew-black.svg" },
  { title: "Women", href: "/collections/womens-round-neck", image: "/products/crew-white.svg" },
  { title: "Kids", href: "/collections/kids-round-neck", image: "/products/jersey-red.svg" },
  { title: "Mega Sale", href: "/collections/mega-sale", image: "/products/tee-yellow.svg", sale: true },
];

export function ShopByRange() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-18">
        <Reveal>
          <h2 className="section-title">Shop by Range</h2>
        </Reveal>

        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          {/* Feature tile */}
          <Reveal className="h-full">
            <Link
              href={feature.href}
              className="group relative flex h-full min-h-72 items-end overflow-hidden bg-white"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={640}
                height={640}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="relative z-10 w-full bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-7 pt-20">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                  {feature.title}
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-white/80">{feature.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors group-hover:bg-gold group-hover:text-ink">
                  Shop Unisex
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Small tiles */}
          <div className="grid grid-cols-2 gap-4">
            {tiles.map((t, i) => (
              <Reveal key={t.title} delay={i * 70} className="h-full">
                <Link
                  href={t.href}
                  className="group relative flex h-full min-h-40 items-end overflow-hidden bg-white"
                >
                  <Image
                    src={t.image}
                    alt={t.title}
                    width={400}
                    height={400}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="relative z-10 w-full bg-gradient-to-t from-ink/75 to-transparent p-4 pt-12">
                    <h3
                      className={`text-sm  uppercase tracking-wide ${
                        t.sale ? "text-gold" : "text-white"
                      }`}
                    >
                      {t.title}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/80 transition-colors group-hover:text-gold">
                      Shop now
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
