"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";

const lines = [
  "Most websites are forgotten",
  "before the next tab opens.",
];

/** The one visual idea: lines dim as the closing statement lights up. */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const dim = useTransform(scrollYProgress, [0.35, 0.8], [1, 0.24]);
  const finalOpacity = useTransform(scrollYProgress, [0.4, 0.72], [0.15, 1]);
  const finalY = useTransform(scrollYProgress, [0.4, 0.75], [26, 0]);

  return (
    <section
      ref={ref}
      id="about"
      className="on-ink section-y-lg relative"
      aria-labelledby="manifesto-heading"
    >
      <div className="shell-wide">
        <motion.h2
          id="manifesto-heading"
          className="t-display max-w-[18ch] text-paper"
          style={{ opacity: dim }}
        >
          {lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </motion.h2>

        <motion.p
          className="t-display mt-[clamp(1.5rem,4vh,3rem)] text-paper"
          style={{ opacity: finalOpacity, y: finalY }}
        >
          We build the <span className="serif-i text-accent">other kind.</span>
        </motion.p>

        <Reveal
          delay={1}
          className="mt-[clamp(3.5rem,8vh,6.5rem)] border-t border-[var(--line-ink)] pt-10"
        >
          <div className="grid gap-8 md:grid-cols-12">
            <p className="t-body-lg measure text-paper md:col-span-6">
              A website that works isn&rsquo;t a lucky combination of a nice
              layout and a fast host. It knows who it&rsquo;s talking to. It looks
              like nobody else. It doesn&rsquo;t make people think about the
              interface. And it&rsquo;s built well enough that the second year is
              cheaper than the first.
            </p>
            <p className="t-body measure text-muted md:col-span-5 md:col-start-8">
              Miss any one of those and you get the thing most companies end up
              with: a site everyone signed off on and nobody remembers. Getting
              all of them right is the entire job — and it&rsquo;s the reason
              design and development sit at the same desk here.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
