import type { Metadata } from "next";
import { Factory, Users, Scissors, Leaf } from "lucide-react";
import { QualityBadges } from "@/components/home/QualityBadges";
import { CtaBand } from "@/components/home/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "TeesZone Clothing Private Limited — a Tiruppur-based apparel manufacturer crafting custom uniforms, t-shirts and jerseys for corporates, schools and teams across India.",
};

const values = [
  {
    icon: Factory,
    title: "Made in the Knitwear Capital",
    text: "Tiruppur produces most of India's knitwear exports. Our facility sits in the middle of that ecosystem — the best yarns, dyeing units and finishing expertise are minutes away.",
  },
  {
    icon: Scissors,
    title: "Everything Under One Roof",
    text: "Cutting, stitching, printing, embroidery and packing happen in-house. No subcontracting means no surprises in quality or timelines.",
  },
  {
    icon: Users,
    title: "Real People, Real Support",
    text: "Every enquiry is handled by a person who knows fabric — not a chatbot. You talk to the same expert from first message to delivery.",
  },
  {
    icon: Leaf,
    title: "Responsible by Default",
    text: "Our EcoBlend line uses recycled fibres, and cutting waste is recycled back into the Tiruppur yarn ecosystem.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20">
          <Badge>About {site.name}</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            A uniform is your brand, worn every day.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">
            {site.legalName} is a direct manufacturer of custom apparel based
            in Tiruppur, Tamil Nadu. We help corporates, schools and sports
            teams look like one team — with uniforms that are well-designed,
            durable and genuinely comfortable to wear all day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={24} />
                </span>
                <div>
                  <h2 className="text-lg ">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <QualityBadges />
      <CtaBand />
    </>
  );
}
