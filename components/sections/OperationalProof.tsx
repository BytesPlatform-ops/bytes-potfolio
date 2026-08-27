import { Reveal } from "@/components/motion/Reveal";

/**
 * A "numbers" section with no invented numbers.
 * The index is the number; the statement carries the weight.
 */
const facts = [
  { n: "01", statement: "Strategy → Launch", note: "One engagement, start to finish." },
  { n: "02", statement: "Design + Development", note: "Under one roof, same team." },
  { n: "03", statement: "Desktop → Mobile", note: "Designed together, not adapted after." },
  { n: "04", statement: "Performance from day one", note: "Not a phase we get to later." },
];

export function OperationalProof() {
  return (
    <section className="on-ink border-y border-[var(--line-ink)] py-[clamp(4rem,9vh,7rem)]">
      <div className="shell-wide">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.n} delay={i}>
              <li className="border-t border-[var(--line-ink)] pt-6">
                <span
                  className="block font-medium leading-[0.85] tracking-[-0.05em] text-accent"
                  style={{ fontSize: "clamp(3.5rem,6vw,5.5rem)" }}
                >
                  {f.n}
                </span>
                <h3 className="mt-6 text-[clamp(1.1rem,1.5vw,1.4rem)] leading-tight tracking-[-0.025em] text-paper">
                  {f.statement}
                </h3>
                <p className="t-small mt-2.5 text-muted">{f.note}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
