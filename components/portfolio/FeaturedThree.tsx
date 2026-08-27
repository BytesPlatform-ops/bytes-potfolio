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
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Project 03 — light surface, lots of air.
 * Name enters from the left as the visual enters from the right.
 */
export function FeaturedThree({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const cursor = useCursor();

  const [visualRef, visualInView] = useReveal<HTMLAnchorElement>(0.2);
  const [phoneRef, phoneInView] = useReveal(0.3);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const xName = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-14%", "0%"],
  );
  const xVisual = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["12%", "0%"],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);

  return (
    <article ref={ref} className="relative overflow-x-clip bg-paper pb-[clamp(4rem,9vh,7rem)] pt-[clamp(6rem,15vh,13rem)]">
      <div className="shell-wide">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-8">
          {/* ---- Name & meta ---- */}
          <motion.div
            className="lg:col-span-4"
            style={{ x: xName, opacity }}
          >
            <span className="t-label text-accent">03</span>
            <h3 className="t-section mt-4 max-w-[9ch] text-ink">
              Taleem <span className="serif-i">Network</span>
            </h3>
            <p className="t-body measure mt-7 text-muted-ink">
              {project.description}
            </p>
            <ProjectMeta
              project={project}
              layout="stack"
              className="mt-10 border-t border-[var(--line-paper)] pt-8"
            />
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              onPointerEnter={() => cursor.set("link")}
              onPointerLeave={() => cursor.reset()}
              className="group mt-10 inline-block"
            >
              <ProjectCTA href={project.url} />
            </a>
          </motion.div>

          {/* ---- Visual ---- */}
          <motion.div
            className="relative lg:col-span-8 lg:col-start-5"
            style={{ x: xVisual }}
          >
            <a
              ref={visualRef}
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.name} — open the live site in a new tab`}
              onPointerEnter={() => cursor.set("view", "VIEW")}
              onPointerLeave={() => cursor.reset()}
              className="group relative block lg:mr-[-10vw]"
            >
              {/* Observer sits on the unclipped anchor — a fully-clipped
                  element reports zero intersection and never triggers. */}
              <motion.div
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{
                  clipPath: visualInView
                    ? "inset(0% 0% 0% 0%)"
                    : "inset(0% 0% 100% 0%)",
                }}
                transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
              >
                <BrowserFrame url={project.url}>
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.desktopImage}
                      alt={project.desktopImageAlt ?? project.name}
                      width={2000}
                      height={1250}
                      quality={86}
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-[600ms] group-hover:bg-ink/20"
                    />
                  </div>
                </BrowserFrame>
              </motion.div>
            </a>

            {project.mobileImage ? (
              <motion.div
                ref={phoneRef}
                className="absolute -bottom-[8%] left-[-4%] z-20 w-[22%] max-w-[160px] sm:w-[15%] lg:left-[-7%]"
                initial={{ opacity: 0, y: 34 }}
                animate={
                  phoneInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 }
                }
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                <DeviceFrame>
                  <Image
                    src={project.mobileImage}
                    alt={`${project.name} on mobile`}
                    width={780}
                    height={1688}
                    quality={80}
                    sizes="(max-width: 1024px) 20vw, 11vw"
                    className="h-auto w-full"
                  />
                </DeviceFrame>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </article>
  );
}
