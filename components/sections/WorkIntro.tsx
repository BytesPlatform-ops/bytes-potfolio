import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";

export function WorkIntro() {
  return (
    <div className="shell-wide pt-[clamp(4.5rem,11vh,9rem)]">
      <SectionLabel index="01">Selected Work</SectionLabel>
      <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <TextReveal
          as="h2"
          className="t-display max-w-[14ch] text-ink"
          lines={[<>Our work does</>, <>the talking.</>]}
        />
        <Reveal delay={1} className="md:pb-3">
          <p className="t-small measure text-muted-ink">
            Three live sites. Every screenshot below is the real thing — click
            any of them and you&rsquo;ll land on the site itself.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
