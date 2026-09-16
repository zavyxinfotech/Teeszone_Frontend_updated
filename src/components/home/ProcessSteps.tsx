import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    title: "Share Your Requirement",
    text: "Product, quantity, size split and your logo — on WhatsApp, the cart, or the enquiry form.",
  },
  {
    title: "Approve the Mockup",
    text: "We send a digital mockup and fabric options. Nothing goes to production before you sign off.",
  },
  {
    title: "We Produce & QC",
    text: "Cut, stitch, print and a six-point check on every piece in our Tiruppur facility.",
  },
  {
    title: "Doorstep Delivery",
    text: "Packed, dispatched and tracked to your office, school or venue — anywhere in India.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-18">
        <Reveal>
          <h2 className="section-title">The TeesZone Process</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm">
            From first message to delivered boxes in four steps.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center bg-accent font-heading text-lg font-black text-white">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className="absolute left-14 top-6 hidden h-px w-[calc(100%-3.5rem)] bg-ink/15 lg:block" />
                )}
                <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
