import type { Collection, Segment } from "@/lib/types";

export const collections: Collection[] = [
  // UNISEX
  { slug: "unisex-round-neck", name: "Round Neck", segment: "unisex", group: "Tops", description: "Everyday unisex round neck tees, ready for your print." },
  { slug: "unisex-polo", name: "Polo", segment: "unisex", group: "Tops", description: "Collared polos for teams that mean business." },
  { slug: "active-round-neck", name: "Round Neck", segment: "unisex", group: "Active Wear", description: "Quick-dry round necks built for movement." },
  { slug: "active-polo", name: "Polo", segment: "unisex", group: "Active Wear", description: "Breathable performance polos for sport and field work." },
  { slug: "pullover-hoodie", name: "Pullover Hoodie", segment: "unisex", group: "Winter Essentials", description: "Brushed-fleece pullover hoodies for teams and events." },
  { slug: "crew-sweatshirt", name: "Crew Neck Sweatshirt", segment: "unisex", group: "Winter Essentials", description: "Clean crew sweatshirts with a smooth print surface." },
  { slug: "zipper-hoodie", name: "Zipper Hoodie", segment: "unisex", group: "Winter Essentials", description: "Layer-friendly full-zip hoodies with premium zippers." },

  // MEN
  { slug: "mens-oversized-tee", name: "Oversized Tee", segment: "men", group: "Tops", description: "Heavyweight boxy-fit tees for streetwear-leaning merch." },
  { slug: "mens-v-neck", name: "V-Neck", segment: "men", group: "Tops", description: "Light V-neck tees with a clean, modern collar line." },
  { slug: "mens-raglan", name: "Raglan Sleeves", segment: "men", group: "Tops", description: "Two-tone raglan tees with contrast sleeves." },
  { slug: "mens-tank-top", name: "Tank Top", segment: "men", group: "Tops", description: "Gym-ready tanks in breathable cotton." },
  { slug: "mens-long-sleeves", name: "Long Sleeves", segment: "men", group: "Tops", description: "Full-sleeve tees for cooler days and layered looks." },
  { slug: "mens-joggers", name: "Joggers", segment: "men", group: "Bottoms", description: "Tapered joggers with ribbed cuffs and deep pockets." },
  { slug: "mens-shorts", name: "Shorts", segment: "men", group: "Bottoms", description: "Everyday cotton shorts with a comfortable drawstring waist." },
  { slug: "mens-vest", name: "Cotton Vest", segment: "men", group: "Essentials", description: "Soft daily-wear cotton vests." },

  // WOMEN
  { slug: "womens-round-neck", name: "Round Neck", segment: "women", group: "Tops", description: "Round neck tees cut for a flattering feminine fit." },
  { slug: "womens-crop-top", name: "Crop Top", segment: "women", group: "Tops", description: "Cropped tees for modern merch and casual wear." },
  { slug: "womens-crop-hoodie", name: "Crop Hoodie", segment: "women", group: "Tops", description: "Cropped hoodies that pair warmth with style." },

  // KIDS
  { slug: "kids-romper", name: "Romper", segment: "kids", group: "Tops", description: "Soft cotton rompers, gentle on infant skin." },
  { slug: "kids-round-neck", name: "Round Neck", segment: "kids", group: "Tops", description: "Classic kids tees in playful colors." },
  { slug: "kids-polo", name: "Polo", segment: "kids", group: "Tops", description: "Smart kids polos for schools and events." },
  { slug: "kids-cordset", name: "Kids Cord Set", segment: "kids", group: "Cord Set", description: "Matching tee-and-jogger sets kids love." },
  { slug: "kids-joggers", name: "Joggers", segment: "kids", group: "Bottoms", description: "Comfy joggers for school and play." },
  { slug: "kids-pullover-hoodie", name: "Pullover Hoodie", segment: "kids", group: "Winter Essentials", description: "Warm fleece hoodies sized for kids." },
  { slug: "kids-fullsleeve", name: "Fullsleeve Round Neck", segment: "kids", group: "Winter Essentials", description: "Full-sleeve tees for the chilly months." },

  // SHOP MORE
  { slug: "new-arrival", name: "New Arrival", segment: "shop-more", group: "Shop More", description: "The latest additions to the TeesZone range." },
  { slug: "best-sellers", name: "Best Sellers", segment: "shop-more", group: "Shop More", description: "The styles our bulk buyers reorder again and again." },
  { slug: "mega-sale", name: "Mega Sale", segment: "shop-more", group: "Shop More", description: "Extra-sharp pricing on selected lines." },
];

export const segments: Segment[] = [
  {
    slug: "unisex",
    name: "Unisex",
    groups: [
      { title: "Tops", collections: ["unisex-round-neck", "unisex-polo"] },
      { title: "Active Wear", collections: ["active-round-neck", "active-polo"] },
      { title: "Winter Essentials", collections: ["pullover-hoodie", "crew-sweatshirt", "zipper-hoodie"] },
    ],
  },
  {
    slug: "men",
    name: "Men",
    groups: [
      { title: "Tops", collections: ["mens-oversized-tee", "mens-v-neck", "mens-raglan", "mens-tank-top", "mens-long-sleeves"] },
      { title: "Bottoms", collections: ["mens-joggers", "mens-shorts"] },
      { title: "Essentials", collections: ["mens-vest"] },
    ],
  },
  {
    slug: "women",
    name: "Women",
    groups: [
      { title: "Tops", collections: ["womens-round-neck", "womens-crop-top", "womens-crop-hoodie"] },
    ],
  },
  {
    slug: "kids",
    name: "Kids",
    groups: [
      { title: "Tops", collections: ["kids-romper", "kids-round-neck", "kids-polo"] },
      { title: "Cord Set", collections: ["kids-cordset"] },
      { title: "Bottoms", collections: ["kids-joggers"] },
      { title: "Winter Essentials", collections: ["kids-pullover-hoodie", "kids-fullsleeve"] },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
