"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { siteConfig } from "@/lib/site";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { Portrait } from "./Portrait";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import {
  GridPatch,
  Halftone,
  PaperScrap,
  Plus,
  Scribble,
} from "@/components/collage/Marks";

/**
 * Contact.
 *
 * The last vivid moment: near-black ground, cobalt and lime collage, and a
 * different crop of her at the bottom-right so she bookends the page without
 * repeating the hero composition.
 */
export function Contact() {
  const { openEnquiry } = useModals();
  const reduce = useSafeReducedMotion();

  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const drift = useTransform(sx, (v) => v * 8);

  return (
    <section
      id="contact"
      className="relative flex min-h-[92svh] scroll-mt-24 flex-col justify-center overflow-hidden bg-[#0a0a0a] py-[clamp(4.5rem,11vh,8rem)] text-paper"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
      }}
      onPointerLeave={() => mx.set(0)}
      aria-labelledby="contact-heading"
    >
      {/* ---- collage bed ---- */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ x: drift }}>
        <GridPatch cell={22} className="absolute left-[3%] top-[10%] h-[24rem] w-[22rem] text-paper/[0.07]" />
        <Halftone gap={12} dot={2} className="absolute right-[6%] top-[12%] h-[14rem] w-[11rem] text-accent/35" />
        <span
          className="absolute -left-20 top-[26%] h-[12rem] w-[15rem] bg-accent"
          style={{ borderRadius: "8% 22% 6% 20% / 14% 6% 18% 8%" }}
        />
        <PaperScrap className="absolute left-[22%] top-[16%] h-14 w-14 -rotate-12" />
        <Plus className="absolute right-[28%] bottom-[18%] h-4 w-4 text-lime" />
        <Scribble className="absolute left-[38%] top-[6%] h-14 w-40 text-paper/25" />
      </motion.div>

      {/* ---- her, a different crop ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[8%] right-[5%] hidden h-[15rem] w-[10.5rem] lg:block"
      >
        <div className="relative h-full w-full tilt-r opacity-90">
          <span
            className="absolute -inset-2 bg-lime"
            style={{ borderRadius: "6% 18% 5% 16% / 10% 6% 14% 8%" }}
          />
          <Portrait sizes="15rem" className="relative h-full w-full" />
        </div>
      </div>

      <div className="shell-wide relative z-10">
        <span className="sticker sticker-lime">Contact</span>

        <TextReveal
          as="h2"
          id="contact-heading"
          className="mt-7 max-w-[15ch] font-medium leading-[0.86] tracking-[-0.055em] text-paper [font-size:clamp(2.8rem,8.5vw,8rem)]"
          lines={[<>Got something</>, <>worth making?</>]}
        />

        <Reveal delay={1}>
          <p className="serif-i mt-5 text-[clamp(1.4rem,3vw,2.4rem)] text-lime">
            Tell me everything.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-center gap-x-8 gap-y-5">
            <button
              type="button"
              onClick={openEnquiry}
              className="group/cta inline-flex items-center gap-3 bg-paper px-8 py-4 text-[1rem] font-medium tracking-[-0.015em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
              style={{ borderRadius: "14px 4px 14px 4px" }}
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:rotate-45" />
            </button>

            <a
              href={`mailto:${siteConfig.email}`}
              className="group relative text-[clamp(1.05rem,2vw,1.6rem)] tracking-[-0.03em] text-paper/85"
            >
              {siteConfig.email}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-lime transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100"
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={3}>
          <p className="note note-ink mt-10">weird ideas welcome</p>
        </Reveal>
      </div>
    </section>
  );
}
