"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { siteConfig } from "@/lib/site";
import { useModals } from "@/components/forms/ModalProvider";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const links = [
  ...siteConfig.nav,
  { label: "Contact", href: "#contact" },
];

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { openEnquiry } = useModals();
  const reduce = useSafeReducedMotion();

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    window.dispatchEvent(
      new CustomEvent("site:scroll-lock", { detail: { locked: true } }),
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.dispatchEvent(
        new CustomEvent("site:scroll-lock", { detail: { locked: false } }),
      );
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          className="on-ink fixed inset-0 z-[125] flex flex-col overflow-y-auto lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col justify-center px-[var(--gutter)] pb-10 pt-28"
          >
            <ul>
              {links.map((item, i) => (
                <li
                  key={item.href}
                  className="overflow-hidden border-b border-[var(--line-ink)]"
                >
                  <motion.a
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-5 py-[0.42em]"
                    initial={reduce ? { opacity: 0 } : { y: "110%" }}
                    animate={reduce ? { opacity: 1 } : { y: "0%" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.22 + i * 0.07,
                    }}
                  >
                    <span className="t-meta w-6 shrink-0 text-accent-soft">
                      0{i + 1}
                    </span>
                    <span
                      className="font-medium leading-[1.05] tracking-[-0.04em] text-paper"
                      style={{ fontSize: "clamp(2.6rem, 13vw, 5rem)" }}
                    >
                      {item.label}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="mt-12"
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.setTimeout(openEnquiry, 380);
                }}
                className="inline-flex h-[3.4rem] items-center gap-3 rounded-full bg-paper px-8 font-medium text-ink"
              >
                Let&rsquo;s work
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="px-[var(--gutter)] pb-12"
          >
            <div className="rule rule-ink mb-7" />
            <a
              href={siteConfig.social.linkedin}
              className="t-label inline-block text-muted"
            >
              LinkedIn
            </a>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
