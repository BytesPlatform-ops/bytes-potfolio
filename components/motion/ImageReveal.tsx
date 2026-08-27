"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { imageReveal } from "@/lib/motion";
import { cx } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

/** Masked, slightly-oversized reveal. Used for every portfolio screenshot. */
export function ImageReveal({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  sizes = "100vw",
  priority = false,
  quality = 88,
}: Props) {
  return (
    <motion.div
      className={cx("overflow-hidden", className)}
      variants={imageReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={quality}
        className={cx("h-auto w-full", imgClassName)}
      />
    </motion.div>
  );
}
