"use client";

import { cx } from "@/lib/utils";
import { useCursor } from "@/components/motion/CursorProvider";

/** Underline that wipes in from the left, plus a 2px text nudge. */
export function AnimatedLink({
  href,
  children,
  className,
  external = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const cursor = useCursor();

  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      onPointerEnter={() => cursor.set("link")}
      onPointerLeave={() => cursor.reset()}
      className={cx(
        "group relative inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-[2px]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100"
      />
    </a>
  );
}
