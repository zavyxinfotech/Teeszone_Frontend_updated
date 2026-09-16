import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { waLink, defaultWaMessage } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="bg-ink">
      <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-bold uppercase tracking-[0.08em] text-white sm:text-3xl">
            Ready to outfit your team?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
            Share your requirement and get a quote within hours — a real
            person, not a bot, will get back to you.
          </p>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="border border-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-ink"
          >
            Get a Quote
          </Link>
          <a
            href={waLink(defaultWaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-whatsapp px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-whatsapp-dark"
          >
            <MessageCircle size={17} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
