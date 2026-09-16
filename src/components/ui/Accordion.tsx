"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
      {items.map((item) => (
        <details key={item.title} className="group px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.title}
            <ChevronDown
              size={18}
              className="shrink-0 text-body transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="pb-5 text-sm leading-relaxed">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
