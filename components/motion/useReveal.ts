"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

/**
 * Explicit in-view state, returned as a tuple.
 *
 * `whileInView` proved unreliable on elements that also carry scroll-linked
 * MotionValues — the parallax project blocks stayed stuck at their `initial`
 * clip-path. Driving `animate` from an observer we own is deterministic.
 */
export function useReveal<T extends Element = HTMLDivElement>(amount = 0.2) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView] as const;
}
