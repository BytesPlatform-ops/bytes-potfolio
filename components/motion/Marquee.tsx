"use client";

import { cx } from "@/lib/utils";

/**
 * CSS-driven marquee — no JS on the scroll path.
 * Pauses on hover/focus, and stops entirely under reduced-motion.
 */
export function Marquee({
  items,
  duration = 68,
  className,
  separator = "—",
}: {
  items: string[];
  duration?: number;
  className?: string;
  separator?: string;
}) {
  const run = [...items, ...items];

  return (
    <div
      className={cx("marquee-host relative overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="marquee-track"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {run.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="whitespace-nowrap">{item}</span>
            <span className="mx-[clamp(1.5rem,4vw,4rem)] opacity-35">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
