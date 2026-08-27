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
