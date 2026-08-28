import { faqs } from "@/data/faq";
import { TextReveal } from "@/components/motion/TextReveal";
import { GridPatch, InkArrow } from "@/components/collage/Marks";
import { Accordion } from "@/components/ui/Accordion";

export function Faq() {
  return (
    <section id="faq" className="section-y relative bg-paper" aria-labelledby="faq-heading">
      {/* ---- scenery: the lightest touch on the site. Four questions do not
           need decorating; this is one faint grid and one arrow, no more. ---- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GridPatch cell={26} className="absolute left-[4%] top-[46%] hidden h-[20vw] w-[24vw] text-ink/[0.075] lg:block" />
        <InkArrow className="absolute bottom-[12%] left-[26%] hidden h-6 w-16 rotate-[10deg] text-muted-ink/35 lg:block" />
      </div>

      <div className="shell-wide relative">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="sticker">FAQ</span>
            <TextReveal
              as="h2"
              id="faq-heading"
              className="t-display mt-7 text-ink"
              lines={[<>Before</>, <>you ask.</>]}
            />
            <p className="t-body measure mt-8 text-muted-ink">
              The four things everyone asks first.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion items={faqs} />
          </div>
        </div>
      </div>
    </section>
  );
}
