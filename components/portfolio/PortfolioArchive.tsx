"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { portfolioProjects } from "@/data/portfolio";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { PortfolioViewer } from "@/components/portfolio/stage/PortfolioViewer";
import type { ViewMode } from "@/components/portfolio/stage/PortfolioViewToggle";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { prettyUrl, cx } from "@/lib/utils";
import { Halftone, Plus } from "@/components/collage/Marks";

/**
 * The archive — all twenty-five, as type.
 *
 * Rows, not cards. The list is the composition; the screenshot only appears
 * when a row is pointed at, riding the cursor so the eye never has to travel
 * to find it. On touch, where there is no hover, every row still opens the
 * viewer — the preview is an enhancement, not the only way in.
 */
export function PortfolioArchive() {
  const [hover, setHover] = useState<number | null>(null);
  /** The list opens on the first five; the rest are one press away. */
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<ViewMode>("desktop");
  const [origin, setOrigin] = useState("50% 50%");
  const reduce = useSafeReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 240, damping: 30, mass: 0.6 });
  const y = useSpring(py, { stiffness: 240, damping: 30, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  const openAt = useCallback((i: number, el: HTMLElement | null) => {
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin(
        `${(((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(1)}% ${(((r.top + r.height / 2) / window.innerHeight) * 100).toFixed(1)}%`,
      );
    }
    setIndex(i);
    setMode("desktop");
    setOpen(true);
  }, []);

  const PREVIEW_ROWS = 5;
  const visible = expanded
    ? portfolioProjects
    : portfolioProjects.slice(0, PREVIEW_ROWS);
  const remaining = portfolioProjects.length - PREVIEW_ROWS;

  const active = hover !== null ? portfolioProjects[hover] : null;

  /** Four hues on a loop, so the wall has rhythm without turning rainbow.
      All four have to hold against midnight — near-black would vanish. */
  const ROW_HUES = [
    "var(--color-lime)",
    "var(--color-coral-soft)",
    "var(--color-paper)",
    "var(--color-accent-soft)",
  ];

  return (
    <>
      <section
        id="work"
        className="section-y relative scroll-mt-24 overflow-hidden bg-midnight text-paper"
        aria-labelledby="archive-heading"
      >
        {/* ---- scenery: near-black, so this is the quietest pass on the site.
             The rows are the composition; decoration only marks the margins. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Halftone gap={14} dot={2.4} className="absolute -right-[3%] top-[6%] h-[22vw] w-[16vw] text-accent/25" />
          <Halftone gap={14} dot={2.4} className="absolute -left-[9%] bottom-[8%] hidden h-[15vw] w-[11vw] text-lime/15 lg:block" />
          <Plus className="absolute right-[14%] bottom-[16%] hidden h-4 w-4 text-lime/70 lg:block" />
        </div>

        <div className="shell-wide relative">
          <span className="sticker sticker-lime">The archive</span>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <TextReveal
              as="h2"
              id="archive-heading"
              className="t-display max-w-[13ch] text-paper"
              lines={[<>Things</>, <>I&rsquo;ve made.</>]}
            />
            <Reveal delay={1} className="md:pb-4">
              <p className="note note-ink">
                25 and counting <span aria-hidden="true">→</span>
              </p>
            </Reveal>
          </div>

          <div
            ref={listRef}
            className="relative mt-[clamp(3rem,7vh,5rem)]"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            <ul id="archive-rows" className="relative z-10">
              {visible.map((p, i) => (
                <li key={p.slug} className="border-b border-white/20">
                  <button
                    type="button"
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") setHover(i);
                    }}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onClick={(e) => openAt(i, e.currentTarget)}
                    data-cursor={p.cursorTheme === "light" ? "view-light" : "view-dark"}
                    aria-label={`${p.name} — ${p.category}, ${p.year}. Open preview.`}
                    className="group grid w-full grid-cols-12 items-baseline gap-x-4 gap-y-1 py-[clamp(0.95rem,1.9vh,1.5rem)] text-left md:gap-6"
                  >
                    <span
                      className={cx(
                        "t-meta tnum col-span-2 transition-all duration-300 md:col-span-1",
                        hover === i ? "-rotate-6" : "text-paper/45",
                      )}
                      style={hover === i ? { color: ROW_HUES[i % 4] } : undefined}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={cx(
                        "col-span-10 min-w-0 text-[clamp(1.15rem,2.2vw,1.9rem)] tracking-[-0.025em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-5",
                        hover === i ? "translate-x-2 font-medium" : "text-paper/90",
                      )}
                      style={hover === i ? { color: ROW_HUES[i % 4] } : undefined}
                    >
                      {p.name}
                    </span>

                    <span className="t-label col-span-8 col-start-3 text-paper/55 md:col-span-4 md:col-start-auto">
                      {p.category}
                    </span>

                    <span className="t-meta tnum col-span-2 text-right text-paper/45">
                      {p.year}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* The preview rides the pointer. Behind the rows so the type
                always wins, and gone the moment you leave the list. */}
            <AnimatePresence>
              {active && !reduce ? (
                <motion.div
                  key="preview"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-0 hidden w-[clamp(20rem,26vw,26rem)] lg:block"
                  style={{ x, y, translateX: "-50%", translateY: "-50%" }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(11,11,12,0.55)]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-soft">
                      <Image
                        src={active.desktopImage}
                        alt=""
                        fill
                        sizes="26vw"
                        quality={70}
                        className="object-cover object-top"
                      />
                    </div>
                    <Image
                      src="/collage/paper/black-tape.png"
                      alt=""
                      width={80}
                      height={43}
                      className="absolute -top-3.5 left-1/2 w-[3.4rem] -translate-x-1/2 -rotate-3"
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={() => {
                setExpanded((v) => !v);
                setHover(null);
              }}
              aria-expanded={expanded}
              aria-controls="archive-rows"
              data-cursor="cta"
              className="group flex items-center gap-3 border-b border-white/25 pb-2 transition-colors hover:border-paper/70"
            >
              <span className="t-label text-paper">
                {expanded ? "Show less" : "View more"}
              </span>
              {!expanded ? (
                <span className="t-meta tnum text-paper/55">+{remaining}</span>
              ) : null}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className={cx(
                  "h-3.5 w-3.5 text-paper/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  expanded ? "rotate-180" : "group-hover:translate-y-0.5",
                )}
              >
                <path
                  d="M8 3v10M3.75 8.75 8 13l4.25-4.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="square"
                />
              </svg>
            </button>

            <p className="t-meta text-paper/55">
              {expanded
                ? `${portfolioProjects.length} live sites`
                : `Showing ${PREVIEW_ROWS} of ${portfolioProjects.length}`}
            </p>
            {active ? (
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group t-label flex items-center gap-2 text-paper/70 transition-colors hover:text-paper"
              >
                {prettyUrl(active.url)}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <PortfolioViewer
        open={open}
        index={index}
        mode={mode}
        projects={portfolioProjects}
        origin={origin}
        onModeChange={setMode}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </>
  );
}
