"use client";

import { Marquee } from "@/components/motion/Marquee";

/**
 * The strip under the hero.
 *
 * Replaces the old "Designed. Developed. Delivered." slogan, which was an
 * agency line wearing a freelancer's name. A scrolling list of what the days
 * actually consist of says the same thing without the boardroom voice.
 */
const WORDS = [
  "design",
  "code",
  "motion",
  "websites",
  "good type",
  "strange ideas",
  "repeat",
];

export function IdentityStrip() {
  return (
    <section
      aria-label="What I do"
      className="relative border-y border-[var(--line-paper)] bg-lime py-[clamp(0.9rem,2.2vh,1.5rem)]"
    >
      <Marquee
        items={WORDS}
        duration={38}
        separator="✦"
        className="text-ink [font-size:clamp(1.3rem,3.4vw,2.6rem)] [font-weight:500] [letter-spacing:-0.03em]"
      />
    </section>
  );
}
