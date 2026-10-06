import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

const stats = [
  { end: 100, suffix: "%", label: "In-House Production", sub: "No subcontracting, ever" },
  { end: 6, suffix: "", label: "QC Checks Per Piece", sub: "Stitch, color, shrink & more" },
  { end: 25, suffix: "+", label: "Product Lines", sub: "Tees to full uniform kits" },
  { end: 28, suffix: "", label: "States Delivered", sub: "Tracked pan-India couriers" },
];

export function StatsBand() {
  return (
    <section className="bg-accent">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <div className="text-center">
              <p className="font-heading text-4xl font-bold text-gold sm:text-5xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white">
                {s.label}
              </p>
              <p className="mt-1 text-xs text-white/60">{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
