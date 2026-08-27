"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type CursorMode = "default" | "link" | "view" | "drag" | "hidden";

type CursorApi = {
  mode: CursorMode;
  set: (mode: CursorMode, label?: string) => void;
  reset: () => void;
  /** Convenience props for hoverable elements. */
  hover: (mode: CursorMode, label?: string) => {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
};

const CursorContext = createContext<CursorApi | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  // Safe no-op outside the provider (e.g. isolated rendering).
  return (
    ctx ?? {
      mode: "default" as CursorMode,
      set: () => {},
      reset: () => {},
      hover: () => ({ onPointerEnter: () => {}, onPointerLeave: () => {} }),
    }
  );
}

const SIZES: Record<CursorMode, number> = {
  default: 10,
  link: 40,
  view: 84,
  drag: 64,
  hidden: 0,
};

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const reduce = useSafeReducedMotion();

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 1100, damping: 60, mass: 0.32 });
  const sy = useSpring(y, { stiffness: 1100, damping: 60, mass: 0.32 });

  const frame = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);

  // Only a real fine pointer gets the custom cursor.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.classList.add("has-custom-cursor");
    else root.classList.remove("has-custom-cursor");
    return () => root.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const flush = () => {
      frame.current = null;
      if (!pending.current) return;
      x.set(pending.current.x);
      y.set(pending.current.y);
      pending.current = null;
    };

    const onMove = (e: PointerEvent) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [enabled, visible, x, y]);

  const set = useCallback((next: CursorMode, nextLabel = "") => {
    setMode(next);
    setLabel(nextLabel);
  }, []);
  const reset = useCallback(() => {
    setMode("default");
    setLabel("");
  }, []);

  const hover = useCallback(
    (next: CursorMode, nextLabel = "") => ({
      onPointerEnter: () => set(next, nextLabel),
      onPointerLeave: () => reset(),
    }),
    [set, reset],
  );

  const api = useMemo<CursorApi>(() => ({ mode, set, reset, hover }), [mode, set, reset, hover]);

  const size = SIZES[mode];

  return (
    <CursorContext.Provider value={api}>
      {children}
      {enabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[999] hidden md:block"
          style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
        >
          <motion.div
            className="flex items-center justify-center rounded-full"
            style={{
              translateX: "-50%",
              translateY: "-50%",
              borderStyle: "solid",
            }}
            animate={{
              width: size,
              height: size,
              opacity: visible && mode !== "hidden" ? 1 : 0,
              backgroundColor:
                mode === "view" ? "var(--color-accent)" : "rgba(243,240,233,0)",
              borderColor:
                mode === "view" ? "rgba(62,82,255,0)" : "var(--color-paper)",
              borderWidth: mode === "default" ? 5 : 1,
              mixBlendMode: mode === "view" ? "normal" : "difference",
            }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="t-label whitespace-nowrap text-white"
              animate={{ opacity: mode === "view" && label ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          </motion.div>
        </motion.div>
      ) : null}
    </CursorContext.Provider>
  );
}
