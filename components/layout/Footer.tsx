import { siteConfig } from "@/lib/site";
import { AnimatedLink } from "@/components/ui/AnimatedLink";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#050506] pb-10 pt-[clamp(3rem,7vh,5rem)] text-paper">
      <div className="shell-wide">
        <div className="rule rule-ink" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pt-[clamp(2.5rem,5vh,4rem)] lg:grid-cols-12">
          {/* wordmark */}
          <div className="lg:col-span-6">
            <p
              className="flex flex-wrap items-baseline gap-x-[0.22em] font-medium leading-[0.85] tracking-[-0.05em]"
              style={{ fontSize: "clamp(2.6rem,7vw,6rem)" }}
            >
              <span>{siteConfig.wordmark.left}</span>
              <span className="text-accent">/</span>
              <span className="text-paper/45">{siteConfig.wordmark.right}</span>
            </p>
            <p className="t-small measure mt-7 text-muted">
              An independent design and development studio. We build websites,
              web apps and digital products for companies with something worth
              showing.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-8">
            <h2 className="t-label mb-6 text-muted">Navigate</h2>
            <ul className="flex flex-col gap-3.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <AnimatedLink href={l.href} className="text-[1.02rem] text-paper/80">
                    {l.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="t-label mb-6 text-muted">Contact</h2>
            <ul className="flex flex-col gap-3.5">
              <li>
                <AnimatedLink
                  href={`mailto:${siteConfig.email}`}
                  className="text-[1.02rem] text-paper/80"
                >
                  Email
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink
                  href={`tel:${siteConfig.phoneHref}`}
                  className="text-[1.02rem] text-paper/80"
                >
                  Phone
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink
                  href={siteConfig.social.linkedin}
                  external
                  className="text-[1.02rem] text-paper/80"
                >
                  LinkedIn
                </AnimatedLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-[var(--line-ink)] pt-7">
          <p className="t-meta text-muted">
            © 2026 {siteConfig.name}
            <span aria-hidden="true" className="mx-2.5 opacity-40">
              ·
            </span>
            Built with intent.
          </p>
          <div className="flex items-center gap-7">
            <span className="t-meta text-muted">{siteConfig.timezones}</span>
            <AnimatedLink href="#" className="t-meta text-muted">
              Privacy
            </AnimatedLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
