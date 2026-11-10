import type { Review } from "../lib/types";

// Proxy S3 review media through authenticated Next.js streamer to avoid S3 403 Forbidden errors
const S3_BASE = "/api/upload/media/reviews";

// Genuine Google customer reviews (5.0 rating for TeesZone Clothing Private Limited)
export const reviews: Review[] = [
  {
    stars: 5,
    quote: "We got it for our restaurant in US , it's great quality and logo came out really good !!! Value for money!!",
    author: "VP GenZ",
    verified: true,
    product: "Custom Restaurant Uniform Polos",
    image: `${S3_BASE}/customer-pachauri-polo.jpg`,
  },
  {
    stars: 5,
    quote: "Very good and perfect fit. High quality brand T-shirts. I recommended purchase this T-shirts 100% trustable and valuable.",
    author: "Sathish Priya",
    verified: true,
    product: "Aerosoft Polo Neck T-Shirt (200 GSM)",
    image: `${S3_BASE}/customer-green-polo.jpg`,
  },
  {
    stars: 5,
    quote: "Print came out really good, stitching is clean, and the material feels super light & breathable. Really happy with it! Can’t wait to wear it for our next match. Great work, thanks a lot! 🙌",
    author: "Pravin Jaganathan",
    verified: true,
    product: "Custom Sports Event Polo T-Shirt",
    image: `${S3_BASE}/customer-pishon-polo.jpg`,
  },
  {
    stars: 5,
    quote: "Very nice... Good service...All the Best...",
    author: "Arun Sundhar",
    verified: true,
    product: "Men's Polo Half Sleeve (240-250 GSM)",
    image: `${S3_BASE}/arun-sundhar.jpg`,
  },
  {
    stars: 5,
    quote: "Thank you for the T shirt it’s comfortable and nice ❤️✨",
    author: "Taj Taj",
    verified: true,
    product: "Customized Corporate Polo T-Shirt",
    image: `${S3_BASE}/taj-taj.jpg`,
  },
  {
    stars: 5,
    quote: "Too Good in both service and quality of materials",
    author: "RK ACADEMY",
    verified: true,
    product: "Institutional Uniform Polos",
    image: `${S3_BASE}/rk-academy.jpg`,
  },
  {
    stars: 5,
    quote: "Great job, team! Your commitment to quality and timeline has produced excellent results. Keep up the good work.",
    author: "Riswah Na",
    verified: true,
    product: "Executive Cotton Pique Polo",
    image: `${S3_BASE}/riswah-na.jpg`,
  },
  {
    stars: 5,
    quote: "Just want to tell everyone, product quality, delivery timeline simply awesome.. Mr Shakti and viji maam along with Archana maam are so helpful in every step that I got my package on time... Shakti sir is truly genuine person who try to help us as much as he can and we will love to collaborate with them.",
    author: "Parthasarathi Majumdar",
    verified: true,
    product: "Custom Corporate Apparel & Uniforms",
    image: `${S3_BASE}/parthasarathi-majumdar.jpg`,
  },
  {
    stars: 5,
    quote: "I am writing to express our sincere appreciation for the outstanding apparel you supplied for our recent event. The feedback from participants has been overwhelmingly positive. Many specifically praised the quality of the fabric, noting that it was comfortable, durable, and well-suited for the activities during the event. Several attendees mentioned that the material felt premium and appreciated the attention to detail in the stitching and finish.and Logo printing was perfect.",
    author: "Prabhu Balaraman",
    verified: true,
    product: "Event Merchandise & Custom Printed Polos",
    image: `${S3_BASE}/prabhu-balaraman.jpg`,
  },
];
