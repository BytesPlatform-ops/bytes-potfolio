"use client";

import { motion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
  amount,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={amount ? { once: true, amount } : viewportOnce}
    >
      {children}
    </motion.div>
  );
}
