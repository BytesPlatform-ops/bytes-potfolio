"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { projects } from "@/data/projects";
import { BrowserFrame, DeviceFrame } from "@/components/ui/BrowserFrame";
import { useCursor } from "@/components/motion/CursorProvider";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const [nonnis, cross, taleem] = projects;

/**
 * The one visual idea of the hero: a working portfolio collage that bleeds
 * off the right edge and drifts toward Selected Work as you scroll.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const cursor = useCursor();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Different depths move at different rates — that's the whole trick.
  const yA = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-14%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const yC = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-46%"]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 90, damping: 24, mass: 0.7 });
  const my = useSpring(py, { stiffness: 90, damping: 24, mass: 0.7 });

  const tiltA = useTransform(mx, [-1, 1], [1.1, -1.1]);
  const shiftA = useTransform(mx, [-1, 1], [10, -10]);
  const shiftB = useTransform(mx, [-1, 1], [-16, 16]);
  const liftB = useTransform(my, [-1, 1], [-8, 8]);
  const shiftC = useTransform(mx, [-1, 1], [22, -22]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  const linkProps = (name: string) => ({
    onPointerEnter: () => cursor.set("view", "VIEW"),
    onPointerLeave: () => cursor.reset(),
    "aria-label": `${name} — open the live site in a new tab`,
    target: "_blank" as const,
    rel: "noreferrer noopener",
  });

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative h-[94vw] w-full max-w-none sm:h-[62vw] lg:h-full"
    >
      {/* A — foreground, bleeds off the right edge */}
      <motion.a
        href={nonnis.url}
        {...linkProps(nonnis.name)}
        className="absolute left-0 top-0 z-10 w-[80%] sm:w-[74%] lg:left-[12%] lg:top-0 lg:w-[92%]"
        style={{ y: yA, rotate: reduce ? 0 : tiltA, x: reduce ? 0 : shiftA }}
        initial={{ opacity: 0, y: 34, clipPath: "inset(8% 0% 8% 0%)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      >
        <BrowserFrame url={nonnis.url}>
          <Image
            src={nonnis.desktopImage}
            alt={nonnis.desktopImageAlt ?? nonnis.name}
            width={2000}
            height={1250}
            priority
            quality={86}
            sizes="(max-width: 1024px) 74vw, 42vw"
            className="h-auto w-full"
          />
        </BrowserFrame>
      </motion.a>

      {/* B — secondary, sits lower-left and overlaps A */}
      <motion.a
        href={cross.url}
        {...linkProps(cross.name)}
        className="absolute bottom-0 right-[-5%] z-20 w-[58%] sm:w-[52%] lg:bottom-[6%] lg:left-[-10%] lg:right-auto lg:w-[62%]"
        style={{ y: yB, x: reduce ? 0 : shiftB, translateY: reduce ? 0 : liftB }}
        initial={{ opacity: 0, y: 46, clipPath: "inset(10% 0% 10% 0%)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
      >
        <BrowserFrame url={cross.url}>
          <Image
            src={cross.desktopImage}
            alt={cross.desktopImageAlt ?? cross.name}
            width={2000}
            height={1250}
            quality={82}
            sizes="(max-width: 1024px) 52vw, 30vw"
            className="h-auto w-full"
          />
        </BrowserFrame>
      </motion.a>

      {/* C — mobile crop, front-most, hangs off the right */}
      <motion.a
        href={taleem.url}
        {...linkProps(taleem.name)}
        className="absolute bottom-[8%] left-[2%] z-30 w-[22%] sm:w-[17%] lg:bottom-auto lg:left-auto lg:right-[-3%] lg:top-[46%] lg:w-[16%]"
        style={{ y: yC, x: reduce ? 0 : shiftC }}
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
      >
        <DeviceFrame>
          <Image
            src={taleem.mobileImage ?? taleem.desktopImage}
            alt={`${taleem.name} on mobile`}
            width={780}
            height={1688}
            quality={82}
            sizes="(max-width: 1024px) 19vw, 10vw"
            className="h-auto w-full"
          />
        </DeviceFrame>
      </motion.a>
    </div>
  );
}
