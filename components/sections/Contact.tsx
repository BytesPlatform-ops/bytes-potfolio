"use client";

import Image from "next/image";
import { motion, useTransform } from "motion/react";
import { siteConfig } from "@/lib/site";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { CollageElement } from "@/components/collage/CollageElement";
import { PortraitCollage } from "@/components/collage/PortraitCollage";
import { usePointer } from "@/components/collage/usePointer";
import { GridPatch, Halftone, Plus, Scribble } from "@/components/collage/Marks";

/**
 * Contact.
 *
 * The last vivid moment: near-black ground, cobalt and lime collage, and a
 * different crop of her at the bottom-right so she bookends the page without
 * repeating the hero composition.
 */
export function Contact() {
  const { openEnquiry } = useModals();

  const { px, py, onPointerMove, onPointerLeave } = usePointer();
  const drift = useTransform(px, (v) => v * 8);

  return (
    <section
      id="contact"
      className="relative flex min-h-[92svh] scroll-mt-24 flex-col justify-center overflow-hidden bg-[#0a0a0a] py-[clamp(4.5rem,11vh,8rem)] text-paper"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-labelledby="contact-heading"
    >
      {/* ---- collage bed: a third arrangement of the same library ---- */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ x: drift }}>
        <GridPatch cell={30} className="absolute left-[3%] top-[8%] h-[30vw] w-[26vw] text-paper/[0.08]" />
        <Halftone gap={13} dot={2.2} className="absolute right-[7%] top-[10%] h-[15vw] w-[11vw] text-accent/35" />
        <Scribble className="absolute left-[36%] top-[5%] h-[7vw] w-[20vw] text-paper/25" />
        <Plus className="absolute right-[28%] bottom-[16%] h-4 w-4 text-lime" />
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <CollageElement src="/collage/paper/black-torn-paper.png" width="20vw" className="-right-[4vw] top-[8%]"
          rotate={7} parallax={0.35} px={px} py={py} from="right" delay={0.1} desktopOnly />
        <CollageElement src="/collage/paper/blue-paper.png" width="18vw" className="-left-[6vw] top-[30%]"
          rotate={-8} parallax={0.3} px={px} py={py} from="left" delay={0.18} desktopOnly />
        <CollageElement src="/collage/objects/red-paper-ball-2.png" width="6vw" className="left-[26%] top-[14%]"
          rotate={-14} parallax={0.7} px={px} py={py} delay={0.35} idle desktopOnly />
        <CollageElement src="/collage/doodles/lime-stroke.png" width="11vw" className="left-[8%] bottom-[22%]"
          rotate={5} parallax={0.5} px={px} py={py} delay={0.42} desktopOnly />
        <CollageElement src="/collage/doodles/star-blue.png" width="3vw" className="right-[38%] top-[22%]"
          rotate={0} parallax={0.8} px={px} py={py} delay={0.5} desktopOnly />
      </div>

      {/* ---- her, a third crop ---- */}
      {/* The sign-off. A cut piece rather than set type — it says the line
          already, in her hand, and the polaroid gives the section its ending. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[7%] left-[36%] z-20 hidden w-[clamp(8.5rem,12vw,11rem)] lg:block"
        initial={{ opacity: 0, y: 22, rotate: -6 }}
        whileInView={{ opacity: 1, y: 0, rotate: -3 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      >
        <Image
          src="/separated_elements/sheet1/29_lets_build_something_cool_polaroid.png"
          alt=""
          width={281}
          height={330}
          sizes="13vw"
          className="h-auto w-full"
        />
      </motion.div>

      {/* Up a third, for the same reason as the hero — same height, wider
          frame. She still clears the heading and the CTA row at this size. */}
      <PortraitCollage
        crop="bust"
        width="min(19.5rem,28vw)"
        className="bottom-[6%] right-[5%] hidden lg:block"
        rotate={3}
        parallax={0.3}
        px={px}
        py={py}
        z={5}
      />

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

            {/* The address that sat beside this button is gone — nothing is
                published to write to. The form is the way in, and it says how
                long a reply takes rather than showing an inbox. */}
            <p className="t-body text-paper/70">{siteConfig.responseNote}</p>
          </div>
        </Reveal>

        <Reveal delay={3}>
          <p className="note note-ink mt-10">weird ideas welcome</p>
        </Reveal>
      </div>
    </section>
  );
}
