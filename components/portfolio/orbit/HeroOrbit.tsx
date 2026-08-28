"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { orbitProjects } from "@/data/portfolio";
import type { PortfolioProject } from "@/data/projects";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { ArrowUpRight } from "@/components/ui/Arrow";
import { PortfolioViewer } from "@/components/portfolio/stage/PortfolioViewer";
import type { ViewMode } from "@/components/portfolio/stage/PortfolioViewToggle";

/**
 * The hero's orbit.
 *
 * Real circular geometry, not a slider wearing a rotation. Nine plates ride a
 * tilted ellipse; each one's position comes from its angle on that ellipse and
 * nothing else:
 *
 *   x = Rx·sin θ          across
 *   z = Rz·(cos θ − 1)    depth — θ=0 is nearest, θ=π is the far side
 *   y = Ry·cos θ          the tilt that turns a circle into a ring you look
 *                         down on rather than a line
 *
 * Scale, opacity, blur and yaw all fall out of that one angle, so a plate at
 * the back is genuinely smaller, dimmer and softer rather than styled to look
 * that way, and the near ones pass the flanks at full strength.
 *
 * Nine plates, twenty-five projects. A plate swaps its project while it is at
 * the far side of the ring — 45% scale, nearly transparent — so the whole bank
 * cycles through without ever mounting twenty-five images.
 *
 * The type never moves. The work moves around it: the ring is pushed back past
 * z=0 and the corridor fade dims plates crossing the type's band, so they read
 * as passing behind the words rather than being covered by a wash.
 */

const SLOTS = 9;
/** Seconds for one full revolution. Slow enough to read as drift. */
const PERIOD = 64;
/** How far a flick coasts before the ring picks its own pace back up. */
const FRICTION = 2.6;

type Slot = { project: PortfolioProject; key: string };

