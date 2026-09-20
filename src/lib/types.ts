export type Purpose = "sale" | "rent";

export type PropertyType =
  | "Apartment"
  | "Penthouse"
  | "Villa"
  | "Twin House"
  | "Townhouse"
  | "Chalet"
  | "Studio"
  | "Duplex"
  | "Office";

export type Currency = "EUR" | "USD" | "EGP";

export type Region = "red-sea" | "greater-cairo" | "north-coast";

export interface Area {
  slug: string;
  name: string;
  region: Region;
  regionLabel: string;
  tagline: string;
  blurb: string;
  description: string[];
  image: string;
  heroImage: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

export interface Agent {
  slug: string;
  name: string;
  role: string;
  image: string;
  languages: string[];
  phone: string;
  email: string;
  specialty: string;
  years: number;
}

export interface Property {
  slug: string;
  ref: string;
  title: string;
  purpose: Purpose;
  type: PropertyType;
  areaSlug: string;
  address: string;
  price: number;
  currency: Currency;
  /** Rentals only — the billing period shown next to the price. */
  period?: "month" | "night";
  bedrooms: number;
  bathrooms: number;
  size: number;
  plotSize?: number;
  floor?: string;
  deliveryYear?: number;
  finishing: "Fully finished" | "Semi-finished" | "Core & shell" | "Furnished";
  view: string;
  features: string[];
  images: string[];
  summary: string;
  description: string[];
  agentSlug: string;
  featured?: boolean;
  exclusive?: boolean;
  status?: "available" | "reserved" | "sold";
  paymentPlan?: { downPayment: string; years: number; note: string };
  coordinates?: { lat: number; lng: number };
}
