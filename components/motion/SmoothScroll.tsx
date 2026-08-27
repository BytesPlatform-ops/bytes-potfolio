"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Subtle smooth scroll. Bails out entirely for reduced-motion users and
 * for touch input, where native momentum scrolling is better than anything
 * we'd emulate.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors go through Lenis so easing stays consistent.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!el) return;
      const href = el.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -8, duration: 1.15 });
      history.replaceState(null, "", href);
    };

    // Modals stop the page behind them.
    const onLock = (e: Event) => {
      const detail = (e as CustomEvent<{ locked: boolean }>).detail;
      if (detail?.locked) lenis.stop();
      else lenis.start();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("bytes:scroll-lock", onLock as EventListener);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      window.removeEventListener("bytes:scroll-lock", onLock as EventListener);
      lenis.destroy();
    };
  }, []);

  return null;
}
