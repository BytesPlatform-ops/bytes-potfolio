"use client";

import { motion } from "motion/react";
import { testimonials } from "@/data/testimonials";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { phases } from "@/data/process";
import { cx } from "@/lib/utils";

const statements = [
  {
    title: "Clear communication.",
    body: "You'll know what's happening, what's next and what we need from you — in plain language, not status-report filler.",
  },
  {
    title: "Visible progress.",
    body: "Work goes on a staging URL early and stays there. You watch the site come together instead of waiting for a reveal.",
  },
  {
    title: "No disappearing after kickoff.",
    body: "The same people stay on the project from the first call to the handover. Nobody gets reassigned halfway through.",
  },
];

/**
 * Renders real testimonials if — and only if — data/testimonials.ts has any.
 * Until then, credibility comes from how we work, not invented quotes.
 */
export function Credibility() {
  const hasTestimonials = testimonials.length > 0;

  return (
    <section className="section-y relative bg-paper-soft" aria-labelledby="partnership-heading">
      <div className="shell-wide">
        {hasTestimonials ? (
          <>
            <TextReveal
              as="h2"
              id="partnership-heading"
              className="t-display max-w-[16ch] text-ink"
              lines={[<>What clients say.</>]}
            />
            <ul className="mt-[clamp(3rem,7vh,5rem)] grid gap-10 md:grid-cols-2">
              {testimonials.map((t) => (
                <li
                  key={`${t.author}-${t.company}`}
                  className="border-t border-[var(--line-paper)] pt-8"
                >
                  <blockquote className="t-sub text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="t-meta mt-6 text-muted-ink">
                    {t.author} — {t.role}, {t.company}
                  </footer>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <TextReveal
              as="h2"
              id="partnership-heading"
              className="t-display max-w-[16ch] text-ink"
              lines={[<>A good partnership</>, <>should feel simple.</>]}
            />

            <div className="mt-[clamp(3rem,7vh,5rem)] grid gap-x-8 gap-y-10 md:grid-cols-3">
              {statements.map((s, i) => (
                <Reveal key={s.title} delay={i}>
                  <div className="border-t border-[var(--line-paper)] pt-7">
                    <span className="t-meta text-accent">0{i + 1}</span>
                    <h3 className="t-sub mt-4 text-ink">{s.title}</h3>
                    <p className="t-body mt-4 text-muted-ink">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* project stages progressing — a quiet visual, not a chart */}
            <Reveal delay={3} className="mt-[clamp(3.5rem,8vh,6rem)]">
              <div className="rounded-md border border-[var(--line-paper)] bg-paper p-[clamp(1.25rem,3vw,2.5rem)]">
                <div className="flex items-center justify-between">
                  <span className="t-label text-muted-ink">Typical engagement</span>
                  <span className="t-label text-muted-ink">Handover</span>
                </div>
                <div className="mt-5 flex items-center gap-1.5">
                  {phases.map((p, i) => (
                    <motion.span
                      key={p.number}
                      className={cx(
                        "h-1 flex-1 origin-left rounded-full",
                        i < 3 ? "bg-accent" : i === 3 ? "bg-accent/55" : "bg-ink/12",
                      )}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{
                        duration: 0.7,
                        ease: [0.76, 0, 0.24, 1],
                        delay: i * 0.09,
                      }}
                    />
                  ))}
                </div>
                <ul className="mt-4 flex justify-between gap-2">
                  {phases.map((p) => (
                    <li key={p.number} className="t-meta text-muted-ink">
                      <span className="hidden sm:inline">{p.title}</span>
                      <span className="sm:hidden">{p.number}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
