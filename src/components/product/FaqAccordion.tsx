import { Accordion } from "@/components/ui/Accordion";

const faqs = [
  {
    title: "What is the minimum order quantity?",
    content:
      "Most products start at 25 pieces (15 for sublimation jerseys, 50 for school uniforms). For smaller sample runs, message us on WhatsApp — we usually can arrange 1–2 sample pieces so you can check quality first.",
  },
  {
    title: "Can you print or embroider our logo?",
    content:
      "Yes — screen printing, DTF, sublimation and computerized embroidery are all done in-house. Single-position branding is included in the listed bulk pricing. And if you don't have a logo yet, our design team will create one free with your order.",
  },
  {
    title: "How long does production and delivery take?",
    content:
      "Typical orders ship in 7–10 working days after design approval, plus courier transit. Timelines are confirmed with your quote and larger orders are scheduled up front.",
  },
  {
    title: "Do you deliver across India?",
    content:
      "Yes, we dispatch pan-India with tracked couriers — offices, schools and event venues in every state.",
  },
  {
    title: "Can we get mixed sizes in one order?",
    content:
      "Absolutely. Share your size split (e.g. 10 S, 25 M, 15 L) with the quote and we produce exactly that — no extra charge.",
  },
  {
    title: "How do payments work?",
    content:
      "For now orders are confirmed with an advance via bank transfer/UPI after you approve the design and quote. Online payments are coming to this site soon.",
  },
];

export function FaqAccordion() {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="mt-6">
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
