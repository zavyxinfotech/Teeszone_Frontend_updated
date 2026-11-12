import type { Product } from "@/lib/types";

export function offPct(p: Product): number {
  if (p.offerPct != null) return p.offerPct;
  const raw = ((p.mrp - p.price) / p.mrp) * 100;
  return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
}
