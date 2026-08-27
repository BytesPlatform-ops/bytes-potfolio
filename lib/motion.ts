import type { Transition, Variants } from "motion/react";

/** One shared motion language. Everything on the page pulls from here. */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** Small interactions: 250–350ms. */
export const tapTransition: Transition = { duration: 0.32, ease: EASE_OUT };

/** Section entrances: 500–800ms. */
export const enterTransition: Transition = { duration: 0.75, ease: EASE_OUT };

export const viewportOnce = { once: true, amount: 0.25 } as const;
export const viewportEarly = { once: true, amount: 0.12 } as const;

/** Line-mask rise used by every major heading. */
export const lineRise: Variants = {
  hidden: { y: "105%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { ...enterTransition, delay: i * 0.075 },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.06 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Masked image reveal — clip + a 4% settle. */
export const imageReveal: Variants = {
  hidden: { clipPath: "inset(12% 0% 12% 0%)", scale: 1.045, opacity: 0.6 },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    opacity: 1,
    transition: { duration: 1.05, ease: EASE_OUT },
  },
};
