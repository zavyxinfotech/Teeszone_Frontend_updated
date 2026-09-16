import type { Product } from "@/lib/types";

export function offPct(p: Product): number {
  return Math.round((1 - p.price / p.mrp) * 100);
}
