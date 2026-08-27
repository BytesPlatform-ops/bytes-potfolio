"use client";

import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { Reveal } from "@/components/motion/Reveal";

export function ReviewCTA() {
  const { openReview } = useModals();

  return (
    <section
      className="on-ink section-y relative"
      aria-labelledby="review-cta-heading"
    >
      <div className="shell-wide">
        <div className="grid grid-cols-1 items-end gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="t-label text-accent-soft">Website review</span>
            <TextReveal
              as="h2"
              id="review-cta-heading"
              className="t-section mt-6 max-w-[17ch] text-paper"
              lines={[
                <>Already have a website?</>,
                <>
                  Let&rsquo;s find out what&rsquo;s{" "}
                  <span className="serif-i">holding it back.</span>
                </>,
              ]}
            />
          </div>

          <Reveal delay={1} className="lg:col-span-5 lg:pb-2">
            <p className="t-body measure text-muted">
              Send us the URL and we&rsquo;ll go through it properly — then write
              back with what we&rsquo;d change and why. No slide deck, no
              obligation to hire us.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <MagneticButton
                onClick={openReview}
                variant="solid"
                tone="paper"
                size="lg"
              >
                Request a Website Review
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
              <p className="t-label text-muted">
                UX · Design · Conversion · Performance
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
