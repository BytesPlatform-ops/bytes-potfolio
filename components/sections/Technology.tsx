"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { techGroups } from "@/data/technology";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/motion/TextReveal";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * No logo cloud. Capability rows that drift laterally at different rates
 * as the section passes — the type is the graphic.
 */
export function Technology() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const drift = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0px", "0px"] : ["46px", "-46px"],
  );
  const driftBack = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0px", "0px"] : ["-30px", "30px"],
  );

  return (
    <section
      ref={ref}
      className="section-y relative overflow-x-clip bg-paper"
      aria-labelledby="tech-heading"
    >
      <div className="shell-wide">
        <SectionLabel index="05">Build</SectionLabel>
        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <TextReveal
            as="h2"
            id="tech-heading"
            className="t-display max-w-[13ch] text-ink"
            lines={[<>The right technology,</>, <>not the trendy one.</>]}
          />
          <p className="t-small measure text-muted-ink md:pb-3">
            Stack decisions follow the project. Most clients never think about
            this list again after kickoff — which is the point.
          </p>
        </div>

        <ul className="mt-[clamp(3rem,7vh,5rem)] border-t border-[var(--line-paper)]">
          {techGroups.map((g, i) => (
            <li key={g.label} className="border-b border-[var(--line-paper)]">
              <div className="grid grid-cols-1 items-baseline gap-y-3 py-7 md:grid-cols-12 md:gap-x-8 md:py-9">
                <span className="t-label text-muted-ink md:col-span-3">
                  {g.label}
                </span>
                <motion.div
                  className="flex flex-wrap items-baseline gap-x-[clamp(1rem,3vw,3rem)] gap-y-2 md:col-span-9"
                  style={{ x: i % 2 === 0 ? drift : driftBack }}
                >
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="text-[clamp(1.4rem,3.2vw,2.6rem)] leading-none tracking-[-0.035em] text-ink/85 transition-colors duration-300 hover:text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </motion.div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
