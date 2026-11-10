export const site = {
  name: "TeesZone",
  legalName: "TeesZone Clothing Private Limited",
  tagline: "elevate your style with custom tees",
  headline: "Premium Uniform Solutions for Every Industry",
  phoneDisplay: "+91 75500 67704",
  phoneHref: "tel:+917550067704",
  whatsappNumber: "917550067704",
  email: "info@teeszone.in",
  address:
    "#2155, Fortune City, Global Market – Texvalley, NH 544 Bengaluru–Cochin National Highway, Chithode, Erode – 638 102, Tamil Nadu, India.",
  workingHours: {
    weekdays: "Mon–Fri, 9:30 AM – 6:00 PM IST",
    saturday: "Sat, 9:30 AM – 6:00 PM IST",
    sunday: "Sunday - Holiday",
  },
  workingHoursText: "Mon–Fri: 9:30 AM – 6:00 PM IST | Sat: 9:30 AM – 6:00 PM IST | Sunday: Holiday",
  url: "https://teeszone.in",
};

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const defaultWaMessage =
  "Hi TeesZone! I'd like a quote for custom apparel.";
