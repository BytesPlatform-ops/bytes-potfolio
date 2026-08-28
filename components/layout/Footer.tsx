import { siteConfig } from "@/lib/site";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { DotTrail, Halftone, InkArrow, Plus } from "@/components/collage/Marks";

/**
 * Footer.
 *
 * One name, one line, three links. The four-column corporate footer this
 * replaced was carrying navigation the page already gives you twice.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] pb-9 pt-[clamp(3rem,8vh,5.5rem)] text-paper">
      <Halftone
        gap={12}
        dot={1.7}
        className="pointer-events-none absolute -right-6 top-6 h-40 w-56 text-paper/[0.07]"
      />
      <Plus className="pointer-events-none absolute left-[12%] top-10 h-4 w-4 text-lime/60" />
      {/* Minimal by design — the footer is an ending, not another section. */}
      <DotTrail aria-hidden="true" className="pointer-events-none absolute right-[8%] top-14 hidden h-3 w-28 text-paper/20 lg:block" />
      <InkArrow aria-hidden="true" className="pointer-events-none absolute bottom-[18%] right-[6%] hidden h-6 w-16 -rotate-[14deg] text-paper/25 lg:block" />

      <div className="shell-wide relative">
        <p
          className="font-medium leading-[0.82] tracking-[-0.055em]"
          style={{ fontSize: "clamp(3.2rem,13vw,11rem)" }}
        >
          {siteConfig.name}
        </p>
        <p className="note note-ink mt-4">WordPress / Shopify / Webflow</p>

        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-[var(--line-ink)] pt-7">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <li>
              <AnimatedLink href={siteConfig.social.linkedin} external className="text-[1.02rem] text-paper/85">
                LinkedIn
              </AnimatedLink>
            </li>
            <li>
              <AnimatedLink href="#top" className="text-[1.02rem] text-paper/85">
                Back to top
              </AnimatedLink>
            </li>
          </ul>

          <p className="t-meta text-muted">
            © 2026 {siteConfig.name}
            <span aria-hidden="true" className="mx-2.5 opacity-40">
              ·
            </span>
            Made by me.
          </p>
        </div>
      </div>
    </footer>
  );
}
