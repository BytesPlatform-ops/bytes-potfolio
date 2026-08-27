"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * The cursor.
 *
 * Two personalities and nothing in between. Passive, it is a 6px dot in the
 * page's own ink — no ring, no halo, no shadow, nothing to look at while you
 * read the headline. Interactive, it commits: a disc in ivory or ink carrying
 * a label, with a single cobalt arrow as the only colour anywhere on it.
 *
 * Ink, paper, one accent. The same three values as everything else here.
 *
 * Elements declare what they want:
 *
 *   <article data-cursor="view-dark">     the whole card is the boundary
 *   <button data-cursor="cta">
 *   <section data-cursor-theme="dark">    overrides surface sampling
 *
 * Anchors and buttons resolve to `link` on their own and text fields hand the
 * native caret back, so no component needs a pointer handler.
 */

export type CursorVariant =
  | "default"
  | "link"
  | "cta"
  | "view-light"
  | "view-dark"
  | "close"
  | "next"
  | "prev"
  | "scroll"
  | "hidden";

type Surface = "light" | "dark";

type Shape = {
  size: number;
  /** solid disc · hairline ring · bare dot */
  form: "disc" | "ring" | "dot";
  label?: string;
  /** Set after the label, one beat later, in cobalt. */
  arrow?: "up-right" | "right" | "left";
  /** Discs carry their own palette regardless of what is underneath. */
  paper?: boolean;
  /** Position eases rather than tracks — only the big discs. */
  smooth?: boolean;
};

const SHAPE: Record<CursorVariant, Shape> = {
  default: { size: 6, form: "dot" },
  link: { size: 17, form: "ring" },
  cta: { size: 22, form: "disc" },
  "view-light": {
    size: 80,
    form: "disc",
    label: "VIEW",
    arrow: "up-right",
    paper: true,
    smooth: true,
  },
  "view-dark": {
    size: 80,
    form: "disc",
    label: "VIEW",
    arrow: "up-right",
    paper: false,
    smooth: true,
  },
  close: { size: 58, form: "disc", label: "CLOSE", paper: true, smooth: true },
  next: { size: 62, form: "disc", label: "NEXT", arrow: "right", paper: true, smooth: true },
  prev: { size: 62, form: "disc", label: "PREV", arrow: "left", paper: true, smooth: true },
  scroll: { size: 62, form: "disc", label: "SCROLL", paper: true, smooth: true },
  hidden: { size: 0, form: "dot" },
};

const VARIANTS = new Set(Object.keys(SHAPE));

const INK = "#0a0a0b";
const PAPER = "#f3f0e9";
const ACCENT = "#3e52ff";

/* -------------------------------------------------------------- resolution */

const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";
const INTERACTIVE = "a[href], button, [role='button'], summary, label[for]";

/** The first ancestor that actually paints something decides light or dark. */
function surfaceOf(start: Element | null): Surface {
  let el: Element | null = start;
  let hops = 0;

  while (el && hops < 24) {
    const explicit = (el as HTMLElement).dataset?.cursorTheme;
    if (explicit === "dark" || explicit === "light") return explicit;

    // The design system already names its dark surfaces.
    if (el.classList?.contains("on-ink")) return "dark";

    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (m && m.length >= 3 && (m.length > 3 ? Number(m[3]) : 1) > 0.5) {
      const [r, g, b] = m.map(Number);
      return (r * 299 + g * 587 + b * 114) / 1000 < 140 ? "dark" : "light";
    }

    el = el.parentElement;
    hops++;
  }

  return "light";
}

function variantOf(target: Element | null): CursorVariant {
  if (!target) return "default";
  if (target.closest(TEXT_FIELD)) return "hidden";

  // The nearest declaring ancestor is the boundary, so crossing between a
  // card's image, title and metadata never drops the state.
  const declared = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  if (declared && VARIANTS.has(declared)) return declared as CursorVariant;

  if (target.closest(INTERACTIVE)) return "link";
  return "default";
}

/* -------------------------------------------------------------- capability */

const FINE = "(hover: hover) and (pointer: fine)";

function subscribeFine(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * True only for a real mouse, and only after hydration — the server has no
 * media queries, so it reports "no custom cursor" and the client upgrades on
 * the first commit. Same shape as `useSafeReducedMotion`, same reason.
 */
function useFinePointer() {
  return useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => false,
  );
}

/* ---------------------------------------------------------------- fragments */

