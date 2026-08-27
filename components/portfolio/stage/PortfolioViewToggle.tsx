"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/utils";

export type ViewMode = "desktop" | "mobile";

const MODES: { id: ViewMode; label: string }[] = [
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
];

/**
 * Desktop / Mobile, as a segmented switch.
 *
 * The pill is measured off the real buttons rather than assumed, so it stays
 * honest when the two labels render at different widths — which they do, at
 * every breakpoint, in every font.
 */
export function PortfolioViewToggle({
  value,
  onChange,
  size = "md",
  className,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 3, width: 0 });

  useEffect(() => {
    const el = refs.current[value];
    if (!el) return;
    const measure = () => setPill({ left: el.offsetLeft, width: el.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  const h = size === "sm" ? "h-[2.1rem]" : "h-9";
  const px = size === "sm" ? "px-[0.85rem]" : "px-5";
  const text = size === "sm" ? "text-[0.76rem]" : "text-[0.82rem]";

  return (
    <div className={cx("lg-seg", className)} role="tablist" aria-label="Preview device">
      <span
        aria-hidden="true"
        className="lg-seg-pill"
        style={{
          transform: `translateX(${pill.left - 3}px)`,
          width: pill.width || 0,
          opacity: pill.width ? 1 : 0,
        }}
      />
      {MODES.map((m) => (
        <button
          key={m.id}
          ref={(n) => {
            refs.current[m.id] = n;
          }}
          type="button"
          role="tab"
          aria-selected={value === m.id}
          onClick={() => onChange(m.id)}
          className={cx(
            "relative z-10 rounded-full font-medium tracking-[-0.005em] transition-colors duration-300",
            h,
            px,
            text,
            value === m.id
              ? "text-ink"
              : "text-paper/55 hover:text-paper/85",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
