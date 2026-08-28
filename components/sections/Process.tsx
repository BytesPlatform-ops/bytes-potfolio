"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { phases } from "@/data/process";
import { portfolioProjects } from "@/data/portfolio";
import { TextReveal } from "@/components/motion/TextReveal";
import { CollageElement } from "@/components/collage/CollageElement";
import { usePointer } from "@/components/collage/usePointer";
import {
  DotTrail,
  GridPatch,
  Halftone,
  PaperPlane,
  PATH_NODES,
  PATH_VIEWBOX,
  ProcessPath,
  ProcessPathVertical,
} from "@/components/collage/Marks";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { cx } from "@/lib/utils";

/** No bounce anywhere in this section — the brief was explicit. */
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A different site per step, so the visual moves with the journey instead of
 * one screenshot sitting there through all five. Each is picked for what the
 * step is about rather than at random — discovery, structure, art direction,
 * the build, the launch.
 */
const STEP_SITES = ["eleken", "terminal-industries", "lusion", "cuberto", "flowers-for-society"];

const SHOWCASE = STEP_SITES.map(
  (slug) => portfolioProjects.find((p) => p.slug === slug) ?? portfolioProjects[0],
);

/**
 * One colour per step, from the site's four.
 *
 * `dot` is what the travelling marker becomes; `ink` tints the step's own
 * number and label so the highlight and the marker always agree. Ship gets a
 * lime ring on a coral dot — the only step that uses two, because it is the
 * one that ends the sequence.
 */
const STEP_COLOR = [
  { dot: "var(--color-coral)", ink: "var(--color-coral)", ring: "var(--color-paper)" },
  { dot: "var(--color-accent)", ink: "var(--color-accent)", ring: "var(--color-paper)" },
  { dot: "var(--color-lime-deep)", ink: "var(--color-lime-deep)", ring: "var(--color-paper)" },
  { dot: "var(--color-ink)", ink: "var(--color-ink)", ring: "var(--color-paper)" },
  { dot: "var(--color-coral)", ink: "var(--color-coral)", ring: "var(--color-lime)" },
] as const;

/**
 * Per-step collage. Each step gets its own small arrangement so the journey
 * is legible as five distinct places rather than one layout with the numbers
 * swapped. Deliberately three or four pieces each — the section already has
 * scenery of its own, and stacking more turns it into a sticker board.
 */
