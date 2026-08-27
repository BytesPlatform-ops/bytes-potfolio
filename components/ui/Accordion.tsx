"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cx } from "@/lib/utils";
import { useCursor } from "@/components/motion/CursorProvider";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export type AccordionItem = { q: string; a: string };

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative block h-3.5 w-3.5 shrink-0"
    >
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span
        className={cx(
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-[380ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          open ? "scale-y-0 rotate-90" : "scale-y-100 rotate-0",
        )}
      />
    </span>
  );
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const reduce = useSafeReducedMotion();
  const cursor = useCursor();

  return (
    <div className="border-t border-[var(--line-paper)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const btnId = `${baseId}-btn-${i}`;

        return (
          <div key={item.q} className="border-b border-[var(--line-paper)]">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                onPointerEnter={() => cursor.set("link")}
                onPointerLeave={() => cursor.reset()}
                className="group flex w-full items-start justify-between gap-6 py-7 text-left md:py-9"
              >
                <span
                  className={cx(
                    "t-sub max-w-[26ch] transition-all duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:max-w-none",
                    isOpen ? "text-ink" : "text-ink/75 group-hover:translate-x-1.5 group-hover:text-ink",
                  )}
                >
                  {item.q}
                </span>
                <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center text-ink/60 transition-colors duration-300 group-hover:text-accent">
                  <PlusMinus open={isOpen} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
                    opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="overflow-hidden"
                >
                  <p className="t-body measure-wide pb-9 pr-8 text-muted-ink md:pl-[max(0px,8vw)]">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
