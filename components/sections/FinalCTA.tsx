"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { siteConfig } from "@/lib/site";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { TextReveal } from "@/components/motion/TextReveal";
import { useCursor } from "@/components/motion/CursorProvider";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { openEnquiry } = useModals();
  const cursor = useCursor();
  const reduce = useSafeReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 22, mass: 0.9 });
  const sy = useSpring(py, { stiffness: 60, damping: 22, mass: 0.9 });

  // 1–2% of viewport, no more.
  const wx = useTransform(sx, [-1, 1], ["1.4%", "-1.4%"]);
  const wy = useTransform(sy, [-1, 1], ["1%", "-1%"]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      ref={ref}
      id="contact"
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden bg-[#050506] py-[clamp(5rem,12vh,9rem)] text-paper"
      aria-labelledby="final-cta-heading"
    >
      {/* oversized watermark */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-4%] select-none text-center font-medium leading-[0.72] tracking-[-0.06em] text-white/[0.035]"
        style={{ fontSize: "clamp(9rem,26vw,30rem)", x: wx, y: wy }}
      >
        BYTES
      </motion.span>

      <div className="shell-wide relative z-10">
        <span className="t-label text-muted">Have a project in mind?</span>

        <TextReveal
          as="h2"
          id="final-cta-heading"
          className="mt-8 font-medium leading-[0.88] tracking-[-0.05em] text-paper"
          lineClassName="[font-size:clamp(2.6rem,9vw,9.5rem)]"
          lines={[
            <>Let&rsquo;s make your</>,
            <>website impossible</>,
            <>
              to{" "}
              <span className="group relative inline-block">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-accent">
                  ignore.
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[0.1em] h-[0.06em] origin-right scale-x-0 bg-accent transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100"
                />
              </span>
            </>,
          ]}
        />

        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-center gap-3.5">
          <MagneticButton onClick={openEnquiry} tone="paper" size="lg">
            Start a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
          <MagneticButton
            as="a"
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Booking a call")}`}
            variant="outline"
            tone="paper"
            size="lg"
          >
            Book a Call
          </MagneticButton>
        </div>

        <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-[var(--line-ink)] pt-8">
          <div>
            <a
              href={`mailto:${siteConfig.email}`}
              onPointerEnter={() => cursor.set("link")}
              onPointerLeave={() => cursor.reset()}
              className="group relative inline-block text-[clamp(1.15rem,2vw,1.8rem)] tracking-[-0.03em] text-paper"
            >
              {siteConfig.email}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100"
              />
            </a>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="mt-2 block text-[clamp(1.15rem,2vw,1.8rem)] tracking-[-0.03em] text-muted transition-colors duration-300 hover:text-paper"
            >
              {siteConfig.phone}
            </a>
          </div>
          <p className="t-meta text-muted">{siteConfig.responseNote}</p>
        </div>
      </div>
    </section>
  );
}
