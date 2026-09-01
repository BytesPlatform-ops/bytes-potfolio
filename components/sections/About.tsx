"use client";

import { motion } from "motion/react";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { me, personalFacts, specialties, tools } from "@/lib/site";
import { CollageElement } from "@/components/collage/CollageElement";
import { PortraitCollage } from "@/components/collage/PortraitCollage";
import { usePointer } from "@/components/collage/usePointer";
import { useModals } from "@/components/forms/ModalProvider";
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
  const { openEnquiry } = useModals();

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
        <CollageElement src="/collage/paper/coral-paper-strip.png" width="20vw" className="left-[16vw] -top-[3vw]"
          rotate={-6} parallax={0.3} px={px} py={py} from="top" delay={0.1} desktopOnly />
        <CollageElement src="/collage/paper/blue-tape.png" width="9vw" className="left-[6vw] top-[12%]"
          rotate={-14} parallax={0.5} px={px} py={py} from="left" delay={0.2} desktopOnly z={30} />
        <CollageElement src="/collage/objects/red-paper-ball-3.png" width="5.5vw" className="right-[38vw] top-[5%]"
          rotate={10} parallax={0.7} px={px} py={py} delay={0.4} idle desktopOnly />
        <CollageElement src="/collage/objects/camera.png" width="8vw" className="right-[2vw] top-[38%]"
          rotate={-8} parallax={0.55} px={px} py={py} delay={0.5} desktopOnly />
        <CollageElement src="/collage/objects/wire-globe.png" width="6vw" className="right-[3vw] top-[8%]"
          rotate={6} parallax={0.6} px={px} py={py} delay={0.55} desktopOnly />
      </div>

      <div className="shell-wide relative">
        <div className="grid grid-cols-1 items-start gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(2.5rem,6vh,4rem)] lg:grid-cols-12">
          {/* ---- her ---- */}
          {/* She is positioned absolutely, so this column has to reserve her
              height or she falls across the copy below it. Below `lg` the
              column is full width, and her height is 4/3 of whichever of
              `27rem` / `92%` wins — which crosses a fixed `29rem` at around a
              500px viewport. Tracking it with `min()` follows the same curve
              instead of picking one breakpoint and being wrong either side:
              tight on a phone, capped once she stops growing. */}
          <div className="relative min-h-[min(37rem,116vw)] lg:col-span-5 lg:min-h-[38rem]">
            <PortraitCollage
              crop="frame"
              width="min(27rem,92%)"
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
              yes, I built it too
            </motion.span>
          </div>

          {/* ---- copy ---- */}
          <div className="relative z-10 lg:col-span-6 lg:col-start-7 lg:pt-[5vh]">
            <span className="sticker sticker-coral">About</span>

            {/* The name introduces; the specialisation qualifies it. This is a
                personal portfolio, so the person is the heading and the job
                title is the line underneath — not the other way round. */}
            <TextReveal
              as="h2"
              id="about-heading"
              className="t-display mt-6 max-w-[14ch] text-ink"
              /* The name itself ends in a full stop ("Bia Z."), so the
                 sentence must not add a second one — and must still close
                 properly if the name ever stops ending in one. */
              lines={[<>Hi, I&rsquo;m {me.name}{me.name.endsWith(".") ? "" : "."}</>]}
            />
            <TextReveal
              as="p"
              className="t-section mt-2 max-w-[18ch] text-ink/45"
              lines={[
                <>A {me.role}</>,
                <>specialised in</>,
                <>{me.platforms[0]}, {me.platforms[1]}</>,
                <>&amp; {me.platforms[2]}</>,
              ]}
            />

            <div className="measure-wide mt-8 flex flex-col gap-5">
              <Reveal delay={1}>
                <p className="t-body text-muted-ink">
                  Are you searching for an expert WordPress developer, Shopify
                  developer, or Webflow developer? That&rsquo;s the work:
                  high-performance, responsive, conversion-focused websites,
                  built so your team can run them afterwards.
                </p>
              </Reveal>
              <Reveal delay={2}>
                <p className="t-body text-muted-ink">
                  Want a hand with yours?{" "}
                  {/* Opens the enquiry form rather than an address. Nothing to
                      write to is published, and a dead link reads worse than
                      no link at all. */}
                  <button
                    type="button"
                    onClick={openEnquiry}
                    className="text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
                  >
                    Say hello
                  </button>
                  .
                </p>
              </Reveal>
            </div>

            <Reveal delay={3}>
              <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {specialties.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-baseline gap-2.5 text-[0.95rem] leading-snug tracking-[-0.015em] text-ink/80"
                  >
                    <span aria-hidden="true" className="text-accent">/</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={4}>
              <dl className="mt-9 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-[var(--line-paper)] pt-6 sm:grid-cols-3">
                {personalFacts.map((f) => (
                  <div key={f.k}>
                    <dt className="t-label text-muted-ink/60">{f.k}</dt>
                    <dd className="mt-1.5 text-[0.92rem] leading-snug tracking-[-0.015em] text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={5}>
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
