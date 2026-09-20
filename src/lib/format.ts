import type { Currency, Property } from "./types";

const SYMBOL: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  EGP: "EGP ",
};

export function formatPrice(value: number, currency: Currency) {
  return `${SYMBOL[currency]}${value.toLocaleString("en-US")}`;
}

export function priceLabel(p: Property) {
  if (p.status === "sold") return "Sold";
  if (p.purpose === "rent") {
    return `${formatPrice(p.price, p.currency)} / ${p.period === "night" ? "night" : "month"}`;
  }
  return formatPrice(p.price, p.currency);
}

/** Approximate EUR value, used only to make mixed-currency sorting and filtering coherent. */
const TO_EUR: Record<Currency, number> = {
  EUR: 1,
  USD: 0.92,
  EGP: 0.019,
};

export function toEur(value: number, currency: Currency) {
  return value * TO_EUR[currency];
}

export function formatArea(sqm: number) {
  return `${sqm.toLocaleString("en-US")} m²`;
}

export function pluralise(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
