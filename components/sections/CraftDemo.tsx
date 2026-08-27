"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { TextReveal } from "@/components/motion/TextReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cx } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    name: "Clarity",
    note: "Everything readable, nothing decided. This is where most sites stop.",
  },
  {
    n: "02",
    name: "Character",
    note: "Type does the work. Scale, weight and space give the page a point of view.",
  },
  {
    n: "03",
    name: "Motion",
    note: "Interaction confirms what the design already implied. Last, never first.",
  },
];

/**
 * A single demo interface that gets better in three scroll steps.
 * Not a fictional client — a demonstration of what the three passes change.
 */
export function CraftDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.34 ? 0 : v < 0.68 ? 1 : 2;
    setStep((prev) => (prev === next ? prev : next));
  });

  const s = step;

  return (
    <section
      ref={ref}
      className="relative bg-accent-deep text-white"
      style={{ height: "270vh" }}
      aria-labelledby="craft-heading"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-[max(5rem,9svh)]">
        <div className="shell-wide grid w-full grid-cols-1 items-center gap-x-10 gap-y-9 lg:grid-cols-12">
          {/* ---- Copy rail ---- */}
          <div className="lg:col-span-4">
            <SectionLabel tone="paper" className="!text-white/75">
              Craft
            </SectionLabel>
            <TextReveal
              as="h2"
              id="craft-heading"
              className="mt-6 text-[clamp(1.9rem,3.4vw,3.4rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white"
              lines={[<>The details</>, <>aren&rsquo;t extra.</>, <>They&rsquo;re the experience.</>]}
            />

            <ul className="mt-9 hidden lg:block">
              {STEPS.map((item, i) => (
                <li
                  key={item.n}
                  className="border-t border-white/18 py-4 last:border-b"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={cx(
                        "t-meta transition-colors duration-500",
                        i === s ? "text-white" : "text-white/60",
                      )}
                    >
                      {item.n}
                    </span>
                    <span
                      className={cx(
                        "text-[1.15rem] tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        i === s ? "translate-x-1 text-white" : "text-white/65",
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                  <p
                    className={cx(
                      "t-small ml-10 max-w-[34ch] overflow-hidden text-white/85 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                      i === s ? "mt-2 max-h-24 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>

            {/* compact indicator for small screens */}
            <div className="mt-7 flex items-center gap-3 lg:hidden">
              {STEPS.map((item, i) => (
                <span key={item.n} className="flex items-center gap-2">
                  <span
                    className={cx(
                      "h-1 w-8 rounded-full transition-colors duration-500",
                      i <= s ? "bg-white" : "bg-white/40",
                    )}
                  />
                  <span
                    className={cx(
                      "t-label transition-colors duration-500",
                      i === s ? "text-white" : "text-white/60",
                    )}
                  >
                    {item.name}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ---- The demo panel ---- */}
          <div className="lg:col-span-7 lg:col-start-6">
            <DemoPanel step={s} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoPanel({ step }: { step: number }) {
  const character = step >= 1;
  const motionOn = step >= 2;

  return (
    <div className="frame mx-auto w-full max-w-[46rem]">
      <div className="frame-bar">
        <span className="frame-dot" />
        <span className="frame-dot" />
        <span className="frame-dot" />
        <span className="frame-url">northbank.example / journal</span>
      </div>

      <div
        className={cx(
          "relative bg-paper text-ink transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          character ? "px-[6%] py-[6%]" : "px-[4.5%] py-[4.5%]",
        )}
      >
        {/* nav */}
        <div
          className={cx(
            "flex items-center justify-between border-b transition-all duration-[750ms]",
            character ? "border-ink/12 pb-5" : "border-ink/10 pb-3",
          )}
        >
          <span
            className={cx(
              "transition-all duration-[750ms]",
              character
                ? "text-[0.8rem] font-medium tracking-[0.2em]"
                : "text-[0.85rem] tracking-normal",
            )}
          >
            NORTHBANK
          </span>
          <nav className="flex gap-5">
            {["Shop", "Journal", "About"].map((l, i) => (
              <span
                key={l}
                className={cx(
                  "group relative text-[0.78rem] transition-colors duration-500",
                  character ? "text-ink/60" : "text-ink/70",
                )}
              >
                {l}
                {motionOn ? (
                  <span
                    className={cx(
                      "absolute -bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                      i === 1 ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                ) : null}
              </span>
            ))}
          </nav>
        </div>

        {/* headline */}
        <div className={cx("transition-all duration-[750ms]", character ? "mt-9" : "mt-5")}>
          <motion.h3
            layout
            className={cx(
              "transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
              character
                ? "max-w-[13ch] text-[clamp(1.25rem,3.1vw,2.5rem)] font-medium leading-[0.98] tracking-[-0.04em]"
                : "text-[clamp(1.05rem,1.7vw,1.35rem)] font-semibold leading-snug tracking-normal",
            )}
          >
            Small batch,{" "}
            <span className={character ? "serif-i" : undefined}>
              made slowly.
            </span>
          </motion.h3>
          <p
            className={cx(
              "text-ink/55 transition-all duration-[750ms]",
              character
                ? "mt-4 max-w-[42ch] text-[0.88rem] leading-[1.62]"
                : "mt-2 max-w-none text-[0.82rem] leading-normal",
            )}
          >
            A short note about how the thing is made, who makes it, and why that
            takes longer than it probably should.
          </p>
        </div>

        {/* card + form */}
        <div
          className={cx(
            "grid transition-all duration-[750ms]",
            character
                ? "mt-6 gap-4 grid-cols-[1.15fr_1fr] sm:mt-9 sm:gap-6"
                : "mt-4 gap-3 grid-cols-2 sm:mt-5 sm:gap-4",
          )}
        >
          {/* image card */}
          <div
            className={cx(
              "group/card relative overflow-hidden transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
              character ? "rounded-sm" : "rounded",
              motionOn ? "hover:-translate-y-1" : "",
            )}
          >
            <div
              className={cx(
                "flex items-end p-4 transition-all duration-[750ms]",
                character
                  ? "aspect-[4/3] bg-ink"
                  : "aspect-[16/10] bg-ink/12",
              )}
            >
              <svg
                viewBox="0 0 120 90"
                className={cx(
                  "absolute inset-0 h-full w-full transition-opacity duration-[750ms]",
                  character ? "opacity-100" : "opacity-45",
                )}
                aria-hidden="true"
              >
                <g
                  fill="none"
                  strokeWidth="0.9"
                  className={character ? "stroke-paper/35" : "stroke-ink/35"}
                >
                  <circle cx="60" cy="46" r="27" />
                  <circle cx="60" cy="46" r="17" />
                  <path d="M0 46h120M60 0v90" />
                </g>
                <circle
                  cx="60"
                  cy="46"
                  r={motionOn ? 6 : 4}
                  className={cx(
                    "transition-all duration-[750ms]",
                    character ? "fill-accent" : "fill-ink/40",
                  )}
                />
              </svg>
              <span
                className={cx(
                  "relative z-10 transition-all duration-[750ms]",
                  character
                    ? "text-[0.68rem] tracking-[0.18em] text-paper/80"
                    : "text-[0.68rem] tracking-normal text-ink/60",
                )}
              >
                {character ? "NO. 04 — EMBER" : "Product 4"}
              </span>
            </div>
          </div>

          {/* form */}
          <div className="flex flex-col justify-end">
            <span
              className={cx(
                "block transition-all duration-[750ms]",
                character
                  ? "text-[0.62rem] tracking-[0.18em] text-ink/45"
                  : "text-[0.7rem] tracking-normal text-ink/55",
              )}
            >
              {character ? "EMAIL" : "Email"}
            </span>
            <div className="relative mt-2">
              <span
                className={cx(
                  "block text-[0.85rem] text-ink/35 transition-all duration-[750ms]",
                  character ? "pb-2.5" : "rounded border border-ink/15 px-3 py-2",
                )}
              >
                you@example.com
              </span>
              {character ? (
                <>
                  <span className="absolute bottom-0 left-0 h-px w-full bg-ink/15" />
                  <span
                    className={cx(
                      "absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                      motionOn ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </>
              ) : null}
            </div>

            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className={cx(
                "group/btn relative mt-5 inline-flex items-center justify-center gap-2 overflow-hidden text-[0.82rem] transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                character
                  ? "h-11 rounded-full bg-ink px-6 font-medium text-paper"
                  : "h-9 rounded bg-ink/85 px-4 text-paper",
              )}
            >
              {motionOn ? (
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-[500ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:scale-x-100" />
              ) : null}
              <span className="relative z-10">Join the list</span>
              {character ? (
                <svg
                  viewBox="0 0 16 16"
                  className={cx(
                    "relative z-10 h-3.5 w-3.5 transition-transform duration-[420ms]",
                    motionOn ? "group-hover/btn:translate-x-0.5" : "",
                  )}
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 8h11M9.25 3.75 13.5 8l-4.25 4.25"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              ) : null}
            </button>
          </div>
        </div>

        {/* ticker appears only at step 03 */}
        <div
          className={cx(
            "overflow-hidden border-ink/12 transition-all duration-[750ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
            motionOn ? "mt-8 max-h-12 border-t pt-4 opacity-100" : "mt-0 max-h-0 opacity-0",
          )}
        >
          <div className="marquee-host">
            <div
              className="marquee-track t-label text-ink/40"
              style={{ ["--marquee-duration" as string]: "34s" }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="flex shrink-0 items-center">
                  <span className="whitespace-nowrap">Free shipping over $60</span>
                  <span className="mx-8 opacity-40">—</span>
                  <span className="whitespace-nowrap">Made in small batches</span>
                  <span className="mx-8 opacity-40">—</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
