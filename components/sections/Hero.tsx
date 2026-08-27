"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { siteConfig } from "@/lib/site";
import { portfolioProjects } from "@/data/portfolio";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { CollageElement } from "@/components/collage/CollageElement";
import { PortraitCollage } from "@/components/collage/PortraitCollage";
import { usePointer } from "@/components/collage/usePointer";
import { GridPatch, Halftone, Corners } from "@/components/collage/Marks";

/** Two real projects, pinned like photographs. */
const PINNED = ["cuberto", "star-atlas"] as const;

/**
 * The hero.
 *
 * Built from the separated collage pieces, not from the source sheet — paper,
 * objects, doodles and Baneen each sit on their own layer with their own
 * parallax strength, so the composition has real depth rather than being one
 * flat picture behind the type.
 *
 * Scale hierarchy is deliberate: the grid and the portrait are large, the
 * paper blocks medium, the stars and tape small. Everything decorative is
 * `pointer-events-none` and `aria-hidden`, so none of it reaches the keyboard
 * or a screen reader.
 */
export function Hero() {
  const { openEnquiry } = useModals();
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();
  const { px, py, onPointerMove, onPointerLeave } = usePointer();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  /* Entrance for the inverting copy.
     A blending element cannot composite past an ancestor that opens a stacking
     context, and animating opacity or transform opens one — so the copy's
     entrance and the hero's scroll fade are multiplied into a single value
     applied to the paragraph itself. Its own opacity does not isolate its own
     blend, and its wrappers stay static. */
  const copyIn = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      copyIn.set(1);
      return;
    }
    const run = animate(copyIn, 1, { duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => run.stop();
  }, [copyIn, reduce]);
  const copyOpacity = useTransform([copyIn, fade], ([a, b]: number[]) => a * b);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  const pinned = PINNED.map((s) => portfolioProjects.find((p) => p.slug === s)).filter(Boolean);

  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden pb-8 pt-[max(5.5rem,10svh)]"
      aria-labelledby="hero-heading"
    >
      {/* The surface the copy inverts against. Same colour as the page, so it
          shows nothing — but a background on the section itself sits outside
          the blending group and `.hero-invert` would have nothing to work with
          over open paper. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-paper" />

      {/* ================= layer 1: drawn texture ================= */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: fade }}>
        <GridPatch cell={26} className="absolute -left-[6vw] top-[10%] h-[42vw] w-[32vw] text-ink/[0.13]" />
        <Halftone gap={13} dot={2.2} className="absolute right-[2vw] top-[58%] hidden h-[16vw] w-[12vw] text-accent/25 lg:block" />
      </motion.div>

      {/* ================= layer 2: paper ================= */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: fade }}>
        <CollageElement src="/collage/paper/blue-paper.webp" width="22vw" className="-left-[5vw] top-[12%]"
          rotate={-7} parallax={0.35} px={px} py={py} from="left" delay={0.15} priority />
        <CollageElement src="/collage/paper/coral-paper-strip.webp" width="18vw" className="right-[6vw] top-[6%]"
          rotate={5} parallax={0.3} px={px} py={py} from="top" delay={0.25} desktopOnly />
        <CollageElement src="/collage/paper/blue-paper-strip.webp" width="13vw" className="left-[8vw] bottom-[6%]"
          rotate={-4} parallax={0.45} px={px} py={py} from="bottom" delay={0.35} desktopOnly />
        <CollageElement src="/collage/paper/blue-paper-strip.webp" width="16vw" className="right-[-3vw] bottom-[22%]"
          rotate={-9} parallax={0.4} px={px} py={py} from="right" delay={0.3} desktopOnly />
      </motion.div>

      {/* ================= layer 3: pinned work ================= */}
      <motion.div className="pointer-events-none absolute inset-0 hidden lg:block" style={{ opacity: fade }}>
        {pinned[0] ? <Pin p={pinned[0]} className="left-[6vw] top-[16%] w-[15vw] -rotate-3" delay={0.55} px={px} py={py} /> : null}
        {pinned[1] ? <Pin p={pinned[1]} className="right-[7vw] bottom-[12%] w-[14vw] rotate-2" delay={0.68} px={px} py={py} /> : null}
      </motion.div>

      {/* ================= top rail ================= */}
      <motion.div className="shell-wide relative z-40" style={{ opacity: fade }}>
        <div className="flex items-start justify-between gap-6">
          <motion.p className="t-label text-muted-ink" {...enter(0.05)}>portfolio &rsquo;26</motion.p>
          <motion.p className="t-label flex items-center gap-2.5 text-muted-ink" {...enter(0.1)}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {siteConfig.availability}
          </motion.p>
        </div>
      </motion.div>

      {/* ================= layer 4/5: type + Baneen ================= */}
      <motion.div className="relative z-10 flex flex-1 items-center" style={{ y: lift, opacity: fade }}>
        <div className="shell-wide relative w-full">
          <div className="relative mx-auto flex max-w-[66rem] flex-col items-center">
            <motion.h1
              id="hero-heading"
              className="relative z-10 text-center font-medium leading-[0.84] tracking-[-0.055em] text-ink"
              style={{ fontSize: "clamp(3rem,9.2vw,9rem)" }}
              {...enter(0.18)}
            >
              I make websites
            </motion.h1>

            {/* she sits between the two lines */}
            <div className="relative -mt-[1.5vw] mb-[-7vw] flex h-[clamp(15rem,34svh,26rem)] w-full justify-center">
              <PortraitCollage
                crop="full"
                priority
                width="clamp(11rem,19vw,17rem)"
                className="left-1/2 top-0 -translate-x-1/2"
                parallax={0.22}
                px={px}
                py={py}
                delay={0.42}
                z={20}
              />
              <CollageElement src="/collage/objects/red-paper-ball.webp" width="6vw"
                className="left-[calc(50%-13vw)] top-[52%]" rotate={-12} parallax={0.7} px={px} py={py} delay={0.75} idle desktopOnly z={24} />
              <CollageElement src="/collage/doodles/scribble-loops.webp" width="13vw"
                className="left-[calc(50%+6vw)] top-[6%] text-ink" rotate={8} parallax={0.55} px={px} py={py} delay={0.62} desktopOnly z={24} />
              <span className="note absolute left-[calc(50%+10vw)] top-[38%] hidden w-[7rem] text-left lg:block">
                <span aria-hidden="true">←</span> that&rsquo;s me
              </span>
            </div>

            <motion.p
              className="relative z-30 text-center font-medium leading-[0.84] tracking-[-0.055em] text-ink"
              style={{ fontSize: "clamp(3rem,9.2vw,9rem)" }}
              {...enter(0.3)}
            >
              with <span className="serif-i text-coral">personality.</span>
            </motion.p>

            <motion.p className="note note-accent mt-5 text-center" {...enter(0.95)}>design + code</motion.p>
          </div>
        </div>
      </motion.div>

      {/* ================= intro + CTA ================= */}
      <div className="pointer-events-none shell-wide relative mt-4">
        <div className="flex flex-col items-center gap-5">
          {/* No panel behind it — the copy takes its contrast from whatever
              passes under it: ink over paper, ivory over a screenshot. */}
          <motion.p
            className="hero-invert t-body max-w-[38rem] text-pretty text-center"
            style={{ opacity: copyOpacity }}
          >
            I&rsquo;m Baneen — a designer who codes and a developer who cares far
            too much about typography. I build websites and interactive things
            for brands that don&rsquo;t want to look like everyone else.
          </motion.p>
          <motion.div
            className="pointer-events-auto flex flex-wrap items-center justify-center gap-3.5"
            style={{ opacity: fade }}
            {...enter(1.1)}
          >
            <MagneticButton onClick={openEnquiry} size="lg">
              Let&rsquo;s talk
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton as="a" href="#work" variant="outline" size="lg" className="bg-paper/75 backdrop-blur-[2px]">
              See the work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* ================= bottom rail ================= */}
      <motion.div className="shell-wide relative z-40 mt-7" style={{ opacity: fade }}>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <p className="note">some things I&rsquo;ve made ↘</p>
          <a href="#work" className="group t-label flex items-center gap-2.5 text-muted-ink transition-colors hover:text-ink">
            scroll
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/** A project screenshot pinned to the wall, with tape. */
function Pin({
  p, className, delay, px, py,
}: {
  p: { slug: string; name: string; desktopImage: string };
  className: string;
  delay: number;
  px: ReturnType<typeof usePointer>["px"];
  py: ReturnType<typeof usePointer>["py"];
}) {
  const x = useTransform(px, (v) => v * 14);
  const y = useTransform(py, (v) => v * 9);

  return (
    <>
      <motion.figure
        className={`absolute ${className}`}
        initial={{ opacity: 0, y: 22, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ x, y }}
      >
        <div className="relative bg-paper p-1.5 shadow-[0_18px_40px_-24px_rgba(16,16,16,0.55)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
            <Image src={p.desktopImage} alt="" fill quality={58} sizes="16vw" className="object-cover object-top" />
          </div>
          <Corners className="absolute inset-0 h-full w-full text-ink/20" />
          <Image
            src="/collage/paper/black-tape.webp"
            alt=""
            width={80}
            height={43}
            className="absolute -top-3 left-1/2 w-[3.5rem] -translate-x-1/2 -rotate-3"
          />
        </div>
        <figcaption className="t-label mt-2 text-[0.55rem] text-muted-ink">{p.name}</figcaption>
      </motion.figure>
    </>
  );
}
