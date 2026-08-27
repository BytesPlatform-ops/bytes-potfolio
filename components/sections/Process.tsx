"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { phases } from "@/data/process";
import { TextReveal } from "@/components/motion/TextReveal";
import { cx } from "@/lib/utils";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(phases.length - 1, Math.floor(v * phases.length));
    setActive((prev) => (prev === next ? prev : next));
  });

  const phase = phases[active];

  return (
    <section id="process" className="relative bg-paper" aria-labelledby="process-heading">
      {/* ---- Heading ---- */}
      <div className="shell-wide pb-[clamp(1rem,3vh,3rem)] pt-[clamp(5rem,12vh,9rem)]">
        <span className="sticker sticker-lime">The process</span>
        <TextReveal
          as="h2"
          id="process-heading"
          className="t-display mt-7 max-w-[12ch] text-ink"
          lines={[<>How this</>, <>usually goes.</>]}
        />
      </div>

      {/* ---- Desktop: sticky phase progression ---- */}
      <div
        ref={ref}
        className="relative hidden lg:block"
        style={{ height: `${phases.length * 46}vh` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center">
          <div className="shell-wide grid w-full grid-cols-12 items-center gap-x-10">
            {/* big number */}
            <div className="col-span-3">
              <div className="relative h-[clamp(7rem,13vw,13rem)] overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={phase.number}
                    className="absolute inset-0 block font-medium leading-[0.8] tracking-[-0.06em] text-ink"
                    style={{ fontSize: "clamp(7rem,13vw,13rem)" }}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
                  >
                    {phase.number}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* name + description */}
            <div className="col-span-5 col-start-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="t-section text-ink">{phase.title}</h3>
                  <p className="t-body-lg measure mt-6 text-muted-ink">
                    {phase.blurb}
                  </p>
                  <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                    {phase.deliverables.map((d) => (
                      <li key={d} className="t-meta text-muted-ink">
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* timeline */}
            <div className="col-span-3 col-start-10">
              <ul className="border-t border-[var(--line-paper)]">
                {phases.map((p, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <li
                      key={p.number}
                      className="relative border-b border-[var(--line-paper)]"
                    >
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute inset-y-0 left-0 w-px origin-top bg-accent transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                          on || done ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                      <div className="flex items-center gap-4 py-4 pl-5">
                        <span
                          className={cx(
                            "t-meta transition-colors duration-500",
                            on ? "text-accent" : done ? "text-ink/50" : "text-muted-ink",
                          )}
                        >
                          {p.number}
                        </span>
                        <span
                          className={cx(
                            "text-[0.98rem] tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            on
                              ? "translate-x-1 text-ink"
                              : done
                                ? "text-ink/55"
                                : "text-ink/30",
                          )}
                        >
                          {p.title}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Mobile: plain vertical timeline ---- */}
      <div className="shell-wide pb-[clamp(4rem,10vh,7rem)] pt-12 lg:hidden">
        <ol className="border-t border-[var(--line-paper)]">
          {phases.map((p) => (
            <li key={p.number} className="border-b border-[var(--line-paper)] py-8">
              <div className="flex items-baseline gap-4">
                <span className="t-meta text-accent">{p.number}</span>
                <h3 className="text-[1.6rem] leading-tight tracking-[-0.03em] text-ink">
                  {p.title}
                </h3>
              </div>
              <p className="t-body mt-4 pl-10 text-muted-ink">{p.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 pl-10">
                {p.deliverables.map((d) => (
                  <li key={d} className="t-meta text-muted-ink">
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
