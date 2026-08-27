"use client";

import Image from "next/image";
import { me, portrait } from "@/lib/site";
import { cx } from "@/lib/utils";
import { GridPatch, Halftone, Corners } from "@/components/collage/Marks";

/**
 * Baneen, as part of the collage.
 *
 * When a real photograph exists it is masked into the composition. Until then
 * this renders a designed frame — grid, halftone, registration corners and an
 * initial — rather than a stock face. There is a photograph of a man in this
 * repo used as a mood reference; presenting it as Baneen would misrepresent
 * two real people, so the placeholder is honest and obviously swappable.
 *
 * To go live: drop `public/profile/baneen.webp` in and set
 * `portrait.hasPortrait = true` in lib/site.ts. Nothing else changes.
 */
export function Portrait({
  className,
  priority = false,
  sizes = "(max-width: 768px) 62vw, 26vw",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (portrait.hasPortrait) {
    return (
      <div className={cx("relative overflow-hidden", className)}>
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority={priority}
          quality={92}
          sizes={sizes}
          className="object-cover object-top"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ background: "linear-gradient(180deg,rgba(242,238,227,0.08),rgba(243,78,50,0.06))" }}
        />
      </div>
    );
  }

  return (
    <div
      className={cx(
        "relative overflow-hidden bg-[#dcd6c6]",
        className,
      )}
      role="img"
      aria-label={`${me.name} — portrait to come`}
    >
      <GridPatch cell={16} className="absolute inset-0 h-full w-full text-ink/[0.2]" />
      <Halftone
        gap={11}
        dot={1.9}
        className="absolute inset-y-0 right-0 h-full w-1/2 text-ink/[0.16]"
      />
      {/* the shoulders/head suggestion, not a face */}
      <svg
        viewBox="0 0 100 130"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <circle cx="50" cy="46" r="21" fill="var(--color-ink)" opacity="0.26" />
        <path d="M12 130c4-24 18-36 38-36s34 12 38 36z" fill="var(--color-ink)" opacity="0.26" />
      </svg>
      <span className="absolute inset-x-0 top-[34%] text-center serif text-[clamp(2.4rem,5.5vw,3.8rem)] leading-none text-paper/80">
        {me.name[0]}
      </span>
      <Corners className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-ink/25" />
      <span className="t-label absolute inset-x-0 bottom-2.5 text-center text-[0.45rem] text-ink/35">
        portrait to come
      </span>
    </div>
  );
}
