import { Star, CheckCircle } from "lucide-react";
import type { Review } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { TEESZONE_GOOGLE_REVIEWS_URL } from "@/data/ratings";

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-18">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="section-title">What Bulk Buyers Say</h2>
            <p className="mt-1 text-xs sm:text-sm text-body">
              Trusted by 850+ enterprises, corporate teams, and institutions.
            </p>
          </div>
          <a
            href={TEESZONE_GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group/glink py-1 text-xs sm:text-sm font-semibold text-[#80011F] hover:underline"
            title="View TeesZone 5.0 Star Google Ratings"
          >
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-ink">5.0</span>
            <span className="text-body group-hover/glink:text-[#80011F]">Google Ratings &rarr;</span>
          </a>
        </div>
      </Reveal>
      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {reviews.map((r, i) => (
          <Reveal key={r.quote} delay={(i % 3) * 70}>
            <figure className="break-inside-avoid border border-line bg-white p-6 rounded-2xl shadow-xs transition-shadow hover:shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: r.stars }, (_, j) => (
                    <Star key={j} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {r.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={11} className="text-emerald-600" />
                    Verified Order
                  </span>
                )}
              </div>
              <blockquote className="mt-3.5 text-sm leading-relaxed text-ink/90">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-4 pt-3 border-t border-line/60 flex items-center gap-3">
                {r.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image}
                    alt={r.author}
                    className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#80011F]/10 text-[#80011F] font-bold text-xs">
                    {r.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-ink">
                    {r.author}
                  </p>
                  <p className="mt-0.5 text-xs text-body">{r.product}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
