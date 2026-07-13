"use client";

import { useSyncExternalStore } from "react";
import type { Transition, Variants } from "framer-motion";

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Always false during SSR + hydration so markup matches. */
function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Reduced-motion preference via useSyncExternalStore.
 * Server/hydration snapshot is always false; live preference applies after.
 */
export function useMotionPrefs() {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  return {
    reduced,
    transition: (reduced
      ? { duration: 0 }
      : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }) as Transition,
  };
}

export function fadeUp(reduced: boolean): Variants {
  if (reduced) {
    return { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } };
  }
  return {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };
}

export function stagger(reduced: boolean): Variants {
  if (reduced) {
    return { hidden: {}, show: { transition: { staggerChildren: 0 } } };
  }
  return {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  };
}
