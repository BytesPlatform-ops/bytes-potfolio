"use client";

import { motion } from "motion/react";
import { lineRise, viewportOnce } from "@/lib/motion";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Props = {
  /** Each string is one masked line. Line breaks are a design decision, not luck. */
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  id?: string;
  delay?: number;
  /** Play immediately instead of on scroll (used in the hero). */
  immediate?: boolean;
};

export function TextReveal({
  lines,
  className,
  lineClassName,
  as = "h2",
  id,
  delay = 0,
  immediate = false,
}: Props) {
  const Tag = motion[as] as typeof motion.div;
  const reduce = useSafeReducedMotion();

  if (reduce) {
    const Static = as as React.ElementType;
    return (
      <Static id={id} className={className}>
        {lines.map((line, i) => (
          <span key={i} className={cx("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Static>
    );
  }

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: viewportOnce })}
    >
      {lines.map((line, i) => (
        <span key={i} className={cx("reveal-line", lineClassName)}>
          <motion.span variants={lineRise} custom={i + delay}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
