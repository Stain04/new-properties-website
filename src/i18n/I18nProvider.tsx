"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localePath, type Locale } from "./config";
import type { Dictionary } from "./dictionaries";
import type { Plural } from "./dictionaries/en";
import { fmt, plural } from "./format";

interface I18nValue {
  locale: Locale;
  dict: Dictionary;
  /** Fill {placeholders} in a dictionary string. */
  fmt: typeof fmt;
  /** Plural form for n in the active language. */
  plural: (n: number, forms: Plural) => string;
  /** Prefix an internal path for the active language. */
  href: (path: string) => string;
  /** Destination names in the active language, for forms and menus. */
  areas: { slug: string; name: string }[];
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  areas,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  areas: { slug: string; name: string }[];
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dict,
      fmt,
      plural: (n, forms) => plural(locale, n, forms),
      href: (path) => localePath(locale, path),
      areas,
    }),
    [locale, dict, areas],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
