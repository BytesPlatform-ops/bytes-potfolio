"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { cx } from "@/lib/utils";

/**
 * Curved type, set as art direction rather than as a badge.
 *
 * This began as a black seal pinned in the corner, which read as a sticker
 * stuck onto the page instead of part of it. Enlarged, unfilled and dropped to
 * a fraction of ink, the same words become a ring the composition is built
 * around — she stands inside it, the headline crosses it, and it never asks to
 * be read as a label.
 *
 * Two things keep it premium rather than decorative: it is faint enough to
 * read as texture at a glance, and it turns slowly enough that the movement is
 * noticed only on a second look.
 */
export function CurvedTypeRing({
  text,
  className,
  size = "clamp(26rem,46vw,42rem)",
  /** One full turn. Long on purpose — this should never read as a spinner. */
  seconds = 78,
  reverse = false,
  radius = 176,
  fontSize = 13.5,
  opacity = 0.2,
  advanceRatio = 0.76,
}: {
  text: string;
  className?: string;
  size?: string;
  seconds?: number;
  reverse?: boolean;
  radius?: number;
  fontSize?: number;
  opacity?: number;
  /** Advance width of one glyph as a fraction of the font size. Measured for
      the label mono at 0.76; only worth changing if that face changes. */
  advanceRatio?: number;
}) {
  const reduce = useSafeReducedMotion();

  /* The ring has to close on itself: a string that falls short leaves a bald
     arc, one that overruns is silently clipped mid-word. Hand-tuning
     letter-spacing per string breaks the moment a keyword is edited, and
     computing it from a nominal advance width is wrong twice over — the
     fallback face and the real one measure differently, so the ring would
     visibly re-fit as the webfont lands.
   
     So: estimate, then measure and correct. Spacing moves the text length
     linearly, which makes the correction exact rather than iterative — one
     pass on mount for the fallback, one when the webfont is ready. */
  const circumference = 2 * Math.PI * radius;
  const textRef = useRef<SVGTextElement>(null);
  const estimate = Math.max(0, circumference / text.length - fontSize * advanceRatio);
  const [tracking, setTracking] = useState(estimate);

  // Re-seeding the estimate when the string or the metrics change is an
  // adjustment to a prop, not a synchronisation with anything outside React,
  // so it happens during render rather than in an effect. React re-runs this
  // component immediately with the new value and never commits the stale one,
  // which is cheaper than the extra paint an effect would cost — and it keeps
  // the measured correction below as the only thing that touches the DOM.
  const [seed, setSeed] = useState(estimate);
  if (seed !== estimate) {
    setSeed(estimate);
    setTracking(estimate);
  }

  useEffect(() => {
    const gaps = text.length - 1;
    if (gaps < 1) return;

    let live = true;
    const fit = () => {
      const el = textRef.current;
      if (!live || !el) return;
      const measured = el.getComputedTextLength();
      // getComputedTextLength omits the trailing gap, so the target is the
      // circumference less one gap's worth.
      if (measured > 0) {
        setTracking((t) => Math.max(0, t + (circumference - measured) / gaps - t / gaps));
      }
    };

    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      live = false;
    };
  }, [text, fontSize, circumference]);

  // `useId()` emits colons; strip them so the fragment reference is a plain id.
  const pathId = `ring-${useId().replace(/:/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute select-none", className)}
      style={{ width: size }}
    >
      <svg viewBox="0 0 400 400" className="h-auto w-full">
        <g
          className={cx(
            "origin-center [transform-box:view-box]",
            !reduce && "animate-[spin_var(--ring-spin)_linear_infinite]",
          )}
          style={
            {
              "--ring-spin": `${seconds}s`,
              animationDirection: reverse ? "reverse" : undefined,
            } as React.CSSProperties
          }
        >
          <path
            id={pathId}
            fill="none"
            d={`M200 200 m0 -${radius} a${radius} ${radius} 0 1 1 -0.01 0`}
          />
          <text
            ref={textRef}
            fill="var(--color-ink)"
            fillOpacity={opacity}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: `${fontSize}px`,
              letterSpacing: `${tracking}px`,
              textTransform: "uppercase",
            }}
          >
            <textPath href={`#${pathId}`}>{text}</textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
