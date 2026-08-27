import { faqs } from "@/data/faq";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/motion/TextReveal";
import { Accordion } from "@/components/ui/Accordion";

export function Faq() {
  return (
    <section className="section-y relative bg-paper" aria-labelledby="faq-heading">
      <div className="shell-wide">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="06">Questions</SectionLabel>
            <TextReveal
              as="h2"
              id="faq-heading"
              className="t-display mt-7 text-ink"
              lines={[<>Before</>, <>we talk.</>]}
            />
            <p className="t-body measure mt-8 text-muted-ink">
              The six things people ask on the first call. Answered honestly,
              including the parts that don&rsquo;t have a fixed number.
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
