import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";

const capabilities = [
  "Strategy",
  "UI/UX",
  "Web Design",
  "Development",
  "E-commerce",
  "Web Apps",
  "Motion",
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-[var(--line-paper)] bg-paper-soft py-[clamp(3.5rem,7vh,6rem)]">
      <div className="shell-wide">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="t-section max-w-[16ch] text-ink">
            Designed. Developed. <span className="serif-i">Delivered.</span>
          </h2>
          <p className="t-body measure text-muted-ink md:pb-2">
            Websites, platforms and digital products built from strategy to
            launch — without three agencies and a handoff document.
          </p>
        </Reveal>
      </div>

      <div className="mt-[clamp(2.5rem,5vh,4rem)] border-t border-[var(--line-paper)] pt-[clamp(1.5rem,3vh,2.5rem)]">
        <Marquee
          items={capabilities}
          duration={72}
          className="t-label text-muted-ink"
        />
      </div>
    </section>
  );
}
