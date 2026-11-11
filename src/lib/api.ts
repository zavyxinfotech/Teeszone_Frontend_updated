import type {
  Address,
  AddressInput,
  AuthUser,
  Collection,
  CustomizationColorModel,
  Fabric,
  HomeContent,
  Product,
  ProductColorModel,
  Review,
  Segment,
} from "@/lib/types";
import defaultCustomizationColors from "@/data/customizationColors.json";

export const DEFAULT_CUSTOMIZATION_COLORS: CustomizationColorModel[] = defaultCustomizationColors.map((c, i) => ({
  id: `ccm-${c.slug}`,
  colorName: c.name,
  colorSlug: c.slug,
  colorHex: c.hex,
  modelImageUrl: c.frontModelUrl || c.s3FrontUrl,
  modelBackImageUrl: c.backModelUrl || c.s3BackUrl,
  s3FrontKey: c.s3FrontKey,
  s3BackKey: c.s3BackKey,
  isActive: c.isActive !== false,
  sortOrder: i,
}));

export const DEFAULT_AEROSOFT_3D_MODELS: ProductColorModel[] = [
  {
    id: "pcm-aerosoft-black",
    productId: "p-aerosoft-polo-200",
    colorName: "Black",
    colorHex: "#26282D",
    frontModelUrl: "/products/polo-black-front-3d.png",
    backModelUrl: "/products/polo-black-back-3d.png",
    s3ObjectKey: "products/aerosoft-polo-200/3d-models/black/front.png",
    isActive: true,
  },
  {
    id: "pcm-aerosoft-white",
    productId: "p-aerosoft-polo-200",
    colorName: "White",
    colorHex: "#FFFFFF",
    frontModelUrl: "/products/polo-white-front-3d.png",
    backModelUrl: "/products/polo-white-back-3d.png",
    s3ObjectKey: "products/aerosoft-polo-200/3d-models/white/front.png",
    isActive: true,
  },
  {
    id: "pcm-aerosoft-true-navy",
    productId: "p-aerosoft-polo-200",
    colorName: "True Navy",
    colorHex: "#3F5277",
    frontModelUrl: "/products/polo-true-navy-front-3d.png",
    backModelUrl: "/products/polo-true-navy-back-3d.png",
    s3ObjectKey: "products/aerosoft-polo-200/3d-models/true-navy/front.png",
    isActive: true,
  },
  {
    id: "pcm-aerosoft-light-grey",
    productId: "p-aerosoft-polo-200",
    colorName: "Light Grey Melange",
    colorHex: "#CCCAC9",
    frontModelUrl: "/products/polo-light-grey-front-3d.png",
    backModelUrl: "/products/polo-light-grey-back-3d.png",
    s3ObjectKey: "products/aerosoft-polo-200/3d-models/light-grey-melange/front.png",
    isActive: true,
  },
];

const SERVER_API_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4010/api";
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4010/api";

import { collections, segments, getCollection as getMockCollection } from "@/data/navigation";
import { products, getProduct as getMockProduct, getProductsByCollection as getMockProductsByCollection } from "@/data/products";
import { fabrics } from "@/data/fabrics";
import { reviews } from "@/data/reviews";

export interface Navigation {
  segments: Segment[];
  collections: Collection[];
}

export async function getNavigation(): Promise<Navigation> {
  const liveCollections = await getCollections();
  const collectionsMap = new Map<string, Collection>();
  for (const c of collections) {
    collectionsMap.set(c.slug, c);
  }
  for (const c of liveCollections) {
    if (!collectionsMap.has(c.slug)) {
      collectionsMap.set(c.slug, c);
    }
  }
  return { segments, collections: Array.from(collectionsMap.values()) };
}

function fixImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.includes("teeszone-catalogue-images-2026") || url.includes("s3.ap-southeast-2.amazonaws.com")) {
    const key = url.replace(/^https?:\/\/[^\/]+\//, "");
    return `/api/upload/media/${key}`;
  }
  if (url.includes("/api/upload/media/")) {
    const idx = url.indexOf("/api/upload/media/");
    return url.slice(idx);
  }
  return url;
}

function fixProduct(p: Product): Product {
  const rawName = p.name || "";
  const name = rawName.startsWith("Customized ") ? rawName : `Customized ${rawName}`;

  let price = p.price;
  let mrp = p.mrp;
  let offerPct = p.offerPct;

  if (p.slug === "aerosoft-polo-200") {
    price = 830;
    mrp = 1999;
    offerPct = 17;
  } else if (p.slug === "mens-polo-half-sleeve-240") {
    price = 925;
    mrp = 2399;
    offerPct = 23;
  } else if (p.slug === "ecoblend-polo-neck-240") {
    price = 975;
    mrp = 1199;
    offerPct = 23;
  }

  const colorModels =
    p.slug === "aerosoft-polo-200"
      ? (p.colorModels && p.colorModels.length > 0 ? p.colorModels : DEFAULT_AEROSOFT_3D_MODELS)
      : p.colorModels;

  return {
    ...p,
    name,
    price,
    mrp,
    offerPct,
    colorModels,
    colors: p.colors.map((c) => ({
      ...c,
      image: fixImageUrl(c.image),
      backImage: c.backImage ? fixImageUrl(c.backImage) : undefined,
      chestImage: c.chestImage ? fixImageUrl(c.chestImage) : undefined,
      detailImage: c.detailImage ? fixImageUrl(c.detailImage) : undefined,
      image4: c.image4 ? fixImageUrl(c.image4) : undefined,
      image5: c.image5 ? fixImageUrl(c.image5) : undefined,
    })),
  };
}

