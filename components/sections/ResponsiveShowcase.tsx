"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { responsiveShowcase as project } from "@/data/projects";
import { BrowserFrame, DeviceFrame } from "@/components/ui/BrowserFrame";
import { TextReveal } from "@/components/motion/TextReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const annotations = ["Responsive", "Fast", "Accessible", "Intentional"];

/** The one visual idea: three widths of the same real project, assembling on scroll. */
export function ResponsiveShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "center 0.4"],
  });

  const desktopScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.9, 1]);
  const tabletX = useTransform(scrollYProgress, [0.2, 1], reduce ? ["0%", "0%"] : ["18%", "0%"]);
  const tabletOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const phoneY = useTransform(scrollYProgress, [0.4, 1], reduce ? ["0%", "0%"] : ["26%", "0%"]);
  const phoneOpacity = useTransform(scrollYProgress, [0.4, 0.85], [0, 1]);

  return (
    <section
      ref={ref}
      className="on-ink section-y-lg relative overflow-x-clip"
      aria-labelledby="responsive-heading"
    >
      <div className="shell-wide">
        <SectionLabel tone="paper">Craft / Responsive</SectionLabel>
        <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <TextReveal
            as="h2"
            id="responsive-heading"
            className="t-display max-w-[15ch] text-paper"
            lines={[<>Designed for every screen,</>, <>not shrunk to fit one.</>]}
          />
          <p className="t-small measure text-muted md:pb-3">
            The same project — {project.name} — at three widths. Each one laid out
            on purpose, not left to a breakpoint to sort out.
          </p>
        </div>

        {/* ---- Composition ---- */}
        <div className="relative mt-[clamp(3rem,8vh,6rem)]">
          <div className="grid grid-cols-12 items-end gap-x-4">
            {/* desktop */}
            <motion.div
              className="col-span-12 md:col-span-8"
              style={{ scale: desktopScale, transformOrigin: "left bottom" }}
            >
              <BrowserFrame url={project.url}>
                <Image
                  src={project.desktopImage}
                  alt={`${project.name} at desktop width`}
                  width={2000}
                  height={1250}
                  quality={84}
                  sizes="(max-width: 768px) 100vw, 62vw"
                  className="h-auto w-full"
                />
              </BrowserFrame>
              <p className="t-meta mt-3 text-muted">1440 × 900</p>
            </motion.div>

            {/* tablet */}
            <motion.div
              className="col-span-7 mt-8 md:col-span-3 md:mt-0"
              style={{ x: tabletX, opacity: tabletOpacity }}
            >
              {project.tabletImage ? (
                <BrowserFrame url={project.url} bare className="rounded-[8px]">
                  <Image
                    src={project.tabletImage}
                    alt={`${project.name} at tablet width`}
                    width={1000}
                    height={1333}
                    quality={80}
                    sizes="(max-width: 768px) 58vw, 22vw"
                    className="h-auto w-full"
                  />
                </BrowserFrame>
              ) : null}
              <p className="t-meta mt-3 text-muted">834 × 1112</p>
            </motion.div>

            {/* phone */}
            <motion.div
              className="col-span-4 col-start-9 mt-8 md:col-span-1 md:col-start-12 md:mt-0"
              style={{ y: phoneY, opacity: phoneOpacity }}
            >
              {project.mobileImage ? (
                <DeviceFrame>
                  <Image
                    src={project.mobileImage}
                    alt={`${project.name} at phone width`}
                    width={780}
                    height={1688}
                    quality={80}
                    sizes="(max-width: 768px) 32vw, 8vw"
                    className="h-auto w-full"
                  />
                </DeviceFrame>
              ) : null}
              <p className="t-meta mt-3 text-muted">390 × 844</p>
            </motion.div>
          </div>

          {/* annotations */}
          <ul className="mt-[clamp(2.5rem,6vh,4.5rem)] grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--line-ink)] pt-8 md:grid-cols-4">
            {annotations.map((a, i) => (
              <motion.li
                key={a}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                className="flex items-baseline gap-3"
              >
                <span className="h-1 w-1 shrink-0 translate-y-[-3px] rounded-full bg-accent-soft" />
                <span className="t-label text-paper">{a}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
