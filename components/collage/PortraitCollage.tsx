"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { portrait } from "@/lib/site";
import { cx } from "@/lib/utils";

export type PortraitCrop = "full" | "bust" | "frame";

const SRC: Record<PortraitCrop, string> = {
  full: "/collage/portraits/baneen-full.webp",
  bust: "/collage/portraits/baneen-bust.webp",
  frame: "/collage/portraits/baneen-frame.webp",
};

/**
 * Baneen, on her own layer.
 *
 * Deliberately NOT the source sheet: three separate crops of her were cut out
 * and given torn-paper alpha edges, so she can overlap typography, parallax
 * independently of the collage behind her, and appear in a different crop in
 * each section. Nothing here renders a full collage image.
 */
export function PortraitCollage({
  crop = "full",
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
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ rotate }}
      >
        <Image
          src={SRC[crop]}
          alt={portrait.alt}
          width={crop === "bust" ? 440 : 613}
          height={crop === "bust" ? 505 : 998}
          quality={92}
          priority={priority}
          sizes="(max-width: 1024px) 62vw, 34vw"
          className="h-auto w-full drop-shadow-[0_28px_50px_rgba(16,16,16,0.28)]"
        />
      </motion.div>
    </motion.div>
  );
}
