"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CustomCursor, type CursorVariant } from "./CustomCursor";

export type { CursorVariant };

type CursorApi = {
  variant: CursorVariant | null;
  /** Force a state that no single element can express. */
  set: (variant: CursorVariant) => void;
  reset: () => void;
};

const CursorContext = createContext<CursorApi | null>(null);

/**
 * Almost everything the cursor needs is declared in markup:
 *
 *   <article data-cursor="view-dark">
 *   <section data-cursor-theme="dark">
 *
 * and anchors, buttons and text fields are inferred with no markup at all.
 * This context is the escape hatch for states that aren't a property of an
 * element — a drag that outlives whatever is under the pointer. Prefer the
 * attribute.
 */
export function useCursor() {
  return (
    useContext(CursorContext) ?? {
      variant: null,
      set: () => {},
      reset: () => {},
    }
  );
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<CursorVariant | null>(null);

  const set = useCallback((next: CursorVariant) => setOverride(next), []);
  const reset = useCallback(() => setOverride(null), []);

  const api = useMemo<CursorApi>(
    () => ({ variant: override, set, reset }),
    [override, set, reset],
  );

  return (
    <CursorContext.Provider value={api}>
      {children}
      <CustomCursor variant={override} />
    </CursorContext.Provider>
  );
}
