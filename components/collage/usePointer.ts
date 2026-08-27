"use client";

import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Normalised pointer position for a section, −1…1 on both axes, springed.
 *
 * One source per section; every collage piece scales it by its own `parallax`
 * strength. That keeps the depth ordering consistent — a piece can't drift
 * faster than one nearer the viewer just because it was written later.
 */
export function usePointer(): {
  px: MotionValue<number>;
  py: MotionValue<number>;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
} {
  const reduce = useSafeReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 55, damping: 20, mass: 0.8 });
  const py = useSpring(rawY, { stiffness: 55, damping: 20, mass: 0.8 });

  return {
    px,
    py,
    onPointerMove: (e) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
      rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
    },
    onPointerLeave: () => {
      rawX.set(0);
      rawY.set(0);
    },
  };
}
