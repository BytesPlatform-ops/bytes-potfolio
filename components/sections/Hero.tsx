"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { siteConfig, me, personalityKeywords } from "@/lib/site";
import { portfolioProjects } from "@/data/portfolio";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { HeroOrbit } from "@/components/portfolio/orbit/HeroOrbit";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { CollageElement } from "@/components/collage/CollageElement";
import { PortraitCollage } from "@/components/collage/PortraitCollage";
import { CurvedTypeRing } from "@/components/collage/CurvedTypeRing";
import { PixelAccents } from "@/components/collage/PixelAccents";
import { usePointer } from "@/components/collage/usePointer";
import { GridPatch, Halftone, Corners } from "@/components/collage/Marks";

/** Two real projects, pinned like photographs. */
const PINNED = ["cuberto", "star-atlas"] as const;

/**
 * The hero.
 *
 * Built from the separated collage pieces, not from the source sheet — paper,
 * objects, doodles and Bia each sit on their own layer with their own
 * parallax strength, so the composition has real depth rather than being one
 * flat picture behind the type.
 *
 * Scale hierarchy is deliberate: the grid and the portrait are large, the
 * paper blocks medium, the stars and tape small. Everything decorative is
 * `pointer-events-none` and `aria-hidden`, so none of it reaches the keyboard
 * or a screen reader.
 */
