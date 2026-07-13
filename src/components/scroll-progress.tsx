"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useMotionPrefs } from "@/lib/motion";

export function ScrollProgress() {
  const { reduced } = useMotionPrefs();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Keep one DOM shape for SSR + first paint; only the style changes after mount.
  return (
    <motion.div
      aria-hidden
      className={
        reduced
          ? "fixed top-0 left-0 right-0 z-[60] h-px bg-seam-strong"
          : "fixed top-0 left-0 right-0 z-[60] h-px origin-left bg-[linear-gradient(90deg,transparent,var(--reactor),transparent)]"
      }
      style={reduced ? undefined : { scaleX }}
    />
  );
}