function Arrow({
  kind,
  color,
}: {
  kind: NonNullable<Shape["arrow"]>;
  color: string;
}) {
  const d =
    kind === "up-right"
      ? "M3.6 10.4 10.4 3.6M10.4 3.6H5.5M10.4 3.6v4.9"
      : kind === "right"
        ? "M2.6 7h8.8M8 3.6 11.4 7 8 10.4"
        : "M11.4 7H2.6M6 3.6 2.6 7 6 10.4";

  return (
    <svg viewBox="0 0 14 14" fill="none" width="11" height="11" aria-hidden="true">
      <path
        d={d}
        stroke={color}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ render */

export function CustomCursor({
  variant: forced,
}: {
  variant?: CursorVariant | null;
}) {
  const enabled = useFinePointer();
  const reduce = useSafeReducedMotion();

  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [surface, setSurface] = useState<Surface>("light");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // One loop, one element, no trail. k = 1 tracks exactly; the big discs
  // ease in at 0.16 so they feel controlled rather than jelly.
  const target = useRef({ x: -100, y: -100 });
  const drawn = useRef({ x: -100, y: -100 });
  const k = useRef(1);

  const active = forced ?? variant;
  const shape = SHAPE[active] ?? SHAPE.default;

  useEffect(() => {
    k.current = reduce || !shape.smooth ? 1 : 0.16;
  }, [reduce, shape.smooth]);

  /* The native cursor is only surrendered once ours is on screen. */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("has-custom-cursor", enabled && visible);
    return () => root.classList.remove("has-custom-cursor");
  }, [enabled, visible]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = target.current;
      const d = drawn.current;
      const f = k.current;
      d.x = f >= 1 ? t.x : d.x + (t.x - d.x) * f;
      d.y = f >= 1 ? t.y : d.y + (t.y - d.y) * f;
      x.set(d.x);
      y.set(d.y);
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setVisible(true);
    };

    // Settled per element, not per frame.
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const next = variantOf(el);
      setVariant((cur) => (cur === next ? cur : next));
      const s = surfaceOf(el);
      setSurface((cur) => (cur === s ? cur : s));
    };

    const hide = () => setVisible(false);

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("blur", hide);
      document.removeEventListener("mouseleave", hide);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const onDark = surface === "dark";
  const showing = visible && active !== "hidden" && shape.size > 0;

  // View/close discs bring their own palette. Everything else inverts out of
  // the surface: ivory on ink, ink on ivory.
  const paperFace = shape.paper ?? onDark;
  const face = paperFace ? PAPER : INK;
  const type = paperFace ? INK : PAPER;

  const skin: React.CSSProperties =
    shape.form === "ring"
      ? {
          backgroundColor: "transparent",
          borderColor: onDark ? PAPER : INK,
        }
      : shape.form === "dot"
        ? { backgroundColor: onDark ? PAPER : INK, borderColor: "transparent" }
        : {
            backgroundColor: face,
            borderColor: "transparent",
            // A hairline, so an ivory disc still has an edge on pale imagery.
            boxShadow: paperFace
              ? "inset 0 0 0 1px rgba(10,10,11,0.11)"
              : "inset 0 0 0 1px rgba(243,240,233,0.13)",
          };

  const morph = reduce ? "1ms" : "300ms";
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

  return createPortal(
    <div
      aria-hidden="true"
      className="custom-cursor pointer-events-none fixed left-0 top-0 h-0 w-0"
      style={{ zIndex: 2147483000 }}
    >
      <motion.div
        className="pointer-events-none fixed left-0 top-0"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className="cursor-shape flex items-center justify-center gap-[0.36em] rounded-full border-[1.25px] border-solid"
          style={{
            width: shape.size,
            height: shape.size,
            opacity: showing ? 1 : 0,
            transitionProperty:
              "width, height, background-color, border-color, opacity, box-shadow",
            transitionDuration: morph,
            transitionTimingFunction: ease,
            ...skin,
          }}
        >
          <span
            className="whitespace-nowrap font-medium uppercase"
            style={{
              color: type,
              fontSize: 10,
              letterSpacing: "0.15em",
              lineHeight: 1,
              opacity: shape.label ? 1 : 0,
              transform: shape.label ? "translateY(0)" : "translateY(4px)",
              transitionProperty: "opacity, transform, color",
              transitionDuration: reduce ? "1ms" : "220ms",
              transitionTimingFunction: ease,
            }}
          >
            {shape.label}
          </span>

          {/* The only colour on the cursor, and it arrives a beat late. */}
          <span
            className="flex items-center"
            style={{
              order: shape.arrow === "left" ? -1 : 0,
              opacity: shape.arrow ? 1 : 0,
              transform: shape.arrow ? "translateY(0)" : "translateY(3px)",
              transitionProperty: "opacity, transform",
              transitionDuration: reduce ? "1ms" : "200ms",
              transitionDelay: shape.arrow && !reduce ? "50ms" : "0ms",
              transitionTimingFunction: ease,
            }}
          >
            {shape.arrow ? <Arrow kind={shape.arrow} color={ACCENT} /> : null}
          </span>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
