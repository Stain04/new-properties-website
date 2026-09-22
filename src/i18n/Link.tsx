"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "./I18nProvider";

/**
 * Drop-in replacement for next/link that keeps the visitor in their language:
 * <Link href="/about"> becomes /ar/about on Arabic pages. External URLs,
 * mailto:, tel: and #anchors pass through untouched.
 */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { href: localise } = useI18n();
  const target = typeof href === "string" ? localise(href) : href;
  return <NextLink href={target} {...props} />;
}
