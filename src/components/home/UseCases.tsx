import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, PartyPopper, Trophy } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const cases = [
  {
    icon: Building2,
    title: "Corporate",
    text: "Polos and tees for teams, onboarding kits and client gifting.",
    href: "/collections/unisex-polo",
  },
  {
    icon: GraduationCap,
    title: "Schools & Institutions",
    text: "Daily uniforms, house-color sports tees and crest embroidery.",
    href: "/collections/kids-polo",
  },
  {
    icon: Trophy,
    title: "Sports Teams",
    text: "Quick-dry kits and jerseys with names, numbers and sponsors.",
    href: "/collections/active-round-neck",
  },
  {
    icon: PartyPopper,
    title: "Events & Merch",
    text: "Oversized drops, fest tees and giveaway hoodies that get kept.",
    href: "/collections/mens-oversized-tee",
  },
];

export function UseCases() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-18">
      <Reveal>
        <h2 className="section-title">Built for Your Use Case</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm">
          Tell us who&apos;s wearing it — we&apos;ll handle fabric, fit and
          branding for that job.
        </p>
      </Reveal>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cases.map(({ icon: Icon, title, text, href }, i) => (
          <Reveal key={title} delay={i * 70}>
            <Link
              href={href}
              className="group flex h-full flex-col bg-accent p-7 text-white transition-all duration-200 hover:-translate-y-1.5 hover:bg-accent-dark hover:shadow-xl"
            >
              <Icon size={28} className="text-gold" />
              <h3 className="mt-4 text-base font-bold uppercase tracking-wide text-white">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/80">
                {text}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold">
                Explore
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
