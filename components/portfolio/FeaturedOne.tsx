"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/data/projects";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectCTA } from "./ProjectCTA";
import { useCursor } from "@/components/motion/CursorProvider";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Project 01 — full-bleed cinematic.
 * The oversized project name rides up from behind the frame on hover.
 */
export function FeaturedOne({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const cursor = useCursor();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [46, -46]);

  return (
    <article ref={ref} className="relative pt-[clamp(3rem,7vh,6rem)]">
      <div className="shell-wide">
        <header className="mb-9 flex flex-col gap-6 md:mb-11 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="t-label text-accent">01</span>
            <TextReveal
              as="h3"
              className="t-display mt-4 text-ink"
              lines={[<>{project.name}</>]}
            />
          </div>
          <Reveal delay={1} className="md:pb-3">
            <p className="t-body measure text-muted-ink">{project.description}</p>
          </Reveal>
        </header>
      </div>

      {/* 90vw cinematic frame */}
      <div className="mx-auto w-[min(92vw,1720px)]">
        <motion.a
          style={{ y }}
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${project.name} — open the live site in a new tab`}
          onPointerEnter={() => cursor.set("view", "VIEW")}
          onPointerLeave={() => cursor.reset()}
          className="group relative block"
          initial={{ clipPath: "inset(6% 0% 6% 0%)", opacity: 0.5 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-0.5deg]">
            <BrowserFrame url={project.url} className="overflow-hidden">
              <div className="relative overflow-hidden">
                <Image
                  src={project.desktopImage}
                  alt={project.desktopImageAlt ?? project.name}
                  width={2000}
                  height={1250}
                  quality={88}
                  sizes="92vw"
                  className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                />
                {/* hover darken */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-[600ms] group-hover:bg-ink/30"
                />
                {/* oversized name rises in */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-[2.4vw] px-[3vw]"
                >
                  <span className="block overflow-hidden">
                    <span className="block translate-y-full text-[clamp(2rem,7vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-paper transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                      {project.name}
                    </span>
                  </span>
                </span>
              </div>
            </BrowserFrame>
          </div>
        </motion.a>
      </div>

      <div className="shell-wide">
        <div className="mt-9 flex flex-col gap-9 border-t border-[var(--line-paper)] pt-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <ProjectMeta project={project} className="md:flex-1" />
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            onPointerEnter={() => cursor.set("link")}
            onPointerLeave={() => cursor.reset()}
            className="group shrink-0"
          >
            <ProjectCTA href={project.url} />
          </a>
        </div>
      </div>
    </article>
  );
}
