import type { Product } from "@/lib/types";

export function offPct(p: Product): number {
  if (p.offerPct != null) return p.offerPct;
  return Math.round((1 - p.price / p.mrp) * 100);
}
