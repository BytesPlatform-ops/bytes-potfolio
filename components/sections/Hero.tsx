"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { siteConfig } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { HeroOrbit } from "@/components/portfolio/orbit/HeroOrbit";
import { Portrait } from "./Portrait";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import {
  GridPatch,
  Halftone,
  InkArrow,
  MonitorOutline,
  PaperScrap,
  Plus,
  Scribble,
  TornPaper,
} from "@/components/collage/Marks";


/**
 * The hero.
 *
 * A built collage, not a layout: Baneen at the centre with grid, torn paper,
 * halftone and a pencil loop assembled around her, and four real project
 * screenshots pinned at angles like clippings. The headline runs behind and
 * across her so type and image share space rather than sitting in tidy
 * neighbouring boxes.
 *
 * Depth, back to front: paper texture → collage vectors → pinned work →
 * headline back half → portrait → headline front fragment → annotations.
 * Pointer parallax moves each of those bands a different distance, which is
 * what makes it read as layers of paper instead of one flat picture.
 */
export function Hero() {
  const { openEnquiry } = useModals();
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, reduce ? 1 : 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-14%"]);

  // Pointer parallax. One source, three depths.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 60, damping: 20, mass: 0.7 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const near = useTransform(sx, (v) => v * 4);
  const nearY = useTransform(sy, (v) => v * 4);
  const far = useTransform(sx, (v) => v * 2);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };


  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.85, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden pb-8 pt-[max(5.5rem,10svh)]"
      aria-labelledby="hero-heading"
    >
      {/* The surface the type inverts against. Identical to the page colour,
          so it changes nothing visually — but a background set on the section
          itself sits outside the blending group and `.hero-invert` would have
          nothing to composite with over open paper. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-paper" />

      {/* ================= the work, orbiting ================= */}
      {/* All twenty-five, drifting behind the composition. The wrapper is
          inert; HeroOrbit re-enables hits on the plates themselves so the ring
          stays draggable everywhere the type isn't. */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: fade }}
      >
        <div className="absolute inset-0 opacity-45 lg:opacity-100">
          <HeroOrbit />
        </div>
      </motion.div>

      {/* ================= collage bed ================= */}
      <motion.div className="pointer-events-none absolute inset-0 z-[1]" style={{ opacity: fade, x: far }}>
        {/* left edge group */}
        <GridPatch
          cell={18}
          className="absolute -left-10 top-[14%] h-[26rem] w-[22rem] text-ink/[0.1]"
        />
        <TornPaper
          className="absolute -left-16 top-[52%] h-[13rem] w-[15rem] text-coral-soft/70 tilt-l"
          fill="var(--color-coral-soft)"
        />
        <Halftone
          gap={10}
          dot={1.5}
          className="absolute left-[6%] top-[70%] hidden h-[9rem] w-[11rem] text-ink/[0.13] md:block"
        />
        <InkArrow className="absolute left-[13%] top-[40%] hidden h-8 w-24 rotate-[18deg] text-ink/30 md:block" />

        {/* right edge group */}
        <MonitorOutline className="absolute -right-8 top-[18%] hidden h-[11rem] w-[13rem] text-ink/20 tilt-r md:block" />
        <Halftone
          gap={11}
          dot={1.8}
          className="absolute right-[4%] top-[46%] hidden h-[12rem] w-[9rem] text-accent/25 md:block"
        />
        <PaperScrap className="absolute right-[14%] top-[66%] h-16 w-16 rotate-[14deg]" />
        <Plus className="absolute right-[26%] top-[24%] hidden h-4 w-4 text-ink/35 md:block" />
        <Plus className="absolute left-[30%] top-[80%] hidden h-3 w-3 text-accent/50 md:block" />
      </motion.div>

      {/* ================= top rail ================= */}
      <motion.div
        className="pointer-events-none shell-wide relative z-40"
        style={{ opacity: fade }}
      >
        <div className="flex items-start justify-between gap-6">
          <motion.p className="t-label text-muted-ink" {...enter(0.05)}>
            portfolio &rsquo;26
          </motion.p>
          <motion.p className="t-label flex items-center gap-2.5 text-muted-ink" {...enter(0.1)}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {siteConfig.availability}
          </motion.p>
        </div>
      </motion.div>

      {/* ================= the composition ================= */}
      <motion.div
        className="pointer-events-none relative z-10 flex flex-1 items-center"
        style={{ y: lift, opacity: fade }}
      >
        <div className="shell-wide relative w-full">
          <div className="relative mx-auto flex max-w-[64rem] flex-col items-center">
            {/* headline, back half */}
            <motion.h1
              id="hero-heading"
              className="relative z-10 text-center font-medium leading-[0.84] tracking-[-0.055em] text-ink"
              style={{ fontSize: "clamp(3rem,9.4vw,9rem)" }}
              {...enter(0.18)}
            >
              I make websites
            </motion.h1>

            {/* her */}
            <motion.div
              className="pointer-events-none relative z-20 -mt-[1vw] mb-[-6.5vw] flex justify-center"
              style={{ x: near, y: nearY }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduce ? 0.3 : 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            >
              <div className="relative">
                {/* cobalt slab behind her */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-3 -bottom-3 -top-3 -z-10 bg-accent"
                  style={{ borderRadius: "6% 18% 4% 16% / 10% 5% 14% 7%" }}
                />
                <Scribble className="absolute -top-[2.6rem] -right-10 h-14 w-32 text-ink/40" />
                <Portrait
                  priority
                  className="h-[clamp(12.5rem,29svh,20rem)] w-[clamp(8.5rem,19svh,13.5rem)]"
                />
                <PaperScrap className="absolute -bottom-4 -left-7 h-12 w-12 -rotate-12" />
                <span className="note absolute -right-[7rem] top-[20%] hidden w-[6.5rem] text-left md:block">
                  <span aria-hidden="true">←</span> hi, that&rsquo;s me
                </span>
              </div>
            </motion.div>

            {/* headline, front fragment */}
            <motion.p
              className="relative z-30 text-center font-medium leading-[0.84] tracking-[-0.055em] text-ink"
              style={{ fontSize: "clamp(3rem,9.4vw,9rem)" }}
              {...enter(0.3)}
            >
              with <span className="serif-i text-coral">personality.</span>
            </motion.p>

            <motion.p className="note note-accent mt-5 text-center" {...enter(0.95)}>
              design + code
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* ================= intro + CTA ================= */}
      <motion.div
        className="pointer-events-none shell-wide relative mt-4"
        style={{ opacity: fade }}
      >
        <motion.div
          className="pointer-events-none flex flex-col items-center gap-5"
          {...enter(1.1)}
        >
          {/* No panel behind it — the copy inverts out of whatever it crosses,
              so it reads as ink on paper and as ivory the moment a screenshot
              passes under it. */}
          <p className="hero-invert t-body max-w-[38rem] text-pretty text-center">
            I&rsquo;m Baneen — a designer who codes and a developer who cares far
            too much about typography. I build websites and interactive things
            for brands that don&rsquo;t want to look like everyone else.
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3.5">
            <MagneticButton onClick={openEnquiry} size="lg">
              Let&rsquo;s talk
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#work"
              variant="outline"
              size="lg"
              className="bg-paper/75 backdrop-blur-[2px]"
            >
              See the work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>

      {/* ================= bottom rail ================= */}
      <motion.div
        className="pointer-events-none shell-wide relative z-40 mt-7"
        style={{ opacity: fade }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <p className="note">some things I&rsquo;ve made ↘</p>
          <a
            href="#work"
            className="pointer-events-auto group t-label flex items-center gap-2.5 text-muted-ink transition-colors hover:text-ink"
          >
            scroll
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
