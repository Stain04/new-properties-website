export default function Marquee({
  items,
  tone = "dark",
}: {
  items: readonly string[];
  tone?: "dark" | "light";
}) {
  const doubled = [...items, ...items];

  return (
    <div
      // The scroll animation is direction-agnostic; keep the track LTR so it runs the same in Arabic.
      dir="ltr"
      className={`mask-fade-x overflow-hidden border-y py-5 ${
        tone === "dark" ? "border-bone-100/10" : "border-ink-900/10"
      }`}
    >
      <div className="flex w-max animate-marquee items-center gap-12">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12">
            <span
              className={`whitespace-nowrap font-display text-lg tracking-tight md:text-xl ${
                tone === "dark" ? "text-bone-100/55" : "text-ink-500"
              }`}
            >
              {item}
            </span>
            <span className="size-1 shrink-0 rounded-full bg-gold-500/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
