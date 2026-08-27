"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { indexProjects } from "@/data/projects";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { useCursor } from "@/components/motion/CursorProvider";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Studio archive. Desktop gets a preview that tracks the pointer;
 * touch gets a stacked row with the thumbnail inline instead.
 */
export function ProjectIndex() {
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const cursor = useCursor();
  const reduce = useSafeReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 240, damping: 30, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  if (indexProjects.length === 0) return null;

  return (
    <section
      className="relative bg-paper pb-[clamp(5rem,11vh,9rem)] pt-[clamp(4rem,9vh,7rem)]"
      aria-labelledby="archive-heading"
    >
      <div className="shell-wide">
        <Reveal className="mb-12 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 id="archive-heading" className="t-section max-w-[16ch] text-ink">
            More things we&rsquo;ve <span className="serif-i">shipped.</span>
          </h2>
          <p className="t-meta text-muted-ink md:pb-2">
            {String(indexProjects.length).padStart(2, "0")} live projects
          </p>
        </Reveal>

        <div ref={wrap} className="relative" onPointerMove={onMove}>
          {/* column headings */}
          <div className="t-label hidden grid-cols-12 gap-6 border-b border-[var(--line-paper)] pb-4 text-muted-ink md:grid">
            <span className="col-span-4">Project</span>
            <span className="col-span-3">Industry</span>
            <span className="col-span-4">Services</span>
            <span className="col-span-1 text-right">Year</span>
          </div>

          <ul>
            {indexProjects.map((p, i) => (
              <li key={p.slug} className="border-b border-[var(--line-paper)]">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setActive(i);
                    cursor.set("link");
                  }}
                  onPointerLeave={() => {
                    setActive(null);
                    cursor.reset();
                  }}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-3 py-6 transition-colors duration-500 md:grid-cols-12 md:py-8"
                >
                  <span
                    className={cx(
                      "col-span-4 text-[1.25rem] tracking-[-0.03em] transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:text-[1.6rem] md:group-hover:translate-x-2.5",
                      "text-ink",
                    )}
                  >
                    {p.name}
                  </span>
                  <span className="col-span-3 text-[0.92rem] text-muted-ink transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-1.5">
                    {p.industry}
                  </span>
                  <span className="col-span-4 hidden text-[0.92rem] text-muted-ink transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:block md:group-hover:translate-x-1">
                    {p.services.join(" · ")}
                  </span>
                  <span className="col-span-1 flex items-center justify-between gap-3 md:justify-end">
                    <span className="t-meta text-muted-ink">{p.year}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink opacity-0 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 md:-translate-x-2 md:group-hover:translate-x-0" />
                  </span>

                  {/* touch-friendly inline preview */}
                  <span className="col-span-12 mt-2 block overflow-hidden rounded-md md:hidden">
                    <Image
                      src={p.desktopImage}
                      alt={p.desktopImageAlt ?? p.name}
                      width={1400}
                      height={875}
                      sizes="92vw"
                      quality={72}
                      className="h-auto w-full"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* pointer-tracking preview (desktop) */}
          <AnimatePresence>
            {active !== null && !reduce ? (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-30 hidden w-[22rem] md:block"
                style={{ x: sx, y: sy, translateX: "-50%", translateY: "-52%" }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="overflow-hidden rounded-md shadow-[0_30px_70px_-24px_rgba(10,10,11,0.5)]">
                  <Image
                    src={indexProjects[active].desktopImage}
                    alt=""
                    width={1400}
                    height={875}
                    sizes="352px"
                    quality={74}
                    className="h-auto w-full"
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
