"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { portrait } from "@/lib/site";
import { cx } from "@/lib/utils";

export type PortraitCrop = "tall" | "bust" | "frame";

/**
 * Intrinsic sizes, so `next/image` reserves the right box before load.
 *
 * These are full-length figures, which changes what the layout around them
 * can do. The head sits in the top fifth and everything below is body, so a
 * headline can cross the figure low without touching the face.
 *
 * The keys are kept as they were — `tall`, `frame`, `bust` — because three
 * sections already ask for them by name; only what they point at has changed.
 *
 * Every frame in this set is 1086×1448 — a flat 3:4. The set it replaced ran
 * from 0.49 to 0.64 wide, so at any given width the new figures come out
 * markedly shorter. Each call site's width was scaled up to hold her previous
 * standing height rather than left alone; see the notes there.
 */
const SRC: Record<PortraitCrop, { src: string; w: number; h: number }> = {
  /** Standing, arms crossed. The most upright of the set — the hero. */
  tall: { src: "/profile/bia-hijab-hero.png", w: 1086, h: 1448 },
  /** Seated with the laptop, hand to chin. Reads as working — About. */
  frame: { src: "/profile/bia-hijab-seated-01.png", w: 1086, h: 1448 },
  /** Mid-stride with laptop and bag — the closing section. */
  bust: { src: "/profile/bia-hijab-standing.png", w: 1086, h: 1448 },
};

/**
 * Bia, on her own layer.
 *
 * Three of the five supplied hijab figures, one per section, so she is never
 * the same picture twice on one page. The other two —
 * `bia-hijab-seated-02.png` and `bia-hijab-creative-01.png` — are in
 * `/public/profile/` and unused: adding them would mean inventing a section
 * to hold them.
 *
 * They arrive as clean cut-outs with their own collage already around them —
 * plants, notes, doodles — so no torn-paper edge is added here and each
 * section keeps its own decoration light around her.
 */
export function PortraitCollage({
  crop = "tall",
  className,
  width,
  rotate = 0,
  parallax = 0,
  px,
  py,
  priority = false,
  z = 20,
  delay = 0,
}: {
  crop?: PortraitCrop;
  className?: string;
  width?: string;
  rotate?: number;
  parallax?: number;
  px?: MotionValue<number>;
  py?: MotionValue<number>;
  priority?: boolean;
  z?: number;
  delay?: number;
}) {
  const zero = useMotionValue(0);
  const x = useTransform(px ?? zero, (v) => v * parallax * 22);
  const y = useTransform(py ?? zero, (v) => v * parallax * 14);

  if (!portrait.hasPortrait) return null;

  return (
    <motion.div
      className={cx("absolute select-none", className)}
      style={{ width, zIndex: z, x, y }}
    >
      <motion.div
        initial={{ opacity: 0, y: 58, scale: 0.965 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ rotate }}
      >
        <Image
          src={SRC[crop].src}
          alt={portrait.alt}
          width={SRC[crop].w}
          height={SRC[crop].h}
          quality={92}
          priority={priority}
          sizes="(max-width: 1024px) 62vw, 34vw"
          className="h-auto w-full drop-shadow-[0_22px_38px_rgba(16,16,16,0.18)]"
        />
      </motion.div>
    </motion.div>
  );
}
