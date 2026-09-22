import type { Currency } from "./types";

/**
 * Approximate EUR value, used only to make mixed-currency sorting and filtering coherent.
 * Display formatting (prices, areas, plurals) is language-aware and lives in src/i18n/format.ts.
 */
const TO_EUR: Record<Currency, number> = {
  EUR: 1,
  USD: 0.92,
  EGP: 0.019,
};

export function toEur(value: number, currency: Currency) {
  return value * TO_EUR[currency];
}
