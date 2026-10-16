export type SegmentSlug = "men" | "women" | "kids" | "hoodies" | "specialty" | "shop-more";

export interface Collection {
  slug: string;
  name: string;
  segment: SegmentSlug;
  group: string; // menu column heading, e.g. "Tops", "Winter Essentials"
  description: string;
}

// nav segment with its collections (mega menu)
export interface Segment {
  slug: SegmentSlug;
  name: string;
  groups: { title: string; collections: string[] }[]; // collection slugs
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
  backImage?: string;
  chestImage?: string;
  detailImage?: string;
  image4?: string;
  image5?: string;
}

// quantity-based discount
export interface QtyDiscount {
  minQty: number;
  offPct: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collections: string[]; // collection slugs this product appears in
  description: string;
  fit: string; // one-line fit statement shown in the FIT block
  fabric: string;
  gsm: number;
  mrp: number; // struck-through list price
  price: number; // selling price shown
  colors: ProductColor[];
  sizes: string[];
  qtyDiscounts: QtyDiscount[];
  features: string[];
  isNew?: boolean;
  bestSeller?: boolean;
  megaSale?: boolean;
  ordersDelivered?: number;
}

export interface Review {
  stars: number;
  quote: string;
  author: string;
  product: string;
  image?: string;
  verified?: boolean;
}

// ---------- auth & account ----------

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  company?: string;
  role: "CUSTOMER" | "ADMIN";
  hasPassword: boolean; // false for Google-only accounts until they set one
  googleLinked: boolean;
}

export type AddressType = "HOME" | "WORK" | "OTHER";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault?: boolean;
}

export interface Fabric {
  key: string;
  name: string;
  description: string;
  fit: string;
  highlights: string[];
  image: string;
}

export interface HeroStat {
  end: number;
  suffix: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
  heroImage: string;
  bgImageDesktop: string;
  bgImageMobile: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  stats: HeroStat[];
}

export interface ShopByRangeTile {
  title: string;
  href: string;
  image: string;
  buttonText: string;
  sale: boolean;
}

export interface ShopByRangeFeature {
  title: string;
  text: string;
  href: string;
  buttonText: string;
  image: string;
}

export interface ShopByRangeContent {
  title: string;
  feature: ShopByRangeFeature;
  tiles: ShopByRangeTile[];
}

export interface FabricLibraryContent {
  title: string;
  subtitle: string;
}

export interface ProcessStep {
  title: string;
  text: string;
}

export interface ProcessStepsContent {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export interface HomeContent {
  hero: HeroContent;
  shopByRange: ShopByRangeContent;
  fabricLibrary: FabricLibraryContent;
  processSteps: ProcessStepsContent;
}
