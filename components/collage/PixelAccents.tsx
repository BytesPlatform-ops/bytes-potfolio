/**
 * Pixel flecks, trailing off the end of a word.
 *
 * The brief was editorial-plus-pixel, not glitch: the word itself is never
 * touched — no offset copies, no clipped scanlines, no chromatic split. It
 * stays exactly as set, and a small constellation of square coral flecks
 * comes off its trailing edge, as though the last letter were resolving into
 * pixels rather than breaking apart.
 *
 * Positions are hand-placed rather than random for two reasons: random values
 * differ between server and client and break hydration, and a designed
 * scatter reads as intent where a random one reads as noise. Sizes are in
 * `em`, so the flecks scale with the display type instead of drifting out of
 * proportion at other viewport widths.
 */

/** x/y are % of the word box; `s` is size in em; `o` is resting opacity. */
const FLECKS = [
  { x: 100.8, y: 26, s: 0.1, o: 0.9, d: 0 },
  { x: 103.4, y: 12, s: 0.075, o: 0.75, d: 0.9 },
  { x: 103.9, y: 46, s: 0.065, o: 0.6, d: 2.1 },
  { x: 106.6, y: 30, s: 0.055, o: 0.5, d: 1.4 },
  { x: 107.2, y: 60, s: 0.045, o: 0.38, d: 2.8 },
  { x: 109.8, y: 18, s: 0.04, o: 0.3, d: 0.4 },
  { x: 111.4, y: 44, s: 0.032, o: 0.22, d: 3.3 },
  { x: 114.1, y: 33, s: 0.026, o: 0.16, d: 1.8 },
  // Two leading in, so the effect reads as a treatment of the word rather
  // than as something falling off the end of it.
  { x: -3.2, y: 68, s: 0.055, o: 0.4, d: 2.4 },
  { x: -6.1, y: 58, s: 0.036, o: 0.24, d: 1.1 },
] as const;

export function PixelAccents({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      {FLECKS.map((f) => (
        <span
          key={`${f.x}-${f.y}`}
          className="pixel-fleck absolute bg-coral"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.s}em`,
            height: `${f.s}em`,
            opacity: f.o,
            ["--fleck-o" as string]: f.o,
            animationDelay: `${f.d}s`,
          }}
        />
      ))}
    </span>
  );
}
