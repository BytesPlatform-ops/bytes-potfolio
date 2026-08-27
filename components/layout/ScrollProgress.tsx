"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** 2px accent hairline at the very top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-accent"
    />
  );
}
