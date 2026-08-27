"use client";

import { motion } from "motion/react";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { me, siteConfig, personalFacts, tools } from "@/lib/site";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { CollageElement } from "@/components/collage/CollageElement";
import { PortraitCollage } from "@/components/collage/PortraitCollage";
import { usePointer } from "@/components/collage/usePointer";
import { GridPatch, Halftone, InkArrow } from "@/components/collage/Marks";

/**
 * About — a different arrangement of the same asset library.
 *
 * Where the hero centres her between two lines of type, here she is large and
 * off to the left with the copy running past her shoulder, a massive grid
 * behind, coral paper entering from the top and a drawn arrow pointing at
 * her. Same vocabulary, different sentence.
 */
export function About() {
  const { px, py, onPointerMove, onPointerLeave } = usePointer();

  return (
    <section
      id="about"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="section-y relative scroll-mt-24 overflow-hidden bg-paper"
      aria-labelledby="about-heading"
    >
      {/* drawn texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <GridPatch cell={30} className="absolute left-[2vw] top-[6%] h-[38vw] w-[34vw] text-ink/[0.12]" />
        <Halftone gap={13} dot={2.2} className="absolute -right-[2vw] bottom-[2%] hidden h-[12vw] w-[9vw] text-accent/20 lg:block" />
      </div>

      {/* paper + objects */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <CollageElement src="/collage/paper/coral-paper-strip.webp" width="20vw" className="left-[16vw] -top-[3vw]"
          rotate={-6} parallax={0.3} px={px} py={py} from="top" delay={0.1} desktopOnly />
        <CollageElement src="/collage/paper/blue-tape.webp" width="9vw" className="left-[6vw] top-[12%]"
          rotate={-14} parallax={0.5} px={px} py={py} from="left" delay={0.2} desktopOnly z={30} />
        <CollageElement src="/collage/objects/red-paper-ball-3.webp" width="6vw" className="right-[30vw] top-[14%]"
          rotate={10} parallax={0.7} px={px} py={py} delay={0.4} idle desktopOnly />
        <CollageElement src="/collage/objects/camera.webp" width="9vw" className="right-[8vw] top-[26%]"
          rotate={-8} parallax={0.55} px={px} py={py} delay={0.5} desktopOnly />
        <CollageElement src="/collage/objects/wire-globe.webp" width="6vw" className="right-[3vw] top-[8%]"
          rotate={6} parallax={0.6} px={px} py={py} delay={0.55} desktopOnly />
      </div>

      <div className="shell-wide relative">
        <div className="grid grid-cols-1 items-start gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(2.5rem,6vh,4rem)] lg:grid-cols-12">
          {/* ---- her ---- */}
          <div className="relative min-h-[26rem] lg:col-span-5 lg:min-h-[34rem]">
            <PortraitCollage
              crop="frame"
              width="min(24rem,90%)"
              className="left-0 top-0"
              rotate={-2.5}
              parallax={0.25}
              px={px}
              py={py}
              z={10}
            />
            <motion.span
              className="note note-accent absolute -bottom-2 right-[6%] z-20 lg:right-0"
              initial={{ opacity: 0, rotate: 4 }}
              whileInView={{ opacity: 1, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              yes, I coded it too
            </motion.span>
          </div>

          {/* ---- copy ---- */}
          <div className="relative z-10 lg:col-span-6 lg:col-start-7 lg:pt-[5vh]">
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

            <Reveal delay={3}>
              <dl className="mt-9 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-[var(--line-paper)] pt-6 sm:grid-cols-3">
                {personalFacts.map((f) => (
                  <div key={f.k}>
                    <dt className="t-label text-muted-ink/60">{f.k}</dt>
                    <dd className="mt-1.5 text-[0.92rem] leading-snug tracking-[-0.015em] text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-8">
                <p className="t-label text-muted-ink/60">Tools I reach for</p>
                <p className="mt-2.5 text-[clamp(0.95rem,1.4vw,1.15rem)] leading-[1.6] tracking-[-0.015em] text-ink/80">
                  {tools.map((t, i) => (
                    <span key={t}>
                      {t}
                      {i < tools.length - 1 ? <span aria-hidden="true" className="text-accent">{" / "}</span> : null}
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
