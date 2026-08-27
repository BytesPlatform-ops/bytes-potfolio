"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { PortfolioProject } from "@/data/projects";
import { prettyUrl, cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { PortfolioViewToggle, type ViewMode } from "./PortfolioViewToggle";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** `createPortal` needs a real document, so the first paint has to be a no-op. */
const NEVER_CHANGES = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );

function setScrollLock(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  window.dispatchEvent(new CustomEvent("site:scroll-lock", { detail: { locked } }));
}

/**
 * Fullscreen project viewer.
 *
 * Not a modal on a backdrop — the room goes near-black and the project
 * resolves into it. The opening is anchored to the glass panel that launched
 * it: `transform-origin` is set to the panel's centre in viewport coordinates
 * so the overlay grows out of the thing you clicked, which is what makes it
 * read as one continuous gesture rather than a new surface arriving.
 *
 * `mode` is owned by the stage, so whichever of Desktop/Mobile you were on in
 * the hero is the one you land on here, and changing it here carries back.
 */
export function PortfolioViewer({
  open,
  index,
  mode,
  projects,
  origin = "50% 50%",
  onModeChange,
  onClose,
  onIndexChange,
}: {
  open: boolean;
  index: number;
  mode: ViewMode;
  projects: PortfolioProject[];
  /**
   * `transform-origin` for the opening scale, as a CSS value in viewport
   * percentages. The stage measures the launching panel when the click
   * happens and passes the result in; measuring here would mean reading a
   * ref during render, and by then the panel may already be animating.
   */
  origin?: string;
  onModeChange: (m: ViewMode) => void;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const reduce = useSafeReducedMotion();

  const total = projects.length;
  const project = projects[index];

  // Every project opens on whatever mode the stage was showing; nothing to
  // reset here, but the open edge is still worth tracking for future use.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) setWasOpen(open);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total < 2) return;
      onIndexChange((index + dir + total) % total);
    },
    [index, total, onIndexChange],
  );

  /* Horizontal swipe changes project; vertical is left to the scrolling
     preview underneath, which is why the threshold is biased so heavily. */
  const swipe = useRef({ x: 0, y: 0, id: -1 });
  const onSwipeStart = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onSwipeEnd = (e: React.PointerEvent) => {
    if (swipe.current.id !== e.pointerId) return;
    swipe.current.id = -1;
    const dx = e.clientX - swipe.current.x;
    const dy = e.clientY - swipe.current.y;
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    go(dx < 0 ? 1 : -1);
  };

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const el = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (el === first || !panelRef.current.contains(el))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && el === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, go],
  );

  // Scroll lock and focus are tied to `open` alone. Keyboard handling is a
  // separate effect so that changing project — which rebuilds `onKeyDown` —
  // cannot churn the lock or throw focus back to the page behind.
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    setScrollLock(true);

    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("[data-autofocus]")
        ?.focus({ preventScroll: true });
    }, 80);

    return () => {
      window.clearTimeout(t);
      setScrollLock(false);
      restoreTo.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onKeyDown]);

  if (!mounted) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const shot = project?.hasShot !== false;
  const hasMobile = project?.hasMobileShot !== false && !!project?.mobileImage;

  const panelMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25 },
      }
    : {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.94 },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
      };

  return createPortal(
    <AnimatePresence>
      {open && project ? (
        <motion.div
          className="fixed inset-0 z-[400]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* the room */}
          <div className="absolute inset-0 bg-[#06060a]" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.07), transparent 62%)",
            }}
          />
          {!reduce ? <span aria-hidden="true" className="stage-grain" /> : null}

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} — full screen preview`}
            data-cursor-theme="dark"
            className="absolute inset-0 flex flex-col"
            style={{ transformOrigin: origin }}
            {...panelMotion}
          >
            {/* ---------------- top bar ---------------- */}
            <header className="relative z-20 flex shrink-0 items-center justify-between gap-4 px-[clamp(1rem,3vw,2.5rem)] pb-3 pt-[clamp(1rem,2.5vh,1.75rem)]">
              <div className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                <span className="t-meta tnum shrink-0 text-[0.7rem] text-paper/70">
                  {pad(index + 1)}
                  <span className="mx-1.5 text-white/25">/</span>
                  <span className="text-white/40">{pad(total)}</span>
                </span>
                <h2 className="t-sub min-w-0 truncate text-paper">{project.name}</h2>
                <span className="t-label hidden shrink-0 text-white/35 md:inline">
                  {project.category}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg-btn lg-btn-ghost hidden h-10 items-center gap-2 px-5 text-[0.82rem] sm:inline-flex"
                >
                  {prettyUrl(project.url)}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  data-autofocus
                  aria-label="Close the project viewer"
                  data-cursor="close"
                  className="lg-btn lg-btn-ghost lg-icon h-10 w-10"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="m6.5 6.5 11 11m0-11-11 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* ---------------- stage ---------------- */}
            <div className="relative min-h-0 flex-1 px-[clamp(0.75rem,3vw,2.5rem)]">
              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous project"
                    data-cursor="prev"
                    className="lg-btn lg-btn-ghost lg-icon absolute left-[clamp(0.4rem,1.4vw,1.1rem)] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 md:inline-flex"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                      <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next project"
                    data-cursor="next"
                    className="lg-btn lg-btn-ghost lg-icon absolute right-[clamp(0.4rem,1.4vw,1.1rem)] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 md:inline-flex"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                      <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              ) : null}

              <div
                className="mx-auto flex h-full max-w-[1500px] items-center justify-center"
                onPointerDown={onSwipeStart}
                onPointerUp={onSwipeEnd}
                onPointerCancel={() => {
                  swipe.current.id = -1;
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${project.slug}-${mode}`}
                    className="flex h-full w-full items-center justify-center"
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            scale: mode === "mobile" ? 0.94 : 1.015,
                            clipPath: "inset(4% 0% 4% 0%)",
                          }
                    }
                    animate={
                      reduce
                        ? { opacity: 1 }
                        : { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
                    }
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, scale: mode === "mobile" ? 1.02 : 0.985 }
                    }
                    transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {mode === "desktop" ? (
                      <DesktopPreview project={project} shot={shot} />
                    ) : (
                      <MobilePreview project={project} shot={hasMobile} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ---------------- bottom controls ---------------- */}
            <footer className="relative z-20 flex shrink-0 flex-wrap items-center justify-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:gap-4">
              <PortfolioViewToggle value={mode} onChange={onModeChange} />

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lg-btn lg-btn-primary group/cta inline-flex h-[2.9rem] items-center gap-2.5 px-6 text-[0.88rem]"
              >
                <span className="relative z-10">Visit Live Site</span>
                <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </a>

              {/* thumb-friendly prev/next for touch */}
              <div className={cx("items-center gap-2 md:hidden", total > 1 ? "flex" : "hidden")}>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous project"
                  data-cursor="prev"
                  className="lg-btn lg-btn-ghost lg-icon h-[2.9rem] w-[2.9rem]"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next project"
                  data-cursor="next"
                  className="lg-btn lg-btn-ghost lg-icon h-[2.9rem] w-[2.9rem]"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------------------------------------------ panes */

/** Full-page capture in a refined canvas the visitor can scroll through. */
function DesktopPreview({
  project,
  shot,
}: {
  project: PortfolioProject;
  shot: boolean;
}) {
  const src = project.fullImage ?? project.desktopImage;

  return (
    <div className="flex h-full w-full flex-col justify-center py-2">
      <div className="mx-auto flex max-h-full w-full flex-col overflow-hidden rounded-[var(--r-lg)] bg-[#101014] shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_40px_80px_-30px_rgba(0,0,0,0.85)]">
        <div className="flex h-[30px] shrink-0 items-center gap-1.5 border-b border-white/[0.06] bg-[linear-gradient(180deg,#1e1e24,#15151a)] px-3">
          <i className="block h-[6px] w-[6px] rounded-full bg-white/20" />
          <i className="block h-[6px] w-[6px] rounded-full bg-white/20" />
          <i className="block h-[6px] w-[6px] rounded-full bg-white/20" />
          <span className="t-meta ml-2 truncate text-[10px] text-white/40">
            {prettyUrl(project.url)}
          </span>
        </div>
        {shot ? (
          <div
            // Only the tall full-page capture actually scrolls; a fold-only
            // shot must not promise a SCROLL cursor it cannot honour.
            data-cursor={project.fullImage ? "scroll" : undefined}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#0d0d11]"
          >
            <Image
              src={src}
              alt={`${project.name} — full page`}
              width={1400}
              height={3200}
              quality={82}
              sizes="(max-width: 1500px) 96vw, 1400px"
              className="h-auto w-full"
            />
          </div>
        ) : (
          <Unavailable project={project} />
        )}
      </div>
      <p className="t-meta mt-2.5 text-center text-[0.66rem] text-white/25">
        Scroll inside the frame to read the full page
      </p>
    </div>
  );
}

/** Tall, centred, floating. No plastic phone bezel. */
function MobilePreview({
  project,
  shot,
}: {
  project: PortfolioProject;
  shot: boolean;
}) {
  return (
    <div className="flex h-full items-center justify-center py-2 [perspective:1400px]">
      <div
        className={cx(
          "relative flex h-full max-h-full w-[min(88vw,330px)] flex-col overflow-hidden rounded-[var(--r-lg)] bg-[#0d0d11]",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_50px_90px_-30px_rgba(0,0,0,0.9)]",
        )}
        style={{ transform: "rotateY(-3deg) rotateX(1.5deg)" }}
      >
        {shot && project.mobileImage ? (
          <div
            data-cursor="scroll"
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <Image
              src={project.mobileImage}
              alt={`${project.name} on mobile`}
              width={780}
              height={1690}
              quality={82}
              sizes="330px"
              className="h-auto w-full"
            />
          </div>
        ) : (
          <Unavailable project={project} compact />
        )}
      </div>
    </div>
  );
}

function Unavailable({
  project,
  compact = false,
}: {
  project: PortfolioProject;
  compact?: boolean;
}) {
  return (
    <div
      className={cx(
        "flex flex-1 flex-col items-center justify-center gap-3 bg-[linear-gradient(150deg,#14141b,#0b0b10_60%,#0e1030)] text-center",
        compact ? "px-5 py-16" : "px-8 py-24",
      )}
    >
      <p className="t-sub text-paper">{project.name}</p>
      <p className="t-meta text-white/40">{prettyUrl(project.url)}</p>
      <p className="t-label mt-1 text-paper/50">Preview unavailable</p>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="lg-btn lg-btn-ghost mt-4 inline-flex h-10 items-center gap-2 px-5 text-[0.82rem]"
      >
        Visit Live Site
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
