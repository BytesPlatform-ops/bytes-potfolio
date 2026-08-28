"use client";

/**
 * The collage vocabulary.
 *
 * Every decorative mark on this site comes from this file. They are inline
 * SVG rather than images so they inherit colour, scale cleanly and cost
 * nothing to load — and so a section can compose its own arrangement instead
 * of pulling in a flat PNG someone has to redraw later.
 *
 * The rule that keeps it from turning into noise: a section picks two or
 * three of these, never all of them, and they sit at the edges or behind
 * content — never on top of something you have to read.
 */

type MarkProps = {
  className?: string;
  style?: React.CSSProperties;
};

/** Engineering paper. The base texture of the whole system. */
export function GridPatch({
  className,
  style,
  cell = 14,
}: MarkProps & { cell?: number }) {
  const id = `grid-${cell}`;
  return (
    <svg className={className} style={style} aria-hidden="true" fill="none">
      <defs>
        <pattern id={id} width={cell} height={cell} patternUnits="userSpaceOnUse">
          <path d={`M ${cell} 0 L 0 0 0 ${cell}`} stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Halftone dots. Printed texture, used behind and beside images. */
export function Halftone({
  className,
  style,
  dot = 1.6,
  gap = 9,
}: MarkProps & { dot?: number; gap?: number }) {
  const id = `ht-${gap}-${String(dot).replace(".", "_")}`;
  return (
    <svg className={className} style={style} aria-hidden="true" fill="none">
      <defs>
        <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={gap / 2} cy={gap / 2} r={dot} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** The loose pencil loop that sits above a head or behind a heading. */
export function Scribble({ className, style }: MarkProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 220 90" aria-hidden="true" fill="none">
      <path
        d="M8 54c26-34 62-46 96-40 30 5 48 26 40 42-9 17-46 22-77 12-31-10-52-33-45-49C31 1 74-6 108 5c37 12 62 41 56 58-6 16-38 22-66 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A hand-drawn arrow. Rotate it at the call site; the path never changes. */
export function InkArrow({ className, style }: MarkProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 40" aria-hidden="true" fill="none">
      <path
        d="M4 22c22-9 52-14 84-11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M74 4c6 5 11 8 18 7-6 5-9 10-9 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Torn paper. The irregular edge is the point — do not round it. */
export function TornPaper({
  className,
  style,
  fill = "currentColor",
}: MarkProps & { fill?: string }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 150"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M2 12 38 4l44 9 40-8 42 11 32-5-4 40 6 34-9 30 5 28-46 5-38-7-44 8-36-6 3-33-5-31 4-30z"
        fill={fill}
      />
    </svg>
  );
}

/** Crumpled red object — the reference's one warm accent, redrawn. */
export function PaperScrap({
  className,
  style,
  fill = "var(--color-coral)",
}: MarkProps & { fill?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M52 4 78 16l14 26-6 26-24 22-30 4L8 76 4 46 18 20z" fill={fill} />
      <path
        d="M52 4 40 40 4 46l36 8 12 40 10-42 30-10-32-6z"
        fill="#000"
        opacity="0.16"
      />
    </svg>
  );
}

/** Abstract monitor. A nod to the reference without drawing a real device. */
export function MonitorOutline({ className, style }: MarkProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 160 130" aria-hidden="true" fill="none">
      <rect x="6" y="6" width="148" height="98" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <rect x="18" y="18" width="124" height="74" stroke="currentColor" strokeWidth="0.9" opacity="0.5" vectorEffect="non-scaling-stroke" />
      <path d="M62 104v18M98 104v18M46 122h68" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Registration corners, as on a technical drawing. */
export function Corners({ className, style }: MarkProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      aria-hidden="true"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 14V0h14M86 0h14v14M100 86v14H86M14 100H0V86"
        stroke="currentColor"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Tiny plus. Scattered, never in a row. */
export function Plus({ className, style }: MarkProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 20 20" aria-hidden="true" fill="none">
      <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Process vocabulary — added for the journey section. Same rules as above:
   inline SVG, colour inherited from `currentColor`, no glow, no gradients.
   -------------------------------------------------------------------------- */

/** Said out loud. The TALK step. */
export function SpeechBubble({ className, style }: MarkProps) {
  return (
    <svg viewBox="0 0 120 92" fill="none" className={className} style={style} aria-hidden="true">
      {/* Drawn slightly open at the corners so it reads as sketched, not boxed. */}
      <path
        d="M9 20C9 12 15 6 24 6h72c9 0 15 6 15.5 14l1 34c0 8-6 14.5-15 15l-42 .5-19 15.5.5-15.5H24c-9 0-15-6.5-15-15z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M28 32h58M28 46h40" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/** A pointer, mid-drag. The DESIGN step. */
export function Cursor({ className, style }: MarkProps) {
  return (
    <svg viewBox="0 0 48 56" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M7 5.5 40 26.5 25 29.5 33 45 26 48.5 18 33 7 42z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sent. The SHIP step. */
export function PaperPlane({ className, style }: MarkProps) {
  return (
    <svg viewBox="0 0 110 88" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 40 104 6 70 82 52 56z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M52 56 104 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
      {/* The dotted trail it left. */}
      <path d="M2 70q12 8 24 2M10 82q9 5 18 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 7" opacity="0.6" />
    </svg>
  );
}

/**
 * The process path.
 *
 * Five stops drawn as one wobbling pencil line rather than a rule with ticks —
 * a straight timeline is exactly the corporate read this section is trying to
 * get away from. The node coordinates are exported so the marker can sit on
 * the line instead of near it.
 */
export const PATH_NODES = [
  { x: 62, y: 74 },
  { x: 296, y: 44 },
  { x: 520, y: 82 },
  { x: 744, y: 40 },
  { x: 938, y: 66 },
] as const;

export const PATH_VIEWBOX = { w: 1000, h: 120 };

/**
 * A lead-in and a tail, drawn but never stopped at.
 *
 * The line runs off both edges so it reads as a route the page is passing
 * through rather than a bar that starts and stops at the first and last label.
 */
const LEAD = { x: -30, y: 96 };
const TAIL = { x: 1030, y: 92 };

/**
 * One cubic per gap, through every point in order.
 *
 * The `d` string used to be written by hand, and it was wrong: it ran
 * `M62 74 C…296 44 c…` and its last relative curve landed on (744, 40) — node
 * four. Node five at (938, 66) was never in the path at all, so the track
 * simply stopped after Build and the gap before Ship was the path genuinely
 * ending there. Generating it from the same array the markers use means the
 * curve cannot disagree with the stops again: add a phase and the line grows
 * with it.
 *
 * Catmull-Rom converted to Bézier, which is the standard way to get a curve
 * that passes *through* its control points rather than near them — a spline
 * that only approximates would drift the line off the dots.
 */
function splineThrough(pts: ReadonlyArray<{ x: number; y: number }>): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x} ${p2.y}`;
  }
  return d;
}

export const PROCESS_PATH_D = splineThrough([LEAD, ...PATH_NODES, TAIL]);

export function ProcessPath({
  className,
  style,
  pathRef,
}: MarkProps & {
  /** The solid stroke, handed out so the marker can ride the real geometry. */
  pathRef?: React.Ref<SVGPathElement>;
}) {
  return (
    <svg
      viewBox={`0 0 ${PATH_VIEWBOX.w} ${PATH_VIEWBOX.h}`}
      fill="none"
      preserveAspectRatio="none"
      className={className}
      style={{ overflow: "visible", ...style }}
      aria-hidden="true"
    >
      {/* Ghost stroke, offset a couple of units — the second pass of a pencil. */}
      <path
        d={PROCESS_PATH_D}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.22"
        transform="translate(1.5 3)"
      />
      <path
        ref={pathRef}
        d={PROCESS_PATH_D}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="7 9"
        opacity="0.55"
      />
    </svg>
  );
}

export function ProcessPathVertical({ className, style }: MarkProps) {
  return (
    <svg viewBox="0 0 40 200" fill="none" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path d="M20 2c8 34-10 44-2 78s10 44 2 78" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 8" opacity="0.5" />
    </svg>
  );
}

/** A short hand-drawn tick trail. Used to mark distance travelled. */
export function DotTrail({ className, style }: MarkProps) {
  return (
    <svg viewBox="0 0 90 12" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M2 8q20-8 42-2t44-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="1 9" />
    </svg>
  );
}
