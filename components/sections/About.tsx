"use client";

import { motion } from "motion/react";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { me, siteConfig, personalFacts, tools } from "@/lib/site";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Portrait } from "./Portrait";
import {
  GridPatch,
  Halftone,
  InkArrow,
  PaperScrap,
  Plus,
  Scribble,
  TornPaper,
} from "@/components/collage/Marks";

/**
 * About — the densest collage on the page.
 *
 * Portrait overlapping the copy rather than sitting beside it in a 50/50
 * split, with the full mark vocabulary arranged around her: grid behind,
 * torn paper at the edge, halftone drifting right, scribble above, red scrap
 * near her shoulder. The tools line lives here too, so technology never needs
 * a section of its own.
 */
export function About() {
  return (
    <section
      id="about"
      className="section-y relative scroll-mt-24 overflow-hidden bg-paper"
      aria-labelledby="about-heading"
    >
      {/* ---- collage bed ---- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <GridPatch cell={20} className="absolute left-[2%] top-[8%] h-[30rem] w-[26rem] text-ink/[0.11]" />
        <TornPaper className="absolute -right-14 top-[16%] h-[16rem] w-[18rem] tilt-r" fill="var(--color-coral-soft)" />
        <Halftone gap={11} dot={1.9} className="absolute right-[8%] bottom-[10%] h-[13rem] w-[10rem] text-accent/25" />
        <Plus className="absolute left-[46%] top-[6%] h-4 w-4 text-coral" />
        <Plus className="absolute right-[30%] bottom-[6%] h-3 w-3 text-ink/30" />
      </div>

      <div className="shell-wide relative">
        <div className="grid grid-cols-1 items-start gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(2.5rem,6vh,4rem)] lg:grid-cols-12">
          {/* ---- portrait ---- */}
          <Reveal className="relative lg:col-span-5">
            <div className="relative tilt-l">
              <span
                aria-hidden="true"
                className="absolute -inset-3 -z-10 bg-accent"
                style={{ borderRadius: "5% 20% 6% 18% / 12% 6% 16% 8%" }}
              />
              <Scribble className="absolute -top-10 right-2 h-14 w-36 text-ink/40" />
              <Portrait
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="aspect-[4/5] w-full"
              />
              <PaperScrap className="absolute -bottom-6 -right-6 h-16 w-16 rotate-12" />
            </div>
            <motion.span
              className="note note-accent absolute -bottom-9 left-2"
              initial={{ opacity: 0, rotate: 3 }}
              whileInView={{ opacity: 1, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              yes, I coded it too
            </motion.span>
          </Reveal>

          {/* ---- copy ---- */}
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-[6vh]">
            <span className="sticker sticker-coral">About</span>

            <TextReveal
              as="h2"
              id="about-heading"
              className="t-display mt-6 max-w-[12ch] text-ink"
              lines={[<>Hi, I&rsquo;m {me.name}.</>]}
            />
            <TextReveal
              as="p"
              className="t-section mt-2 max-w-[14ch] text-ink/45"
              lines={[<>Designer brain.</>, <>Developer hands.</>]}
            />

            <div className="measure-wide mt-8 flex flex-col gap-5">
              <Reveal delay={1}>
                <p className="t-body text-muted-ink">
                  I work on websites and digital products from the first messy
                  idea to the final deploy. I like strong typography, unusual
                  layouts, thoughtful motion, and interfaces that feel like they
                  belong to the brand instead of a template.
                </p>
              </Reveal>
              <Reveal delay={2}>
                <p className="t-body text-muted-ink">
                  Design, build, the fiddly bits in between — all me.{" "}
                  <AnimatedLink href={`mailto:${siteConfig.email}`} className="text-ink">
                    Say hello
                  </AnimatedLink>
                  .
                </p>
              </Reveal>
            </div>

            {/* ---- facts ---- */}
            <Reveal delay={3}>
              <dl className="mt-9 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-[var(--line-paper)] pt-6 sm:grid-cols-3">
                {personalFacts.map((f) => (
                  <div key={f.k}>
                    <dt className="t-label text-muted-ink/60">{f.k}</dt>
                    <dd className="mt-1.5 text-[0.92rem] leading-snug tracking-[-0.015em] text-ink">
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* ---- tools, as a line not a section ---- */}
            <Reveal delay={4}>
              <div className="mt-8">
                <p className="t-label text-muted-ink/60">Tools I reach for</p>
                <p className="mt-2.5 text-[clamp(0.95rem,1.4vw,1.15rem)] leading-[1.6] tracking-[-0.015em] text-ink/80">
                  {tools.map((t, i) => (
                    <span key={t}>
                      {t}
                      {i < tools.length - 1 ? (
                        <span aria-hidden="true" className="text-accent">
                          {" / "}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </p>
                <p className="note mt-3 flex items-center gap-2">
                  <InkArrow className="h-4 w-10 text-muted-ink/50" />
                  plus whatever the project actually needs
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
