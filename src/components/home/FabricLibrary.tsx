"use client";

import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";
import type { Fabric } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function FabricLibrary({ fabrics }: { fabrics: Fabric[] }) {
  const [active, setActive] = useState(0);
  const fabric = fabrics[active];
  if (!fabric) return null;

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-18">
      <Reveal>
        <h2 className="section-title">The Fabric Library</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm">
          Eight knits, each engineered for a job. Pick one to see what it does
          best.
        </p>
      </Reveal>

      {/* Tabs */}
      <Reveal>
        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {fabrics.map((f, i) => (
            <button
              key={f.key}
              onClick={() => setActive(i)}
              className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                i === active
                  ? "border-accent bg-accent text-white shadow-sm"
                  : "border-line bg-white text-ink hover:border-accent hover:text-accent"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </Reveal>

      {/* key forces the crossfade on tab change */}
      <div
        key={fabric.key}
        className="fade-swap mx-auto mt-8 grid max-w-4xl items-center gap-8 border border-line bg-white p-6 sm:p-8 md:grid-cols-[240px_1fr]"
      >
        <div className="mx-auto w-48 md:w-full">
          <Image
            src={fabric.image}
            alt={fabric.name}
            width={320}
            height={320}
            className="h-auto w-full"
          />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-wide text-ink">
            {fabric.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed">{fabric.description}</p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-accent">
            Fit
          </p>
          <p className="mt-1 text-sm text-ink">{fabric.fit}</p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-accent">
            Highlights
          </p>
          <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {fabric.highlights.map((h) => (
              <li key={h} className="flex items-start gap-1.5 text-sm">
                <Check size={14} className="mt-0.5 shrink-0 text-gold" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
