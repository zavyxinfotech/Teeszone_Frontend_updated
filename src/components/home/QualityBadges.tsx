import { ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const guarantees = [
  "No Roughness",
  "No Button Issues",
  "No Bobbling",
  "No Color Bleed",
  "No Shrinkage",
  "No Poor Stitching",
];

export function QualityBadges() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white">
            Our Quality Guarantee
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-white/60">
            Six checks on every single piece before it leaves the factory.
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {guarantees.map((g, i) => (
            <Reveal key={g} delay={i * 50}>
              <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-4">
                <ShieldCheck size={17} className="shrink-0 text-gold" />
                <span className="font-heading text-xs font-semibold text-white">
                  {g}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
