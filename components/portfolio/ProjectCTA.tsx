"use client";

import { ArrowUpRight } from "@/components/ui/Arrow";
import { cx } from "@/lib/utils";

/** Shared "View Live Site" affordance. The arrow rotates 45° on hover. */
export function ProjectCTA({
  href,
  tone = "ink",
  className,
  label = "View Live Site",
}: {
  href?: string;
  tone?: "ink" | "paper";
  className?: string;
  label?: string;
}) {
  if (!href) return null;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2.5 text-[0.95rem] tracking-[-0.015em]",
        tone === "paper" ? "text-paper" : "text-ink",
        className,
      )}
    >
      <span className="relative">
        {label}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100"
        />
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45" />
    </span>
  );
}
