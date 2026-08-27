"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/motion/TextReveal";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const { openEnquiry } = useModals();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-x-clip pb-10 pt-[max(6.5rem,12svh)] lg:pb-12"
      aria-labelledby="hero-heading"
    >
      <div className="shell-wide grid grid-cols-1 items-start gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        {/* ---- Type column ---- */}
        <div className="lg:col-span-7 xl:col-span-7">
          <motion.p
            className="t-label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-ink"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            Independent digital studio
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
            Design + Development
          </motion.p>

          <TextReveal
            as="h1"
            id="hero-heading"
            immediate
            className="t-hero mt-6 text-ink"
            delay={1}
            lines={[
              <>Websites people</>,
              <>
                <span className="serif-i">remember.</span>
              </>,
              <>Built to earn</>,
              <>their keep.</>,
            ]}
          />

          <motion.p
            className="t-body-lg measure mt-8 text-muted-ink"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          >
            Bytes Platform works with ambitious companies on websites, web apps
            and digital products. Strategy, design and build under one roof — the
            same people from first call to launch day.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.68 }}
          >
            <MagneticButton onClick={openEnquiry} size="lg">
              Start a Project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>

            <MagneticButton as="a" href="#work" variant="outline" size="lg">
              See Our Work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* ---- Visual column ---- */}
        <div className="-mx-[var(--gutter)] mt-4 lg:col-span-5 lg:mx-0 lg:mt-0 xl:col-span-5">
          <div className="lg:absolute lg:bottom-[8.5rem] lg:right-0 lg:top-[max(7rem,13svh)] lg:w-[48vw] xl:w-[47vw]">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* ---- Footer rail ---- */}
      <motion.div
        className="shell-wide relative z-40 mt-12 lg:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.95 }}
      >
        <div className="rule mb-5" />
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="t-meta text-muted-ink">
            {siteConfig.availability}
            <span aria-hidden="true" className="mx-2 opacity-40">
              ·
            </span>
            {siteConfig.availabilityWindow}
          </p>
          <a
            href="#work"
            className="group t-label flex items-center gap-2.5 text-muted-ink transition-colors hover:text-ink"
          >
            Scroll
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
