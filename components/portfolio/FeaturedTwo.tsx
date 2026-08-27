"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReveal } from "@/components/motion/useReveal";
import type { Project } from "@/data/projects";
import { BrowserFrame, DeviceFrame } from "@/components/ui/BrowserFrame";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectCTA } from "./ProjectCTA";
import { useCursor } from "@/components/motion/CursorProvider";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Project 02 — asymmetric 65/35 on a dark surface.
 * Desktop frame drifts slower than the copy; the mobile crop drifts faster.
 */
export function FeaturedTwo({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const cursor = useCursor();

  const [desktopRef, desktopInView] = useReveal<HTMLAnchorElement>(0.2);
  const [phoneRef, phoneInView] = useReveal(0.3);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yDesktop = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [34, -34]);
  const yText = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const yMobile = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [90, -90]);

  return (
    <article
      ref={ref}
      className="on-ink relative overflow-x-clip py-[clamp(5rem,13vh,10rem)]"
    >
      <div className="shell-wide">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12 lg:items-center">
          {/* ---- Visual: 65% ---- */}
          <div className="relative lg:col-span-7 xl:col-span-8">
            <motion.a
              ref={desktopRef}
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} — open the live site in a new tab`}
              onPointerEnter={() => cursor.set("view", "VIEW")}
              onPointerLeave={() => cursor.reset()}
              className="group relative block lg:-ml-[8vw] lg:w-[calc(100%+8vw)]"
              style={{ y: yDesktop }}
            >
              {/* The clip lives on the child: a fully-clipped element reports
                  zero intersection, so an observer on it would never fire. */}
              <motion.div
                initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{
                  clipPath: desktopInView
                    ? "inset(0% 0% 0% 0%)"
                    : "inset(0% 100% 0% 0%)",
                }}
                transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
              >
              <BrowserFrame url={project.url}>
                <div className="relative overflow-hidden">
                  <Image
                    src={project.desktopImage}
                    alt={project.desktopImageAlt ?? project.name}
                    width={2000}
                    height={1250}
                    quality={86}
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-[600ms] group-hover:bg-ink/25"
                  />
                </div>
              </BrowserFrame>
              </motion.div>
            </motion.a>

            {/* mobile crop, hanging off the bottom edge */}
            {project.mobileImage ? (
              <motion.div
                ref={phoneRef}
                className="absolute -bottom-[9%] right-[4%] z-20 w-[24%] max-w-[168px] sm:w-[17%] lg:right-[2%]"
                style={{ y: yMobile }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phoneInView ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              >
                <DeviceFrame>
                  <Image
                    src={project.mobileImage}
                    alt={`${project.name} on mobile`}
                    width={780}
                    height={1688}
                    quality={80}
                    sizes="(max-width: 1024px) 22vw, 12vw"
                    className="h-auto w-full"
                  />
                </DeviceFrame>
              </motion.div>
            ) : null}
          </div>

          {/* ---- Info: 35% ---- */}
          <motion.div
            className="lg:col-span-5 lg:pl-[clamp(1rem,4vw,4rem)] xl:col-span-4"
            style={{ y: yText }}
          >
            <span className="t-label text-accent-soft">02</span>
            <TextReveal
              as="h3"
              className="t-section mt-4 text-paper"
              lines={[<>Cross Country</>, <>Asset Recovery</>]}
            />
            <Reveal delay={1}>
              <p className="t-body measure mt-7 text-muted">
                {project.description}
              </p>
              <ProjectMeta
                project={project}
                tone="paper"
                layout="stack"
                className="mt-10 border-t border-[var(--line-ink)] pt-8"
              />
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                onPointerEnter={() => cursor.set("link")}
                onPointerLeave={() => cursor.reset()}
                className="group mt-10 inline-block"
              >
                <ProjectCTA href={project.url} tone="paper" />
              </a>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
