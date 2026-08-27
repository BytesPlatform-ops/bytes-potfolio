"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Common = {
  children: React.ReactNode;
  className?: string;
  /** Magnetic pull radius multiplier. Kept low on purpose. */
  strength?: number;
  variant?: "solid" | "outline" | "ghost";
  tone?: "ink" | "paper" | "accent";
  size?: "md" | "lg";
};

type Props = Common &
  (
    | ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ as: "a" } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  );

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-colors duration-300";

const sizes = {
  md: "h-11 px-6 text-[0.9rem]",
  lg: "h-[3.4rem] px-8 text-[0.98rem]",
};

export function MagneticButton({
  children,
  className,
  strength = 0.28,
  variant = "solid",
  tone = "ink",
  size = "md",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 320, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 320, damping: 22, mass: 0.6 });

  /** Capped hard: precision, not travel. The button is not a toy. */
  const clamp = (v: number, max = 3) => Math.max(-max, Math.min(max, v));

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    mx.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
    my.set(clamp((e.clientY - (r.top + r.height / 2)) * strength * 0.6, 2));
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const skin =
    variant === "solid"
      ? tone === "paper"
        ? "bg-paper text-ink"
        : tone === "accent"
          ? "bg-accent text-white"
          : "bg-ink text-paper"
      : variant === "outline"
        ? tone === "paper"
          ? "border border-[var(--line-ink)] text-paper hover:border-paper/60"
          : "border border-[var(--line-paper)] text-ink hover:border-ink/50"
        : "text-inherit";

  const { as = "button", ...domProps } = rest as { as?: "button" | "a" } & Record<
    string,
    unknown
  >;
  const Comp = as === "a" ? motion.a : motion.button;

  return (
    <Comp
      data-cursor="cta"
      /* Every filled variant paints ink or accent under the pointer on hover,
         so the cursor must invert to ivory the moment it arrives — sampling
         the background mid-transition would race the fill. */
      data-cursor-theme={variant === "ghost" ? undefined : "dark"}
      // @ts-expect-error — motion narrows the ref union; both are HTMLElement.
      ref={ref}
      className={cx(base, sizes[size], skin, className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...domProps}
    >
      {/* lateral fill */}
      {variant !== "ghost" ? (
        <span
          aria-hidden="true"
          className={cx(
            "absolute inset-0 origin-left scale-x-0 transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100",
            variant === "solid"
              ? tone === "accent"
                ? "bg-accent-deep"
                : tone === "paper"
                  ? "bg-accent"
                  : "bg-accent"
              : "bg-ink",
          )}
        />
      ) : null}
      <span
        className={cx(
          "relative z-10 inline-flex items-center gap-2.5 transition-colors duration-300",
          variant === "outline" ? "group-hover:text-paper" : "",
          variant === "solid" && tone === "paper" ? "group-hover:text-white" : "",
        )}
      >
        {children}
      </span>
    </Comp>
  );
}
