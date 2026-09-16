export type SegmentSlug = "unisex" | "men" | "women" | "kids" | "shop-more";

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
}

export interface Review {
  stars: number;
  quote: string;
  author: string;
  product: string;
}

// ---------- auth & account ----------

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
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
