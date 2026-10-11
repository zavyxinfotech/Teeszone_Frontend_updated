import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Factory,
  LayoutGrid,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

import heroImg from "@/assets/images/Home_page_Hero_image.png";
import heroBgDesktop from "@/assets/images/home_page_hero_section background_image.png";
import heroBgMobile from "@/assets/images/Home_page_hero_section_Bg_mobile_view.png";

const stats = [
  { end: 100, suffix: "%", label: "In-House Production", icon: Factory },
  { end: 6, suffix: "", label: "QC Checks Per Piece", icon: ShieldCheck },
  { end: 25, suffix: "+", label: "Product Lines", icon: LayoutGrid },
];

export function HeroSplit() {
  return (
    <section className="relative bg-ivory overflow-hidden">
      {/* Background image for desktop (>= md) */}
      <div className="absolute inset-0 hidden md:block pointer-events-none select-none">
        <Image
          src={heroBgDesktop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Background image for mobile (< md) */}
      <div className="absolute inset-0 block md:hidden pointer-events-none select-none">
        <Image
          src={heroBgMobile}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
          {/* Main content column */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Reveal>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Tiruppur · India&apos;s Knitwear Capital
                </p>
                <span className="inline-block h-px w-8 sm:w-10 bg-accent/60" />
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[1.05] tracking-tight text-ink text-center md:text-left">
                Factory-Direct
                <br />
                Custom Apparel
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 sm:mt-5 max-w-md text-sm sm:text-base md:text-lg leading-relaxed text-body text-center md:text-left">
                Tees, polos, hoodies and uniforms — cut, stitched, printed and
                quality-checked under one roof, then delivered anywhere in India
                with your branding on every piece.
              </p>
            </Reveal>

            <Reveal delay={240} className="w-full">
              <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 w-full">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 bg-accent px-5 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lg"
                >
                  Shop the Range
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-ink bg-transparent px-5 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <MessageCircle size={16} />
                  Bulk Enquiry
                </Link>
              </div>
            </Reveal>

            {/* Mobile Hero Image: Positioned below buttons on mobile (< md) */}
            <div className="mt-6 sm:mt-8 w-full max-w-[420px] mx-auto md:hidden">
              <Reveal delay={280}>
                <div className="relative w-full">
                  <Image
                    src={heroImg}
                    alt="Factory-Direct Custom Apparel"
                    priority
                    className="h-auto w-full object-contain mx-auto"
                  />
                </div>
              </Reveal>
            </div>

            {/* Mobile Stats: 3 columns with dividers and icons below the image (< md) */}
            <div className="mt-8 w-full max-w-md mx-auto md:hidden">
              <Reveal delay={340}>
                <div className="grid grid-cols-3 divide-x divide-ink/10 pt-2">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.label}
                        className="flex flex-col items-center px-1 text-center"
                      >
                        <span className="font-heading text-2xl sm:text-3xl font-bold text-accent leading-none">
                          <CountUp end={s.end} suffix={s.suffix} />
                        </span>
                        <span className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-body/90 leading-tight">
                          {s.label}
                        </span>
                        <Icon
                          className="mt-2 text-accent"
                          size={22}
                          strokeWidth={1.75}
                        />
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            {/* Desktop Stats: Positioned in left column with top border (>= md) */}
            <div className="hidden md:block w-full">
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
          </div>

          {/* Desktop Right Column: Hero Image (>= md) */}
          <div className="hidden md:flex items-center justify-end w-full">
            <Reveal delay={200} className="w-full">
              <div className="relative ml-auto w-full max-w-xl lg:max-w-2xl xl:max-w-3xl transition-transform duration-300 md:scale-105 lg:scale-110 xl:scale-115 origin-right hover:scale-[1.18]">
                <Image
                  src={heroImg}
                  alt="Factory-Direct Custom Apparel"
                  priority
                  className="h-auto w-full object-contain ml-auto"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
