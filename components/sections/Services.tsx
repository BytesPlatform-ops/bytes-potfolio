"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { TextReveal } from "@/components/motion/TextReveal";
import { CollageElement } from "@/components/collage/CollageElement";
import { usePointer } from "@/components/collage/usePointer";
import { Cursor, GridPatch, Plus } from "@/components/collage/Marks";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Things I'm good at.
 *
 * Four words, not six service rows. Hovering one swaps the piece on the right
 * and the accent on the left, so the section is browsed rather than read —
 * which is the point of replacing a capability list with a set of verbs.
 *
 * The panel shows the four design pieces rather than project screenshots.
 * They are finished compositions in their own right — taped mockups carrying
 * their own handwritten labels — so they are shown whole rather than cropped,
 * which is what the old website crops were doing. One image per word; the
 * pairing is a judgement call and is a one-line change each.
 */
const AREAS = [
  {
    id: "design",
    word: "Design",
    does: "web design · UI/UX · creative direction",
    accent: "var(--color-accent)",
    shot: "/bia_z_4_senior_graphic_designer_assets/01_brand_identity.png",
  },
  {
    id: "code",
    word: "Code",
    does: "frontend · web apps · CMS",
    accent: "var(--color-lime-deep)",
    shot: "/bia_z_4_senior_graphic_designer_assets/04_creative_direction.png",
  },
  {
    id: "motion",
    word: "Motion",
    does: "micro-interactions · scroll · creative dev",
    accent: "var(--color-coral)",
    shot: "/bia_z_4_senior_graphic_designer_assets/02_editorial_design.png",
  },
  {
    id: "commerce",
    word: "Commerce",
    does: "Shopify · e-commerce · conversion",
    accent: "var(--color-accent)",
    shot: "/bia_z_4_senior_graphic_designer_assets/03_campaign_visuals.png",
  },
];

export function Services() {
  const [active, setActive] = useState(0);
  const reduce = useSafeReducedMotion();
  const current = AREAS[active];
  const { px, py, onPointerMove, onPointerLeave } = usePointer();

  return (
    <section
      id="skills"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="section-y relative scroll-mt-24 bg-paper"
      aria-labelledby="skills-heading"
    >
      {/* ---- scenery: the list is the subject, so this stays at the edges ----
          One dominant idea here is the pointer — you pick a word and a site
          appears — so the cursor is the only piece allowed near the middle. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GridPatch cell={28} className="absolute -left-[4%] top-[18%] h-[34vw] w-[26vw] text-ink/[0.085]" />
        <CollageElement src="/collage/paper/coral-paper-strip.png" width="15vw" className="-left-[5vw] bottom-[12%]"
          rotate={-8} parallax={0.3} px={px} py={py} from="left" delay={0.15} desktopOnly />
        <CollageElement src="/collage/objects/flower-cobalt.png" width="7vw" className="right-[3vw] top-[6%]"
          rotate={9} parallax={0.5} px={px} py={py} delay={0.28} idle desktopOnly />
        <CollageElement src="/collage/doodles/scribble-loops.png" width="13vw" className="left-[42vw] top-[7%]"
          rotate={-6} opacity={0.5} parallax={0.45} px={px} py={py} delay={0.34} desktopOnly />
        <Cursor className="absolute right-[22vw] top-[42%] hidden h-8 w-7 text-accent/70 lg:block" />
        <Plus className="absolute bottom-[22%] right-[8%] hidden h-4 w-4 text-lime lg:block" />
      </div>

      <div className="shell-wide relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="sticker sticker-accent">Skills</span>
            <TextReveal
              as="h2"
              id="skills-heading"
              className="t-display mt-6 max-w-[13ch] text-ink"
              lines={[<>Things</>, <>I do.</>]}
            />
          </div>
          <p className="note mb-2">pick one →</p>
        </div>

        <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-x-[clamp(2rem,4vw,4rem)] gap-y-8 lg:grid-cols-12">
          {/* the words */}
          <ul className="lg:col-span-7">
            {AREAS.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.id} className="border-b border-[var(--line-paper)]">
                  <button
                    type="button"
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={on}
                    className="group block w-full py-[clamp(1rem,2.4vh,1.9rem)] text-left"
                  >
                    <span
                      className={cx(
                        "block font-medium leading-[0.9] tracking-[-0.05em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        on ? "translate-x-2" : "text-ink/30",
                      )}
                      style={{
                        fontSize: "clamp(2.2rem,6.4vw,5rem)",
                        color: on ? a.accent : undefined,
                      }}
                    >
                      {a.word}
                    </span>
                    <span
                      className={cx(
                        "t-label mt-2 block overflow-hidden text-muted-ink transition-all duration-500",
                        on ? "max-h-10 translate-x-2 opacity-100" : "max-h-0 opacity-0",
                      )}
                    >
                      {a.does}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* the piece */}
          <div className="lg:col-span-5">
            {/* No dark card and no crop. These arrive as cut-outs already
                mounted on their own paper, so a box behind them would be a
                frame around a frame — and `object-cover` sliced the
                handwritten label off the bottom of every one. */}
            <div className="relative aspect-[6/5] w-full tilt-r">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={current.shot}
                    alt=""
                    fill
                    quality={86}
                    sizes="(max-width: 1024px) 92vw, 34vw"
                    className="object-contain object-center drop-shadow-[0_20px_36px_rgba(16,16,16,0.16)]"
                  />
                </motion.div>
              </AnimatePresence>
              {/* The accent bar that used to edge the dark card is gone. With
                  the card removed it floated at the tilt's angle under the
                  piece and read as a stray rule; the active word already
                  carries the colour. */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
