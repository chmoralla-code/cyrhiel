"use client";

import { useEffect, useRef } from "react";
import { type MotionValue } from "framer-motion";

type ScrollMorphVideoProps = {
  src: string;
  progress: MotionValue<number>;
  className?: string;
  /** Tailwind aspect class matching the video's native ratio */
  aspectClass?: string;
  /** When false, scrubbing/RAF pause to free the decoder */
  active?: boolean;
};

function sourceType(src: string) {
  if (src.endsWith(".webm")) return "video/webm";
  if (src.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

/**
 * Scroll-scrubbed morph video.
 * RAF only runs while the element is on-screen and progress is moving —
 * this is the biggest FPS win for morph sections.
 */
export function ScrollMorphVideo({
  src,
  progress,
  className = "",
  aspectClass = "aspect-[944/960]",
  active = true,
}: ScrollMorphVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetProgress = useRef(0);
  const displayProgress = useRef(0);
  const rafId = useRef(0);
  const lastApplied = useRef(-1);
  const lastTick = useRef(0);
  const pendingSeek = useRef<number | null>(null);
  const ready = useRef(false);
  const inView = useRef(false);
  const looping = useRef(false);
  const activeRef = useRef(active);
  const startLoopRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    video.pause();
    video.preload = "metadata";
    targetProgress.current = progress.get();
    displayProgress.current = targetProgress.current;
    lastTick.current = 0;
    pendingSeek.current = null;

    const applyTime = (p: number) => {
      if (!ready.current || !inView.current || !activeRef.current) return;
      const duration = video.duration;
      if (!duration || !Number.isFinite(duration) || duration <= 0) return;
      const t = Math.min(Math.max(p, 0), 1) * Math.max(duration - 0.001, 0);
      if (Math.abs(t - lastApplied.current) < 0.0012) return;

      if (video.seeking) {
        pendingSeek.current = t;
        return;
      }

      lastApplied.current = t;
      pendingSeek.current = null;
      try {
        video.currentTime = t;
      } catch {
        /* ignore seek race */
      }
    };

    const onSeeked = () => {
      const next = pendingSeek.current;
      if (next === null) return;
      if (Math.abs(next - lastApplied.current) < 0.0012) {
        pendingSeek.current = null;
        return;
      }
      lastApplied.current = next;
      pendingSeek.current = null;
      try {
        video.currentTime = next;
      } catch {
        /* ignore seek race */
      }
    };

    const onReady = () => {
      ready.current = true;
      applyTime(displayProgress.current);
    };

    const stopLoop = () => {
      looping.current = false;
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };

    const tick = (now: number) => {
      if (!looping.current) return;

      const previous = lastTick.current || now;
      lastTick.current = now;
      const dt = Math.min(Math.max((now - previous) / 1000, 0), 0.05);
      const follow = 1 - Math.exp(-10.5 * dt);
      const delta = targetProgress.current - displayProgress.current;
      displayProgress.current += delta * follow;

      const settled = Math.abs(delta) < 0.00015;
      if (settled) {
        displayProgress.current = targetProgress.current;
      }

      applyTime(displayProgress.current);

      if (
        !inView.current ||
        !activeRef.current ||
        (settled && pendingSeek.current === null)
      ) {
        stopLoop();
        return;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!inView.current || !activeRef.current || looping.current) return;
      looping.current = true;
      lastTick.current = 0;
      rafId.current = requestAnimationFrame(tick);
    };
    startLoopRef.current = startLoop;

    if (video.readyState >= 1) onReady();
    else video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("seeked", onSeeked);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting && entry.intersectionRatio > 0.02;
        if (inView.current) {
          if (video.preload !== "auto") video.preload = "auto";
          startLoop();
        } else {
          stopLoop();
        }
      },
      { root: null, rootMargin: "20% 0px", threshold: [0, 0.02, 0.1] },
    );
    observer.observe(root);

    const unsub = progress.on("change", (v) => {
      targetProgress.current = v;
      if (inView.current && activeRef.current) startLoop();
    });

    return () => {
      unsub();
      stopLoop();
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [progress, src]);

  useEffect(() => {
    activeRef.current = active;
    if (!active) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
      looping.current = false;
      return;
    }
    startLoopRef.current();
  }, [active]);

  return (
    <div
      ref={rootRef}
      className={`relative ${aspectClass} mx-auto h-full max-h-full w-auto max-w-full overflow-hidden bg-transparent ${className}`}
    >
      <video
        ref={videoRef}
        className="relative z-[1] h-full w-full bg-transparent object-contain object-center [content-visibility:auto]"
        muted
        playsInline
        preload="metadata"
        disableRemotePlayback
        aria-label="Scroll to morph"
        {...({ disablePictureInPicture: true } as object)}
      >
        <source src={`${src}?v=hero-rembg2`} type={sourceType(src)} />
      </video>
    </div>
  );
}
