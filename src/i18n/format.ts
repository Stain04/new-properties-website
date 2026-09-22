import type { Currency } from "@/lib/types";
import type { Locale } from "./config";
import type { Plural } from "./dictionaries/en";

/** Fill {placeholders}: fmt("Hi {name}", { name: "Sara" }) → "Hi Sara". */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
}

const pluralRules: Partial<Record<Locale, Intl.PluralRules>> = {};

/** Pick the right plural form for n using the language's own rules, then fill {n}. */
export function plural(locale: Locale, n: number, forms: Plural): string {
  const rules = (pluralRules[locale] ??= new Intl.PluralRules(locale));
  const category = rules.select(n);
  const template = forms[category] ?? forms.other;
  return fmt(template, { n: n.toLocaleString("en-US") });
}

/** Digits stay Western (as on Egypt's major property portals); grouping uses commas. */
export const num = (n: number) => n.toLocaleString("en-US");

const currencyWordAr: Record<Currency, string> = {
  EUR: "يورو",
  USD: "دولار",
  EGP: "جنيه",
};

const currencySymbolEn: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  EGP: "EGP ",
};

/** "€465,000" in English, "465,000 يورو" in Arabic. */
export function formatPrice(locale: Locale, value: number, currency: Currency): string {
  if (locale === "ar") return `${num(value)} ${currencyWordAr[currency]}`;
  return `${currencySymbolEn[currency]}${num(value)}`;
}

export function currencyLabel(locale: Locale, currency: Currency): string {
  return locale === "ar" ? currencyWordAr[currency] : currency;
}

export function formatArea(locale: Locale, sqm: number): string {
  return locale === "ar" ? `${num(sqm)} م²` : `${num(sqm)} m²`;
}
