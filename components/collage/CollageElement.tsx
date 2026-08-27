"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { cx } from "@/lib/utils";

export type CollageProps = {
  /** Path under /public/collage. */
  src: string;
  alt?: string;
  className?: string;
  /** Rendered width. Anything vw-based scales with the composition. */
  width: string;
  rotate?: number;
  opacity?: number;
  z?: number;
  /** Seconds into the section's entry before this piece lands. */
  delay?: number;
  /** 0 = pinned to the page, 1 = moves a full parallax unit with the pointer. */
  parallax?: number;
  /** Pointer position, −1…1, supplied by the section. */
  px?: MotionValue<number>;
  py?: MotionValue<number>;
  /** Hidden below `lg` — most decoration is desktop-only. */
  desktopOnly?: boolean;
  /** Sits above the fold: skips lazy loading. */
  priority?: boolean;
  /** Very slow idle drift. Use on one or two pieces per section, never more. */
  idle?: boolean;
  from?: "left" | "right" | "top" | "bottom" | "scale";
};

/** Parallax depth in px for a given strength. */
const DEPTH = 26;

/**
 * One piece of the collage.
 *
 * Everything decorative on the page goes through here so that position,
 * rotation, depth, entry and parallax are declared the same way every time —
 * and so a piece can never accidentally animate its own transform and fight
 * the parallax wrapper. The outer element owns parallax, the inner owns entry
 * and rotation; they never touch the same property.
 */
export function CollageElement({
  src,
  alt = "",
  className,
  width,
  rotate = 0,
  opacity = 1,
  z = 0,
  delay = 0,
  parallax = 0,
  px,
  py,
  desktopOnly = false,
  priority = false,
  idle = false,
  from = "scale",
}: CollageProps) {
  // Always create the fallback so the hook order never varies, then pick.
  const zero = useMotionValue(0);
  const x = useTransform(px ?? zero, (v) => v * parallax * DEPTH);
  const y = useTransform(py ?? zero, (v) => v * parallax * DEPTH * 0.6);

  const initial =
    from === "left"
      ? { opacity: 0, x: -40 }
      : from === "right"
        ? { opacity: 0, x: 40 }
        : from === "top"
          ? { opacity: 0, y: -32 }
          : from === "bottom"
            ? { opacity: 0, y: 32 }
            : { opacity: 0, scale: 0.7 };

  return (
    <motion.div
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute select-none",
        desktopOnly && "hidden lg:block",
        className,
      )}
      style={{ width, zIndex: z, x, y }}
    >
      <motion.div
        initial={initial}
        whileInView={{ opacity, scale: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ rotate }}
        {...(idle
          ? {
              animate: {
                y: [0, -7, 0],
                transition: { duration: 9, repeat: Infinity, ease: "easeInOut" },
              },
            }
          : {})}
      >
        <Image
          src={src}
          alt={alt}
          width={600}
          height={600}
          quality={88}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 1024px) 40vw, 25vw"
          className="h-auto w-full"
          style={{ opacity }}
        />
      </motion.div>
    </motion.div>
  );
}
