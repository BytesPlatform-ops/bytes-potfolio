"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { industries } from "@/data/industries";
import { TextReveal } from "@/components/motion/TextReveal";
import { useCursor } from "@/components/motion/CursorProvider";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/** Typographic rows. Hovering reveals a crop of real work — no icons. */
export function Industries() {
  const [active, setActive] = useState<number | null>(null);
  // Rows react to `active`; the plate always has something in it.
  const displayed = active ?? 0;
  const cursor = useCursor();
  const reduce = useSafeReducedMotion();

  return (
    <section className="section-y relative bg-paper" aria-labelledby="industries-heading">
      <div className="shell-wide">
        <TextReveal
          as="h2"
          id="industries-heading"
          className="t-display max-w-[15ch] text-ink"
          lines={[<>Built for teams with</>, <>something worth showing.</>]}
        />

        <div className="mt-[clamp(3rem,7vh,5rem)] grid grid-cols-1 gap-x-10 lg:grid-cols-12">
          <ul className="border-t border-[var(--line-paper)] lg:col-span-7">
            {industries.map((ind, i) => {
              const on = active === i;
              return (
                <li
                  key={ind.name}
                  className="border-b border-[var(--line-paper)]"
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setActive(i);
                    cursor.set("link");
                  }}
                  onPointerLeave={() => {
                    setActive(null);
                    cursor.reset();
                  }}
                >
                  <div className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between md:gap-6 md:py-6">
                    <span
                      className={cx(
                        "text-[clamp(1.5rem,3vw,2.6rem)] leading-none tracking-[-0.035em] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                        on ? "translate-x-2.5 text-ink" : "text-ink/45",
                      )}
                    >
                      {ind.name}
                    </span>
                    {/* Always visible on touch — there is no hover to reveal it. */}
                    <span
                      className={cx(
                        "t-meta shrink-0 text-muted-ink transition-all duration-[420ms] md:text-right",
                        on ? "md:opacity-100" : "md:opacity-0",
                      )}
                    >
                      {ind.note}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* preview panel */}
          <div className="relative mt-10 hidden lg:col-span-5 lg:mt-0 lg:block">
            <div className="sticky top-[22vh] aspect-[4/3] overflow-hidden rounded-md border border-[var(--line-paper)] bg-paper-soft">
              <AnimatePresence>
                {industries[displayed].image ? (
                  <motion.div
                    key={displayed}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
                    animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
                    transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Image
                      src={industries[displayed].image!}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="34vw"
                      quality={72}
                      className="object-cover object-top"
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <p className="t-label pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-5 pb-4 pt-10 text-paper">
                {industries[displayed].name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
