export const site = {
  name: "TeesZone",
  legalName: "TeesZone Clothing Private Limited",
  tagline: "elevate your style with custom tees",
  headline: "Premium Uniform Solutions for Every Industry",
  phoneDisplay: "+91 75500 67704",
  phoneHref: "tel:+917550067704",
  whatsappNumber: "917550067704",
  email: "hello@teeszone.in", // TODO: confirm with Madhan
  address: "Tiruppur, Tamil Nadu, India",
  url: "https://teeszone.in", // TODO: confirm final domain
};

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const defaultWaMessage =
  "Hi TeesZone! I'd like a quote for custom apparel.";