export function HeroOrbit() {
  const bank = orbitProjects;
  const reduce = useSafeReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const plateRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pillRef = useRef<HTMLDivElement>(null);

  const [box, setBox] = useState({ w: 0, h: 0 });
  const [entered, setEntered] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [active, setActive] = useState(0);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [mode, setMode] = useState<ViewMode>("desktop");
  const [origin, setOrigin] = useState("50% 50%");

  // Which project each slot is showing. `nextUp` walks the bank as slots recycle.
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: SLOTS }, (_, i) => ({
      project: bank[i % bank.length],
      key: `${bank[i % bank.length].slug}-${i}`,
    })),
  );
  const nextUp = useRef(SLOTS % bank.length);
  const wasFar = useRef<boolean[]>(Array(SLOTS).fill(false));
  const activeRef = useRef(0);

  /*
   * The animation loop reads these instead of the state values themselves.
   * Hover changes `held` several times a second; if the loop depended on it
   * the effect would tear down and rebuild mid-rotation, resetting both the
   * frame clock and the entry reveal — which is what made a card appear to
   * break out of the ring the moment you pointed at it.
   */
  const heldRef = useRef(false);
  const runningRef = useRef(false);
  const enteredRef = useRef(false);
  /** Index of the plate under the pointer, or −1. Never state: no re-render. */
  const hovered = useRef(-1);
  /** Entry progress, 0→1. Persisted so it survives a resize. */
  const reveal = useRef(0);
  /** Autoplay rate, eased 1→0 on hover so the ring coasts to a stop. */
  const speed = useRef(1);
  const resumeTimer = useRef<number | null>(null);

  /* ------------------------------------------------------------------ size */

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setBox({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), reduce ? 0 : 550);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    const on = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* --------------------------------------------------------------- dragging */

  // Turns per pixel of drag, and the coasting velocity left after a flick.
  const drag = useRef({ id: -1, x: 0, last: 0, t: 0, moved: 0, on: false });
  const spin = useRef(0);
  const turns = useRef(0.06); // start just off dead-centre

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      last: e.clientX,
      t: performance.now(),
      moved: 0,
      on: true,
    };
    spin.current = 0;
    setHeld(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on || d.id !== e.pointerId || !box.w) return;
    const dx = e.clientX - d.last;
    d.moved += Math.abs(dx);
    if (d.moved > 6) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    // One screen-width of drag is roughly one revolution.
    const dTurns = -dx / (box.w * 1.15);
    turns.current += dTurns;

    const now = performance.now();
    const dt = Math.max(8, now - d.t) / 1000;
    spin.current = dTurns / dt;
    d.last = e.clientX;
    d.t = now;
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on || d.id !== e.pointerId) return;
    d.on = false;
    // Cap the throw so a hard flick can't send the ring spinning.
    spin.current = Math.max(-0.9, Math.min(0.9, spin.current));
    setHeld(false);
  };

  /* --------------------------------------------------------------- the ring */

  const running = !reduce && !viewerOpen && !tabHidden && onScreen;

  useEffect(() => {
    heldRef.current = held;
    runningRef.current = running;
    enteredRef.current = entered;
  }, [held, running, entered]);

  /** Hover leaves the ring paused for a beat, then it eases back up. */
  const releaseHold = useCallback(() => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setHeld(false), 500);
  }, []);
  const takeHold = useCallback(() => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    setHeld(true);
  }, []);
  useEffect(
    () => () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!box.w) return;

    const wide = box.w >= 1024;

    // Geometry, all derived from the zone so it holds at every width. The ring
    // is wider than the viewport on purpose: plates should leave and enter at
    // the edges, which is what suggests the ring continues past the screen.
    const Rx = box.w * (wide ? 0.55 : 0.6);
    const Rz = Math.min(box.w * 0.34, 560);
    // A pronounced tilt is what keeps the type clear: the front of the ring
    // passes low and the far side rides high, so most plates are already out
    // of the headline's band before the corridor fade has to do anything.
    const Ry = box.h * (wide ? 0.4 : 0.3);
    const baseW = Math.max(150, Math.min(box.w * (wide ? 0.235 : 0.36), 380));

    // The type owns the middle. Anything crossing it is faded by its distance
    // from the centre measured on BOTH axes — an x-only corridor lets the
    // front plate, which passes low and large, sit right on the paragraph.
    // Widened: the portrait is now the centrepiece and runs nearly the full
    // height of the scene, so the protected column is much broader than when
    // it only had to clear a line of type.
    const corridorX = Rx * 0.76;
    // The hero column now runs label → headline → portrait → copy → CTA,
    // so the protected band is nearly the full height of the scene.
    // Raised with the portrait: she now runs from the wordmark to the copy,
    // so the protected column is effectively the whole scene. At 0.64 the top
    // of the ring escaped the fade and left grey plates hanging behind the
    // headline, which read as artefacts rather than as depth.
    const corridorY = box.h * 0.92;

    let raf = 0;
    let last = performance.now();

    const paint = (reveal: number) => {
      let bestDepth = 2;
      let bestSlot = 0;
      let bestX = 0;
      let bestY = 0;
      let bestW = 0;

      for (let i = 0; i < SLOTS; i++) {
        const el = plateRefs.current[i];
        if (!el) continue;

        const theta = turns.current * Math.PI * 2 + (i / SLOTS) * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        // 0 at the front of the ring, 1 at the far side.
        const depth = (1 - cos) / 2;

        // Entry: the ring resolves inward from a wider, flatter orbit.
        const spread = 1 + (1 - reveal) * 0.28;
        const x = Rx * sin * spread;
        const z = Rz * (cos - 1);
        const y = Ry * cos - box.h * 0.02;

        const scale = (1.02 - depth * 0.5) * (0.94 + reveal * 0.06);
        // Plates face the middle of the scene rather than the camera.
        const yaw = sin * 30;
        const pitch = cos * -5;

        // Smoothstep rather than linear: the fade holds near-full across the
        // type's footprint and then releases quickly, instead of leaving every
        // plate half-visible over the words.
        const r = Math.min(
          1,
          Math.hypot(x / corridorX, (y + box.h * 0.02) / corridorY),
        );
        const nearAxis = 1 - r * r * (3 - 2 * r);
        // Nearer plates are brighter, so they need to give way harder.
        const veil = nearAxis * (0.88 + 0.1 * (1 - depth));
        // The falloff is deliberately non-linear. Linear opacity left the
        // middle of the ring — half-lit, half-blurred plates — reading as grey
        // rectangles behind the type rather than as distance. Raising the
        // curve keeps the near plates at full strength and lets everything
        // past the flanks drop away quickly.
        const opacity = (0.03 + Math.pow(1 - depth, 1.7) * 0.97) * (1 - veil) * reveal;

        el.style.transform =
          `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), ${z.toFixed(1)}px)` +
          ` rotateY(${yaw.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        const isHovered = hovered.current === i;
        // Depth owns the stacking order; hover only nudges it, so a rear plate
        // can never jump in front of the type or of its own neighbours.
        el.style.zIndex = String(100 - Math.round(depth * 90) + (isHovered ? 2 : 0));
        el.style.width = `${Math.round(baseW)}px`;
        el.style.filter = depth > 0.06 ? `blur(${(depth * 4.5).toFixed(2)}px)` : "none";
        // Nothing at the back is clickable — but a plate already under the
        // pointer keeps its events until the pointer actually leaves it.
        // Without that hysteresis the ring's own rotation flips this flag
        // under the cursor and the hover strobes.
        el.style.pointerEvents = depth < 0.46 || isHovered ? "auto" : "none";

        if (depth < bestDepth) {
          bestDepth = depth;
          bestSlot = i;
          bestX = x;
          bestY = y;
          bestW = baseW * scale;
        }

        // Recycle at the far side, where the swap is invisible.
        const far = depth > 0.94;
        if (far && !wasFar.current[i]) {
          wasFar.current[i] = true;
          setSlots((cur) => {
            const copy = cur.slice();
            const p = bank[nextUp.current % bank.length];
            nextUp.current += 1;
            copy[i] = { project: p, key: `${p.slug}-${i}-${nextUp.current}` };
            return copy;
          });
        } else if (!far) {
          wasFar.current[i] = false;
        }
      }

      // The label rides just under whichever plate is nearest the viewer.
      const pill = pillRef.current;
      if (pill) {
        pill.style.transform = `translate3d(calc(-50% + ${bestX.toFixed(1)}px), calc(-50% + ${(bestY + bestW * 0.34).toFixed(1)}px), 0)`;
        const clear =
          Math.hypot(bestX / corridorX, (bestY + box.h * 0.02) / corridorY) > 1;
        pill.style.opacity = (
          reveal * (bestDepth < 0.14 && clear ? 1 : 0)
        ).toFixed(2);
        pill.style.pointerEvents = bestDepth < 0.14 && clear ? "auto" : "none";
      }
      if (activeRef.current !== bestSlot) {
        activeRef.current = bestSlot;
        setActive(bestSlot);
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (enteredRef.current) reveal.current = Math.min(1, reveal.current + dt / 1.1);

      // Ease the rate rather than switching it: hovering slows the ring to a
      // stop over ~400ms and leaving spins it back up the same way.
      const want = runningRef.current && !heldRef.current ? 1 : 0;
      speed.current += (want - speed.current) * (1 - Math.exp(-dt / 0.4));
      // Exponential easing only ever approaches its target. Snap the last
      // fraction so a paused ring genuinely rests instead of creeping under
      // the pointer for as long as you hover.
      if (want === 0 && speed.current < 0.004) speed.current = 0;
      if (want === 1 && speed.current > 0.996) speed.current = 1;

      if (!drag.current.on) {
        if (Math.abs(spin.current) > 0.0004) {
          // Coast, then hand back to autoplay.
          turns.current += spin.current * dt;
          spin.current *= Math.exp(-FRICTION * dt);
        } else {
          turns.current += (dt / PERIOD) * speed.current;
        }
      }
      paint(reduce ? 1 : reveal.current);
    };

    paint(reduce ? 1 : reveal.current);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [box.w, box.h, reduce, bank]);

  /* ----------------------------------------------------------------- open */

  const open = useCallback((slug: string, el: HTMLElement | null) => {
    if (drag.current.moved > 8) return;
    const i = orbitProjects.findIndex((p) => p.slug === slug);
    if (i < 0) return;
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin(
        `${(((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(1)}% ${(((r.top + r.height / 2) / window.innerHeight) * 100).toFixed(1)}%`,
      );
    }
    setViewerIndex(i);
    setViewerOpen(true);
  }, []);

  const activeProject = slots[active]?.project;
  const activeNumber =
    (orbitProjects.findIndex((p) => p.slug === activeProject?.slug) + 1) || 1;

  return (
    <>
      <div
        ref={rootRef}
        className="orbit-zone absolute inset-0"
        onPointerEnter={takeHold}
        onPointerLeave={(e) => {
          endDrag(e);
          hovered.current = -1;
          releaseHold();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="orbit-ring absolute inset-0">
          {slots.map((slot, i) => (
            <div
              key={i}
              ref={(n) => {
                plateRefs.current[i] = n;
              }}
              className="orbit-plate absolute left-1/2 top-1/2"
              style={{ opacity: 0 }}
              /* One boundary for the whole card. Putting these on the button
                 or the image makes the hover strobe as the pointer crosses
                 internal children. */
              onPointerEnter={() => {
                hovered.current = i;
                takeHold();
              }}
              onPointerLeave={() => {
                if (hovered.current === i) hovered.current = -1;
              }}
            >
              {/* Hover shell. The orbit owns the transform on the element
                  above; this one owns the 1.5% lift and nothing else, so the
                  two can never overwrite each other. */}
              <div className="orbit-hover">
                <button
                  type="button"
                  data-cursor={
                    slot.project.cursorTheme === "light" ? "view-light" : "view-dark"
                  }
                  onClick={(e) => open(slot.project.slug, e.currentTarget)}
                  aria-label={`${slot.project.name} — open preview`}
                  className="orbit-plate-face block w-full"
                >
                  <Image
                    key={slot.key}
                    src={slot.project.desktopImage}
                    alt=""
                    width={720}
                    height={450}
                    quality={62}
                    sizes="(max-width: 768px) 44vw, 30vw"
                    draggable={false}
                    className="orbit-plate-shot h-auto w-full"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Only the very top and bottom edges are softened, so plates never
            tangle with the header or the scroll rail. The headline is kept
            clear by the corridor fade in the geometry above — a paper wash
            over the middle would grey out the work it is meant to reveal. */}
        <div className="orbit-edge-fade absolute inset-0" />

        {/* Compact label for whichever plate is nearest — the whole of the
            hero's chrome. It rides with the plate rather than sitting in a
            fixed corner, so it reads as belonging to that project. */}
        <div
          ref={pillRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[120]"
          style={{ opacity: 0 }}
        >
          {activeProject ? (
            <button
              type="button"
              onClick={(e) => open(activeProject.slug, e.currentTarget)}
              className="lg lg-ivory pointer-events-auto flex items-center gap-3 rounded-full py-2 pl-4 pr-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
              aria-label={`${activeProject.name} — open preview`}
            >
              <span className="t-meta tnum text-[0.62rem] text-muted-ink">
                {String(activeNumber).padStart(2, "0")}
                <span className="mx-1 opacity-40">/</span>
                {orbitProjects.length}
              </span>
              <span className="t-label max-w-[13ch] truncate text-ink">
                {activeProject.name}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </button>
          ) : null}
        </div>
      </div>

      <PortfolioViewer
        open={viewerOpen}
        index={viewerIndex}
        mode={mode}
        projects={orbitProjects}
        origin={origin}
        onModeChange={setMode}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setViewerIndex}
      />
    </>
  );
}