function StepScene({ index }: { index: number }) {
  const piece = (delay: number) => ({
    initial: { opacity: 0, y: 16, rotate: -4, scale: 0.94 },
    animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.97 },
    transition: { duration: 0.55, ease: EASE, delay },
  });

  /**
   * Elements come from `public/separated_elements` — the individually cut
   * pieces, never a whole sheet. Several of them carry their own hand
   * lettering ("design + code", "AVAILABLE FOR PROJECTS"), which is why each
   * step's arrangement is chosen rather than generic: the piece says the step.
   */
  const scenes = [
    // 01 TALK — said out loud, over coffee.
    <>
      <motion.div {...piece(0.05)} className="absolute -left-[8%] -top-[4%] w-[36%]">
        <Image src="/separated_elements/sheet2/13_coffee_code_websites_speech_bubble.png" alt="" width={185} height={148} className="h-auto w-full -rotate-3" sizes="18vw" />
      </motion.div>
      <motion.div {...piece(0.14)} className="absolute -right-[6%] bottom-[6%] w-[18%]">
        <Image src="/separated_elements/sheet1/12_coffee_cup.png" alt="" width={151} height={206} className="h-auto w-full rotate-[5deg]" sizes="10vw" />
      </motion.div>
      <motion.div {...piece(0.22)} className="absolute -bottom-[8%] left-[10%] w-[28%]">
        <Image src="/separated_elements/sheet1/32_black_arrow_and_dots.png" alt="" width={242} height={128} className="h-auto w-full rotate-[6deg]" sizes="14vw" />
      </motion.div>
    </>,
    // 02 THINK — the messy part.
    <>
      <motion.div {...piece(0.05)} className="absolute -left-[9%] -top-[5%] w-[34%]">
        <Image src="/separated_elements/sheet1/13_black_scribble_with_lime.png" alt="" width={240} height={142} className="h-auto w-full" sizes="17vw" />
      </motion.div>
      <motion.div {...piece(0.14)} className="absolute -right-[8%] top-[22%] w-[30%]">
        <Image src="/separated_elements/sheet1/19_eye_with_lime_highlight.png" alt="" width={230} height={144} className="h-auto w-full rotate-[4deg]" sizes="15vw" />
      </motion.div>
      <motion.div {...piece(0.2)} className="absolute -bottom-[7%] left-[6%] w-[26%]">
        <Image src="/separated_elements/sheet2/17_black_torn_paper.png" alt="" width={219} height={115} className="h-auto w-full -rotate-3" sizes="13vw" />
      </motion.div>
    </>,
    // 03 DESIGN — making it look like itself.
    <>
      <motion.div {...piece(0.05)} className="absolute -left-[7%] top-[0%] w-[24%]">
        <Image src="/separated_elements/sheet1/11_blue_flower.png" alt="" width={176} height={169} className="h-auto w-full -rotate-6" sizes="12vw" />
      </motion.div>
      <motion.div {...piece(0.15)} className="absolute -right-[5%] -top-[5%] w-[24%]">
        <Image src="/separated_elements/sheet1/06_blue_tape_strip.png" alt="" width={175} height={90} className="h-auto w-full rotate-[14deg]" sizes="12vw" />
      </motion.div>
      <motion.div {...piece(0.23)} className="absolute -bottom-[6%] right-[18%] w-[10%]">
        <Image src="/separated_elements/sheet1/14_cursor_arrow.png" alt="" width={86} height={130} className="h-auto w-full" sizes="6vw" />
      </motion.div>
    </>,
    // 04 BUILD — the actual thing.
    <>
      <motion.div {...piece(0.05)} className="absolute -left-[9%] bottom-[2%] w-[30%]">
        <Image src="/separated_elements/sheet1/15_crt_monitor_smiley.png" alt="" width={238} height={254} className="h-auto w-full -rotate-3" sizes="15vw" />
      </motion.div>
      <motion.div {...piece(0.15)} className="absolute -right-[7%] -top-[6%] w-[26%]">
        <Image src="/separated_elements/sheet1/07_design_code_note.png" alt="" width={186} height={148} className="h-auto w-full rotate-[7deg]" sizes="13vw" />
      </motion.div>
      <motion.div {...piece(0.22)} className="absolute -bottom-[4%] right-[22%] w-[16%]">
        <Image src="/separated_elements/sheet2/44_blue_tape_small.png" alt="" width={138} height={94} className="h-auto w-full -rotate-[16deg]" sizes="8vw" />
      </motion.div>
    </>,
    // 05 SHIP — sent, and live.
    <>
      <motion.div {...piece(0.05)} className="absolute -left-[6%] -top-[3%] w-[30%] text-ink">
        <PaperPlane className="h-auto w-full" />
      </motion.div>
      <motion.div {...piece(0.14)} className="absolute -bottom-[5%] left-[6%] w-[52%]">
        <Image src="/separated_elements/sheet1/21_available_for_projects_pill.png" alt="" width={281} height={72} className="h-auto w-full -rotate-2" sizes="24vw" />
      </motion.div>
      <motion.div {...piece(0.22)} className="absolute -right-[5%] top-[14%] w-[14%]">
        <Image src="/separated_elements/sheet2/11_lime_circle.png" alt="" width={112} height={114} className="h-auto w-full" sizes="8vw" />
      </motion.div>
    </>,
  ];

  return <>{scenes[index]}</>;
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useSafeReducedMotion();
  const { px, py, onPointerMove, onPointerLeave } = usePointer();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(phases.length - 1, Math.max(0, Math.floor(v * phases.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  /**
   * Clicking a step scrolls the pinned range to that step rather than setting
   * state directly — otherwise the click and the scroll position disagree and
   * the next wheel tick snaps the user somewhere they didn't ask for.
   */
  const goTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    // Document-absolute, not `offsetTop`: the section is positioned, so it is
    // this element's offsetParent and `offsetTop` would be measured from the
    // section rather than from the top of the page.
    const docTop = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const top = docTop + ((i + 0.5) / phases.length) * travel;

    // Lenis, when it is running, owns window.scrollY — a native scrollTo gets
    // overwritten on its next frame. Offer the scroll to it first and only
    // fall back to native if nothing claimed it.
    const claimed = !window.dispatchEvent(
      new CustomEvent("site:scroll-to", { detail: { top }, cancelable: true }),
    );
    if (!claimed) window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  /**
   * The marker rides the real geometry.
   *
   * Interpolating between the two node coordinates would cut the corner —
   * the line bows between stops, so a straight tween leaves the dot off the
   * track for most of its travel. Instead the path is measured once, the
   * arc-length of each stop is found on it, and the marker animates along
   * that length and reads its position back off the curve.
   */
  const pathRef = useRef<SVGPathElement>(null);
  // A ref, not state: nothing in the render output reads these — only the
  // animation effect below does — so storing them in state would schedule a
  // render for a value no render uses.
  const nodeLengths = useRef<number[]>([]);
  const travel = useMotionValue(0);
  const mx = useMotionValue<number>(PATH_NODES[0].x);
  const my = useMotionValue<number>(PATH_NODES[0].y);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const total = el.getTotalLength();
    // Coarse scan then refine: enough to land within a fraction of a pixel,
    // and it runs once rather than per frame.
    const nearest = (target: { x: number; y: number }) => {
      let best = 0;
      let bestD = Infinity;
      const scan = (from: number, to: number, steps: number) => {
        for (let i = 0; i <= steps; i++) {
          const len = from + ((to - from) * i) / steps;
          const pt = el.getPointAtLength(len);
          const d = (pt.x - target.x) ** 2 + (pt.y - target.y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = len;
          }
        }
      };
      scan(0, total, 320);
      scan(Math.max(0, best - total / 320), Math.min(total, best + total / 320), 40);
      return best;
    };
    nodeLengths.current = PATH_NODES.map(nearest);
  }, []);

  useMotionValueEvent(travel, "change", (len) => {
    const el = pathRef.current;
    if (!el) return;
    const pt = el.getPointAtLength(len);
    mx.set(pt.x);
    my.set(pt.y);
  });

  useEffect(() => {
    // Declared after the measuring effect, so by the first run the lengths
    // are in place.
    const lengths = nodeLengths.current;
    if (!lengths.length) return;
    const target = lengths[active];
    // First run snaps; every run after it travels.
    if (travel.get() === 0) travel.set(target);
    const controls = animate(travel, target, {
      duration: reduce ? 0 : 0.62,
      ease: EASE,
    });
    return () => controls.stop();
  }, [active, travel, reduce]);

  // Percentages of the viewBox, so the marker tracks the line through the
  // `preserveAspectRatio="none"` stretch at any width.
  const markerLeft = useMotionTemplate`${useTransform(mx, (v) => (v / PATH_VIEWBOX.w) * 100)}%`;
  const markerTop = useMotionTemplate`${useTransform(my, (v) => (v / PATH_VIEWBOX.h) * 100)}%`;

  const phase = phases[active];
  const colour = STEP_COLOR[active];

  return (
    <section
      id="process"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative bg-paper"
      aria-labelledby="process-heading"
    >
      {/* --------- scenery for the heading band only ---------
          Anything meant to be seen *during* the pinned journey has to live
          inside the sticky element: this section is several thousand pixels
          tall, so a piece placed here is far outside the 900px window the
          reader is actually looking at while the steps advance. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden">
        <GridPatch cell={32} className="absolute left-[3%] top-[14%] h-[34vw] w-[30vw] text-ink/[0.09]" />
        <CollageElement src="/collage/doodles/orange-asterisk.png" width="4vw" className="left-[34vw] top-[22%]"
          rotate={0} parallax={0.7} px={px} py={py} delay={0.35} desktopOnly />
      </div>

      {/* ---------------------------- heading ---------------------------- */}
      <div className="shell-wide relative pb-[clamp(1rem,3vh,2.5rem)] pt-[clamp(4.5rem,11vh,8rem)]">
        <span className="sticker sticker-lime">The process</span>
        <TextReveal
          as="h2"
          id="process-heading"
          className="t-display mt-7 max-w-[12ch] text-ink"
          lines={[<>How this</>, <>usually goes.</>]}
        />
        <p className="note mt-5 flex items-center gap-3">
          <DotTrail className="h-3 w-16 text-muted-ink/50" />
          five steps, no surprises
        </p>
      </div>

      {/* ------------------ desktop: the pinned journey ------------------ */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${phases.length * 52}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col">
          {/* Scenery that stays with the reader for the whole journey. One
              oversized paper running off the right edge, one coral object,
              one faint grid, one halftone — the section's quota, not more. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <GridPatch cell={30} className="absolute -left-[6%] top-[6%] h-[40vw] w-[34vw] text-ink/[0.075]" />
            <Halftone gap={13} dot={2.2} className="absolute bottom-[16%] left-[2%] h-[11vw] w-[8vw] text-accent/20" />
            <CollageElement src="/collage/paper/blue-paper.png" width="26vw" className="-right-[11vw] top-[2%]"
              rotate={9} parallax={0.25} px={px} py={py} from="right" delay={0.1} desktopOnly />
            <CollageElement src="/collage/objects/red-paper-ball-2.png" width="6.5vw" className="left-[6vw] bottom-[30%]"
              rotate={-10} parallax={0.55} px={px} py={py} delay={0.25} idle desktopOnly />
            <CollageElement src="/collage/paper/coral-paper-strip.png" width="13vw" className="-left-[3vw] top-[14%]"
              rotate={-7} parallax={0.35} px={px} py={py} from="left" delay={0.18} desktopOnly />
          </div>

          <div className="relative flex flex-1 items-center">
            <div className="shell-wide grid w-full grid-cols-12 items-center gap-x-8">
              {/* ---- the step itself ---- */}
              <div className="relative z-10 col-span-6">
                <div className="flex items-start gap-7">
                  {/* number: scale 0.92 -> 1, no travel */}
                  <div className="relative h-[clamp(5rem,8.5vw,8.5rem)] w-[clamp(6rem,10vw,10rem)] shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={phase.number}
                        className="absolute inset-0 block font-medium leading-[0.78] tracking-[-0.06em] text-ink"
                        style={{ fontSize: "clamp(5rem,8.5vw,8.5rem)" }}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        {phase.number}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="min-w-0 flex-1 pt-[0.6vw]">
                    {/* title: masked reveal */}
                    <div className="overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.h3
                          key={phase.title}
                          className="t-section text-ink"
                          initial={{ y: "105%" }}
                          animate={{ y: "0%" }}
                          exit={{ y: "-105%" }}
                          transition={{ duration: 0.55, ease: EASE }}
                        >
                          {phase.title}
                        </motion.h3>
                      </AnimatePresence>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={phase.number}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.45, ease: EASE, delay: 0.06 }}
                      >
                        <p className="t-body-lg measure mt-5 text-muted-ink">{phase.blurb}</p>

                        <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
                          {phase.deliverables.map((d) => (
                            <li
                              key={d}
                              className="t-label rounded-full border border-[var(--line-paper)] bg-paper/70 px-3.5 py-1.5 text-muted-ink"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>

                        <p className="note note-accent mt-6">{phase.note}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* ---- the scene: this step's site + this step's pieces ---- */}
              <div className="relative col-span-5 col-start-8 h-[clamp(20rem,42vh,30rem)]">
                {/* The taped site swaps with the step. It leaves to one side
                    and the next arrives from the other, so the change reads as
                    a card being replaced on the wall rather than a crossfade
                    in place — and the tape stays put through both. */}
                <div className="absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.figure
                        key={phase.number}
                        initial={{ opacity: 0, x: 26, scale: 0.955, rotate: -1 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotate: -3 + active * 1.4 }}
                        exit={{ opacity: 0, x: -22, scale: 0.97 }}
                        transition={{ duration: 0.62, ease: EASE }}
                      >
                        <div className="relative bg-paper p-2 shadow-[0_26px_60px_-34px_rgba(16,16,16,0.6)]">
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
                            <Image
                              src={SHOWCASE[active].desktopImage}
                              alt=""
                              fill
                              quality={62}
                              sizes="26vw"
                              className="object-cover object-top"
                            />
                          </div>
                          <figcaption className="t-label mt-2 text-[0.55rem] text-muted-ink">
                            {SHOWCASE[active].name}
                          </figcaption>
                        </div>
                      </motion.figure>
                    </AnimatePresence>

                    {/* Outside the swap, so it reads as the tape holding the
                        wall rather than arriving with each new card. */}
                    <Image
                      src="/collage/paper/black-tape.png"
                      alt=""
                      width={80}
                      height={43}
                      className="pointer-events-none absolute -top-4 left-1/2 z-10 w-[4rem] -translate-x-1/2 -rotate-3"
                    />
                  </div>
                </div>

                {/* per-step pieces, on top of the website */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div key={phase.number} className="absolute inset-0">
                      <StepScene index={active} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------- the drawn path + nav -------------------- */}
          <div className="shell-wide relative pb-[9vh]">
            <div className="relative h-[118px] w-full">
              <ProcessPath pathRef={pathRef} className="absolute inset-0 h-full w-full text-ink/60" />

              {/* The marker, riding the line. Position comes off the curve
                  itself; the colour is the step's own, so the dot and the
                  highlighted label always say the same thing. */}
              <motion.span
                aria-hidden="true"
                className="absolute z-10 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: markerLeft, top: markerTop }}
                animate={{
                  backgroundColor: colour.dot,
                  boxShadow: `0 0 0 4px ${colour.ring}`,
                }}
                transition={{ duration: 0.62, ease: EASE }}
              />

              {/* the stops */}
              {phases.map((p, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <button
                    key={p.number}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={on ? "step" : undefined}
                    className="group absolute -translate-x-1/2 cursor-pointer pt-4 text-center"
                    style={{
                      left: `${(PATH_NODES[i].x / PATH_VIEWBOX.w) * 100}%`,
                      top: `${(PATH_NODES[i].y / PATH_VIEWBOX.h) * 100}%`,
                    }}
                  >
                    <span
                      className={cx(
                        "t-label block transition-colors duration-500",
                        !on && (done ? "text-ink/45" : "text-muted-ink/55"),
                      )}
                      style={on ? { color: STEP_COLOR[i].ink } : undefined}
                    >
                      {p.number}
                    </span>
                    <span
                      className={cx(
                        "mt-1 block text-[0.95rem] tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5",
                        on ? "text-ink" : done ? "text-ink/50" : "text-ink/30",
                      )}
                    >
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ------------- mobile: the same journey, running down ------------- */}
      <div className="shell-wide relative pb-[clamp(3.5rem,9vh,6rem)] pt-8 lg:hidden">
        <ol className="relative">
          {phases.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.number} className="relative pl-11">
                {/* the drawn segment between this step and the next */}
                {i < phases.length - 1 ? (
                  <ProcessPathVertical
                    aria-hidden="true"
                    className="absolute left-0 top-9 h-[calc(100%-2.25rem)] w-3 text-ink/30"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => setActive(on ? -1 : i)}
                  aria-expanded={on}
                  className="w-full cursor-pointer py-5 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      "absolute left-0 top-[1.55rem] block h-3 w-3 rounded-full ring-4 ring-paper transition-colors duration-500",
                      !on && "bg-ink/25",
                    )}
                    style={on ? { backgroundColor: STEP_COLOR[i].dot } : undefined}
                  />
                  <span className="flex items-baseline gap-3.5">
                    <span
                      className={cx("t-meta transition-colors", !on && "text-muted-ink")}
                      style={on ? { color: STEP_COLOR[i].ink } : undefined}
                    >
                      {p.number}
                    </span>
                    <span className="text-[1.5rem] leading-tight tracking-[-0.03em] text-ink">{p.title}</span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.42, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="t-body pb-1 text-muted-ink">{p.blurb}</p>

                      {/* The same per-step site as the desktop scene, so the
                          two layouts tell the identical story. */}
                      <figure className="relative mt-5 bg-paper p-1.5 shadow-[0_18px_40px_-28px_rgba(16,16,16,0.55)]">
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
                          <Image
                            src={SHOWCASE[i].desktopImage}
                            alt=""
                            fill
                            quality={58}
                            sizes="90vw"
                            className="object-cover object-top"
                          />
                        </div>
                        <Image
                          src="/collage/paper/black-tape.png"
                          alt=""
                          width={80}
                          height={43}
                          className="absolute -top-3 left-1/2 w-[3rem] -translate-x-1/2 -rotate-3"
                        />
                      </figure>
                      <ul className="mt-4 flex flex-wrap gap-x-2.5 gap-y-2">
                        {p.deliverables.map((d) => (
                          <li
                            key={d}
                            className="t-label rounded-full border border-[var(--line-paper)] px-3 py-1 text-muted-ink"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                      <p className="note note-accent mb-5 mt-4">{p.note}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