export function Hero() {
  const { openEnquiry } = useModals();
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();
  const { px, py, onPointerMove, onPointerLeave } = usePointer();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  /* Entrance for the inverting copy.
     A blending element cannot composite past an ancestor that opens a stacking
     context, and animating opacity or transform opens one — so the copy's
     entrance and the hero's scroll fade are multiplied into a single value
     applied to the paragraph itself. Its own opacity does not isolate its own
     blend, and its wrappers stay static. */
  const copyIn = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      copyIn.set(1);
      return;
    }
    const run = animate(copyIn, 1, { duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => run.stop();
  }, [copyIn, reduce]);
  const copyOpacity = useTransform([copyIn, fade], ([a, b]: number[]) => a * b);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  const pinned = PINNED.map((s) => portfolioProjects.find((p) => p.slug === s)).filter(Boolean);

  const enter = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden pb-6 pt-[max(4rem,7svh)]"
      aria-labelledby="hero-heading"
    >
      {/* The surface the copy inverts against. Same colour as the page, so it
          shows nothing — but a background on the section itself sits outside
          the blending group and `.hero-invert` would have nothing to work with
          over open paper. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-paper" />

      {/* ================= layer 0: the work, rotating ================= */}
      <div className="pointer-events-none absolute inset-0">
        <HeroOrbit />
      </div>

      {/* ================= layer 1: drawn texture ================= */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: fade }}>
        <GridPatch cell={26} className="absolute -left-[6vw] top-[10%] h-[42vw] w-[32vw] text-ink/[0.13]" />
        <Halftone gap={13} dot={2.2} className="absolute right-[2vw] top-[58%] hidden h-[16vw] w-[12vw] text-accent/25 lg:block" />
      </motion.div>

      {/* ================= layer 2: paper ================= */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: fade }}>
        <CollageElement src="/collage/paper/blue-paper.png" width="22vw" className="-left-[5vw] top-[12%]"
          rotate={-7} parallax={0.35} px={px} py={py} from="left" delay={0.15} priority />
        <CollageElement src="/collage/paper/coral-paper-strip.png" width="18vw" className="right-[6vw] top-[6%]"
          rotate={5} parallax={0.3} px={px} py={py} from="top" delay={0.25} desktopOnly />
        <CollageElement src="/collage/paper/blue-paper-strip.png" width="13vw" className="left-[8vw] bottom-[6%]"
          rotate={-4} parallax={0.45} px={px} py={py} from="bottom" delay={0.35} desktopOnly />
        <CollageElement src="/collage/paper/blue-paper-strip.png" width="16vw" className="right-[-3vw] bottom-[22%]"
          rotate={-9} parallax={0.4} px={px} py={py} from="right" delay={0.3} desktopOnly />
      </motion.div>

      {/* ================= layer 3: pinned work ================= */}
      <motion.div className="pointer-events-none absolute inset-0 hidden lg:block" style={{ opacity: fade }}>
        {pinned[0] ? <Pin p={pinned[0]} className="left-[6vw] top-[16%] w-[15vw] -rotate-3" delay={0.55} px={px} py={py} /> : null}
        {pinned[1] ? <Pin p={pinned[1]} className="right-[7vw] bottom-[12%] w-[14vw] rotate-2" delay={0.68} px={px} py={py} /> : null}
      </motion.div>

      {/* ================= top rail ================= */}
      <motion.div className="shell-wide relative z-40" style={{ opacity: fade }}>
        <div className="flex items-start justify-between gap-6">
          <motion.p className="t-label hidden whitespace-nowrap text-muted-ink sm:block" {...enter(0.05)}>portfolio &rsquo;26</motion.p>
          <motion.p className="t-label ml-auto flex items-center gap-2.5 whitespace-nowrap text-muted-ink" {...enter(0.1)}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {siteConfig.availability}
          </motion.p>
        </div>
      </motion.div>

      {/* ================= layer 4/5: type + Bia ================= */}
      <motion.div className="relative z-10 flex flex-1 items-center" style={{ y: lift, opacity: fade }}>
        <div className="shell-wide relative w-full">
          <div className="relative mx-auto flex w-full max-w-[70rem] flex-col items-center">
            {/*
              She is placed absolutely rather than in the flow, and that is the
              whole composition. In flow, a portrait big enough to carry the
              hero would push the statement, the paragraph and the buttons off
              the bottom of the screen; behind them, she can run from just
              under the wordmark all the way down past the copy, and the type
              layers over her the way paper layers on paper.

              The crossing point is not arbitrary. Her face occupies the top
              two-thirds of this crop, so every line of type below sits on the
              hijab drape and shoulders instead — measured, not guessed.
            */}
            {/* The curved type, ahead of her in the DOM so she stands inside
                the ring rather than on top of a badge. Two of them, turning
                against each other at different speeds: one ring alone reads as
                a spinning label, two reads as depth. Both sit at a fraction of
                ink so the effect is texture first and words second. */}
            <CurvedTypeRing
              text={`personality · ${personalityKeywords.join(" · ")} · `}
              size="clamp(24rem,45vw,40rem)"
              className="left-1/2 top-[clamp(2.5rem,8vh,5.5rem)] z-0 -translate-x-1/2"
              seconds={82}
              opacity={0.19}
            />
            <CurvedTypeRing
              text={`${me.platforms.join(" · ").toLowerCase()} · figma to cms · `.repeat(2)}
              size="clamp(17rem,32vw,28.5rem)"
              className="left-1/2 top-[clamp(6.5rem,15vh,10.5rem)] z-0 -translate-x-1/2"
              seconds={64}
              reverse
              fontSize={12}
              opacity={0.13}
            />

            {/* Widened by half against the previous figure. That file was
                0.49 wide to its height; this one is a flat 3:4, so holding the
                old width would have lopped a third off her standing height and
                left her floating inside the type rather than carrying it. */}
            <PortraitCollage
              crop="tall"
              priority
              width="clamp(23rem,39vw,35rem)"
              className="left-1/2 top-24 z-0 -translate-x-1/2 lg:top-[clamp(6rem,14.5vh,10rem)]"
              parallax={0.14}
              px={px}
              py={py}
              delay={0.28}
              z={0}
            />

            {/* The positioning rail, above the statement rather than below
                it. Under the second line it fell across her hijab, where
                muted ink on a photograph is barely readable; up here it sits
                on open paper and resolves the identity before the joke. */}
            <motion.p
              className="t-label relative z-10 mb-[clamp(0.6rem,1.6vh,1.1rem)] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-muted-ink"
              {...enter(0.12)}
            >
              <span className="whitespace-nowrap">{me.role}</span>
              {me.platforms.map((platform) => (
                <span key={platform} className="flex items-center gap-x-2 whitespace-nowrap">
                  <span aria-hidden="true" className="text-accent">&middot;</span>
                  {platform}
                </span>
              ))}
            </motion.p>

            {/* The statement, sandwiched around her — the arrangement this
                hero had before and the one that actually reads. Both lines
                are set at the same display scale so they behave as one
                sentence she happens to be standing inside of. */}
            <motion.h1
              id="hero-heading"
              className="relative z-10 text-center font-medium leading-[0.84] tracking-[-0.055em] text-ink"
              style={{ fontSize: "clamp(2.9rem,8.6vw,8.4rem)" }}
              {...enter(0.18)}
            >
              I make websites
            </motion.h1>

            {/* Her scrapbook company, pinned to the same absolute layer she
                is on so nothing here opens a gap between the two lines of the
                statement. The note points at her rather than at the type. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
              <CollageElement src="/collage/objects/red-paper-ball.png" width="5.5vw"
                className="left-[calc(50%-24vw)] top-[clamp(13rem,30vh,19rem)]" rotate={-12} parallax={0.7} px={px} py={py} delay={0.7} idle desktopOnly z={4} />
              {/* The cut note, rather than set type — it is the same hand as
                  the rest of the scrapbook and it points at her itself. */}
              <Image
                src="/separated_elements/sheet2/09_thats_me_note.png"
                alt=""
                width={173}
                height={196}
                sizes="9vw"
                className="absolute left-[calc(50%+13vw)] top-[clamp(11rem,25vh,16rem)] hidden w-[clamp(5.5rem,7.5vw,7rem)] -rotate-3 lg:block"
              />
            </div>

            <motion.p
              className="relative z-10 mt-[clamp(13rem,31vh,21rem)] text-center font-medium leading-[0.84] tracking-[-0.055em] text-ink"
              style={{ fontSize: "clamp(2.9rem,8.6vw,8.4rem)" }}
              {...enter(0.42)}
            >
              with{" "}
              <span className="serif-i relative inline-block text-coral">
                personality.
                <PixelAccents className="pointer-events-none absolute inset-0" />
              </span>
            </motion.p>

          </div>
        </div>
      </motion.div>

      {/* ================= intro + CTA ================= */}
      <div className="pointer-events-none shell-wide relative z-40 mt-2">
        <div className="flex flex-col items-center gap-5">
          {/* A cut paper card, not blended type. The portrait now runs behind
              this band, and `hero-invert` against a photograph of a person
              reads as damage rather than contrast. Laid over her hem, the card
              is also the most honest collage move available: paper on paper. */}
          <motion.p
            className="t-body relative max-w-[36rem] -rotate-[0.6deg] bg-paper/95 px-7 py-5 text-pretty text-center text-muted-ink shadow-[0_22px_50px_-34px_rgba(16,16,16,0.6)] backdrop-blur-[2px]"
            style={{ opacity: copyOpacity, borderRadius: "16px 6px 15px 5px" }}
          >
            I&rsquo;m Bia Zehra, a CMS developer who builds fast, responsive
            WordPress, Shopify and Webflow sites. Figma to CMS, theme and
            template customisation, and the integrations that make it all
            actually work.
          </motion.p>
          <motion.div
            className="pointer-events-auto flex flex-wrap items-center justify-center gap-3.5"
            style={{ opacity: fade }}
            {...enter(1.1)}
          >
            <MagneticButton onClick={openEnquiry} size="lg">
              Let&rsquo;s talk
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton as="a" href="#work" variant="outline" size="lg" className="bg-paper/75 backdrop-blur-[2px]">
              See the work
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* ================= bottom rail ================= */}
      <motion.div className="shell-wide relative z-40 mt-4" style={{ opacity: fade }}>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
          <p className="note">some things I&rsquo;ve made ↘</p>
          <a href="#work" className="group t-label flex items-center gap-2.5 text-muted-ink transition-colors hover:text-ink">
            scroll
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/** A project screenshot pinned to the wall, with tape. */
function Pin({
  p, className, delay, px, py,
}: {
  p: { slug: string; name: string; desktopImage: string };
  className: string;
  delay: number;
  px: ReturnType<typeof usePointer>["px"];
  py: ReturnType<typeof usePointer>["py"];
}) {
  const x = useTransform(px, (v) => v * 14);
  const y = useTransform(py, (v) => v * 9);

  return (
    <>
      <motion.figure
        className={`absolute ${className}`}
        initial={{ opacity: 0, y: 22, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ x, y }}
      >
        <div className="relative bg-paper p-1.5 shadow-[0_18px_40px_-24px_rgba(16,16,16,0.55)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
            <Image src={p.desktopImage} alt="" fill quality={58} sizes="16vw" className="object-cover object-top" />
          </div>
          <Corners className="absolute inset-0 h-full w-full text-ink/20" />
          <Image
            src="/collage/paper/black-tape.png"
            alt=""
            width={80}
            height={43}
            className="absolute -top-3 left-1/2 w-[3.5rem] -translate-x-1/2 -rotate-3"
          />
        </div>
        <figcaption className="t-label mt-2 text-[0.55rem] text-muted-ink">{p.name}</figcaption>
      </motion.figure>
    </>
  );
}
