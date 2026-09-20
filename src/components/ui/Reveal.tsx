"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** How far into the viewport before it fires. */
  threshold?: number;
}

/**
 * Fades and lifts its children into view once, on first intersection.
 * The visual states live in globals.css under [data-reveal].
 *
 * Anything already on screen — or already scrolled past, which happens on
 * an anchor jump, a restored scroll position or a back navigation — is
 * shown immediately rather than waiting for an intersection that will
 * never come.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.setAttribute("data-reveal", "in");

    // Already visible, or the page opened further down than this element.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      show();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}
