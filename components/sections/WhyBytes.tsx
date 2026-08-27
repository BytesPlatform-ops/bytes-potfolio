"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/motion/TextReveal";
import { useCursor } from "@/components/motion/CursorProvider";
import { cx } from "@/lib/utils";

const differentiators = [
  {
    n: "01",
    title: "You talk to the people building it",
    body: "No account manager relaying your feedback to a team you never meet. The person who designed the page is the person who answers your email about it.",
  },
  {
    n: "02",
    title: "Design and development sit together",
    body: "Nothing gets designed that can't be built, and nothing gets built that quietly drops half the design. The gap where most projects lose their quality doesn't exist here.",
  },
  {
    n: "03",
    title: "Built around your business",
    body: "We don't keep a folder of layouts waiting for a new logo. Structure, copy hierarchy and interface follow how you actually sell, not what the template had room for.",
  },
  {
    n: "04",
    title: "The details get the same attention",
    body: "Spacing at 1440 and at 375. Focus states. Loading behaviour. Empty states. The parts nobody puts in a proposal are usually the parts people feel.",
  },
  {
    n: "05",
    title: "Launch isn't the finish line",
    body: "Sites are built to be edited, extended and handed over. Clean structure, documented decisions, and no dependency on us to change a heading.",
  },
];

export function WhyBytes() {
  const [active, setActive] = useState<number | null>(null);
  const cursor = useCursor();

  return (
    <section
      className="on-ink section-y relative"
      aria-labelledby="why-heading"
    >
      <div className="shell-wide">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03" tone="paper">
              Why Bytes
            </SectionLabel>
            <TextReveal
              as="h2"
              id="why-heading"
              className="t-display mt-7 max-w-[14ch] text-paper"
              lines={[<>Not another agency</>, <>assembly line.</>]}
            />
          </div>
        </div>

        <ul className="mt-[clamp(3rem,7vh,5rem)] border-t border-[var(--line-ink)]">
          {differentiators.map((d, i) => {
            const on = active === i;
            return (
              <li
                key={d.n}
                className="relative border-b border-[var(--line-ink)]"
                onPointerEnter={() => {
                  setActive(i);
                  cursor.set("link");
                }}
                onPointerLeave={() => {
                  setActive(null);
                  cursor.reset();
                }}
              >
                {/* line that wipes across on hover */}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <div className="grid grid-cols-1 gap-x-8 py-8 md:grid-cols-12 md:items-baseline md:py-10">
                  <span
                    className={cx(
                      "t-meta mb-3 block transition-colors duration-500 md:col-span-1 md:mb-0",
                      on ? "text-accent-soft" : "text-muted",
                    )}
                  >
                    {d.n}
                  </span>
                  <h3
                    className={cx(
                      "text-[clamp(1.35rem,2.4vw,2.3rem)] leading-tight tracking-[-0.03em] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-6",
                      on ? "translate-x-2 text-paper" : "text-paper/85",
                    )}
                  >
                    {d.title}
                  </h3>
                  <p
                    className={cx(
                      "t-body mt-3 max-w-[52ch] text-muted transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:col-span-5 md:mt-0",
                      "md:opacity-80",
                      on ? "md:translate-y-0 md:opacity-100" : "md:translate-y-1.5",
                    )}
                  >
                    {d.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
