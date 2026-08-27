"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { siteConfig } from "@/lib/site";
import { cx } from "@/lib/utils";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { useModals } from "@/components/forms/ModalProvider";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { openEnquiry } = useModals();

  useMotionValueEvent(scrollY, "change", (v) => {
    setCompact(v > 60);
  });

  // Close the menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <motion.header
        className={cx(
          "fixed inset-x-0 top-0 z-[130] transition-[background-color,border-color,backdrop-filter] duration-500",
          compact && !menuOpen
            ? "border-b border-[var(--line-paper)] bg-paper/[0.97] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
        animate={{ paddingBlock: compact ? 12 : 22 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="shell-wide flex items-center justify-between gap-6">
          {/* Wordmark */}
          <a
            href="#top"
            aria-label={`${siteConfig.name} — back to top`}
            className={cx(
              "group relative z-10 flex items-baseline gap-[0.35em] text-[0.82rem] font-medium tracking-[0.16em] transition-colors duration-300",
              menuOpen ? "text-paper" : "text-ink",
            )}
          >
            <span className="text-[1rem] tracking-[0.12em]">{siteConfig.name}</span>
            <span
              aria-hidden="true"
              className="ml-2.5 hidden text-[0.58rem] normal-case tracking-[0.16em] opacity-45 md:inline"
              style={{ fontFamily: "var(--font-hand)", letterSpacing: "0.02em", fontSize: "0.82rem" }}
            >
              {siteConfig.discipline}
            </span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative inline-block py-1 text-[0.92rem] tracking-[-0.01em] text-ink/70 transition-all duration-300 hover:translate-x-[2px] hover:text-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <button
                type="button"
                onClick={openEnquiry}
                className="group/cta relative inline-flex items-center gap-2 py-1 text-[0.95rem] tracking-[-0.01em] text-ink"
              >
                Let&rsquo;s talk
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-right scale-x-0 bg-coral transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/cta:origin-left group-hover/cta:scale-x-100"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cx(
                "t-label relative z-10 flex items-center gap-2.5 py-2 transition-colors duration-300 lg:hidden",
                menuOpen ? "text-paper" : "text-ink",
              )}
            >
              {menuOpen ? "Close" : "Menu"}
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={cx(
                    "absolute left-0 h-px w-full bg-current transition-all duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                    menuOpen ? "top-1/2 rotate-45" : "top-0.5",
                  )}
                />
                <span
                  className={cx(
                    "absolute left-0 h-px w-full bg-current transition-all duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
                    menuOpen ? "top-1/2 -rotate-45" : "bottom-0.5",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
