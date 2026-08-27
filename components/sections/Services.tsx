"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/motion/TextReveal";
import { useCursor } from "@/components/motion/CursorProvider";
import { ServiceVisual } from "./ServiceVisual";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function Services() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const cursor = useCursor();
  const reduce = useSafeReducedMotion();

  return (
    <section
      id="services"
      className="section-y relative bg-paper"
      aria-labelledby="services-heading"
    >
      <div className="shell-wide">
        <SectionLabel index="02">What we do</SectionLabel>
        <TextReveal
          as="h2"
          id="services-heading"
          className="t-display mt-7 max-w-[13ch] text-ink"
          lines={[<>Strategy to screen.</>, <>One team.</>]}
        />

        <div className="mt-[clamp(3rem,7vh,5.5rem)] grid grid-cols-1 gap-x-8 lg:grid-cols-12">
          {/* ---- Desktop list (40%) ---- */}
          <div className="hidden lg:col-span-5 lg:block">
            <ul className="border-t border-[var(--line-paper)]">
              {services.map((s, i) => {
                const on = active === i;
                return (
                  <li key={s.id} className="border-b border-[var(--line-paper)]">
                    <button
                      type="button"
                      onPointerEnter={() => {
                        setActive(i);
                        cursor.set("link");
                      }}
                      onPointerLeave={() => cursor.reset()}
                      onFocus={() => setActive(i)}
                      aria-pressed={on}
                      className="group block w-full py-6 text-left"
                    >
                      <span className="flex items-baseline gap-5">
                        <span
                          className={cx(
                            "t-meta w-6 shrink-0 transition-colors duration-300",
                            on ? "text-accent" : "text-muted-ink",
                          )}
                        >
                          {s.number}
                        </span>
                        <span
                          className={cx(
                            "text-[clamp(1.5rem,2.1vw,2.1rem)] leading-tight tracking-[-0.03em] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            on
                              ? "translate-x-2.5 text-ink"
                              : "text-ink/45 group-hover:translate-x-1.5 group-hover:text-ink/80",
                          )}
                        >
                          {s.title}
                        </span>
                      </span>

                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.span
                            className="block overflow-hidden"
                            initial={reduce ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reduce ? undefined : { height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                              opacity: { duration: 0.35, delay: 0.06 },
                            }}
                          >
                            <span className="t-body measure block pl-11 pt-4 text-muted-ink">
                              {s.blurb}
                            </span>
                            <span className="flex flex-wrap gap-x-5 gap-y-1.5 pl-11 pt-5">
                              {s.points.map((p) => (
                                <span key={p} className="t-meta text-muted-ink">
                                  {p}
                                </span>
                              ))}
                            </span>
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ---- Visual (60%) ---- */}
          <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
            <div className="sticky top-[18vh]">
              <ServiceVisual index={active} />
            </div>
          </div>

          {/* ---- Mobile accordion ---- */}
          <div className="lg:hidden">
            <ul className="border-t border-[var(--line-paper)]">
              {services.map((s, i) => {
                const on = openMobile === i;
                return (
                  <li key={s.id} className="border-b border-[var(--line-paper)]">
                    <button
                      type="button"
                      onClick={() => setOpenMobile(on ? null : i)}
                      aria-expanded={on}
                      className="flex w-full items-baseline gap-4 py-6 text-left"
                    >
                      <span
                        className={cx(
                          "t-meta w-6 shrink-0",
                          on ? "text-accent" : "text-muted-ink",
                        )}
                      >
                        {s.number}
                      </span>
                      <span className="flex-1 text-[1.5rem] leading-tight tracking-[-0.03em] text-ink">
                        {s.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cx(
                          "mt-2 block h-3 w-3 shrink-0 transition-transform duration-[380ms]",
                          on ? "rotate-45" : "",
                        )}
                      >
                        <span className="absolute h-px w-3 translate-y-1.5 bg-ink/60" />
                        <span
                          className={cx(
                            "absolute h-3 w-px translate-x-1.5 bg-ink/60 transition-opacity duration-300",
                            on ? "opacity-0" : "opacity-100",
                          )}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.div
                          className="overflow-hidden"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                            opacity: { duration: 0.3 },
                          }}
                        >
                          <div className="pb-8 pl-10">
                            <p className="t-body text-muted-ink">{s.blurb}</p>
                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
                              {s.points.map((p) => (
                                <span key={p} className="t-meta text-muted-ink">
                                  {p}
                                </span>
                              ))}
                            </div>
                            <div className="mt-7">
                              <ServiceVisual index={i} compact />
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
