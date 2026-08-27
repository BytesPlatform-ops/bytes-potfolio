"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** The server has no media queries, so it always reports "motion allowed". */
const getServerSnapshot = () => false;

/**
 * Hydration-safe `prefers-reduced-motion`.
 *
 * Motion's own `useReducedMotion()` returns false on the server and the real
 * preference on the client, so any component that branches on it renders two
 * different trees and fails hydration (React #418). `useSyncExternalStore`
 * hydrates against the server snapshot and then re-renders with the real value.
 */
export function useSafeReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