export async function getProduct3DModels(slug: string): Promise<ProductColorModel[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/products/${encodeURIComponent(slug)}/3d-models`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {}
  if (slug === "aerosoft-polo-200") {
    return DEFAULT_AEROSOFT_3D_MODELS;
  }
  return [];
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/products`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(fixProduct);
      }
    }
  } catch {
    // Fall back to local mock products
  }
  return products.map(fixProduct);
}

export async function getProductsByCollection(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/products?collection=${encodeURIComponent(slug)}`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(fixProduct);
      }
    }
  } catch {
    // Fall back to local mock products
  }
  return getMockProductsByCollection(slug).map(fixProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return fixProduct(json.data);
      }
    }
  } catch {
    // Fall back to local mock product
  }
  const p = getMockProduct(slug);
  return p ? fixProduct(p) : null;
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/collections`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Fall back to local mock collections
  }
  return collections;
}

export async function getCollection(slug: string): Promise<Collection | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/collections/${encodeURIComponent(slug)}`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch {
    // Fall back to local mock collection
  }
  return getMockCollection(slug) || null;
}

export async function getFabrics(): Promise<Fabric[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/fabrics`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Fall back to local mock fabrics
  }
  return fabrics;
}

export async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/reviews`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Fall back to local mock reviews
  }
  return reviews;
}

// ---------- browser-side POSTs ----------

export interface EnquiryInput {
  name: string;
  company?: string;
  phone: string;
  product?: string; // product slug
  quantity?: string;
  message?: string;
}

export async function postEnquiry(input: EnquiryInput): Promise<{ id: string }> {
  const res = await fetch(`${CLIENT_API_URL}/enquiries`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...input,
      company: input.company || undefined,
      product: input.product || undefined,
      quantity: input.quantity || undefined,
      message: input.message || undefined,
    }),
  });
  if (!res.ok) throw new Error(`Enquiry failed with ${res.status}`);
  return (await res.json()).data as { id: string };
}

export async function postNewsletter(email: string): Promise<void> {
  const res = await fetch(`${CLIENT_API_URL}/newsletter`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Newsletter signup failed with ${res.status}`);
}

export async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/home-content`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as HomeContent;
  } catch {
    return null;
  }
}

// ---------- auth & account ----------

export class ApiError extends Error {
  description?: string;
  status: number;
  constructor(message: string, status: number, description?: string) {
    super(message);
    this.status = status;
    this.description = description;
  }
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const res = await fetch(`${CLIENT_API_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      ...(opts.body !== undefined ? { "content-type": "application/json" } : {}),
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      json?.message ?? `Request failed (${res.status})`,
      res.status,
      json?.description,
    );
  }
  return json.data as T;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  company?: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export const authApi = {
  register: (input: RegisterPayload) =>
    request<AuthSession>("/auth/register", { method: "POST", body: input }),
  login: (input: { email: string; password: string }) =>
    request<AuthSession>("/auth/login", { method: "POST", body: input }),
  google: (credential: string) =>
    request<AuthSession>("/auth/google", { method: "POST", body: { credential } }),
  forgotPassword: (email: string) =>
    request<{ sent: boolean }>("/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token: string, password: string) =>
    request<{ reset: boolean }>("/auth/reset-password", {
      method: "POST",
      body: { token, password },
    }),
  me: (token: string) => request<AuthUser>("/auth/me", { token }),
  updateMe: (token: string, input: { name?: string; phone?: string }) =>
    request<AuthUser>("/auth/me", { method: "PATCH", body: input, token }),
  changePassword: (token: string, input: { currentPassword?: string; newPassword: string }) =>
    request<AuthUser>("/auth/change-password", { method: "POST", body: input, token }),
};

export const addressApi = {
  list: (token: string) => request<Address[]>("/addresses/", { token }),
  create: (token: string, input: AddressInput) =>
    request<Address>("/addresses/", { method: "POST", body: input, token }),
  update: (token: string, id: string, input: AddressInput) =>
    request<Address>(`/addresses/${id}`, { method: "PUT", body: input, token }),
  remove: (token: string, id: string) =>
    request<{ deleted: boolean }>(`/addresses/${id}`, { method: "DELETE", token }),
};

export async function getCustomization3DModels(): Promise<CustomizationColorModel[]> {
  try {
    const data = await request<CustomizationColorModel[]>("/customization/3d-models");
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // Fall back to default colors
  }
  return DEFAULT_CUSTOMIZATION_COLORS;
}
