import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-18">
      <Reveal>
        <h2 className="section-title">What Bulk Buyers Say</h2>
      </Reveal>
      <div className="mt-9 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {reviews.map((r, i) => (
          <Reveal key={r.quote} delay={(i % 3) * 70}>
            <figure className="break-inside-avoid border border-line bg-white p-6">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: r.stars }, (_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink">
                  {r.author}
                </p>
                <p className="mt-0.5 text-xs text-body">{r.product}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
