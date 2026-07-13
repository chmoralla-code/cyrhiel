"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EmphasizedText } from "@/components/emphasized-text";
import { useSite } from "@/components/site-provider";
import { useMotionPrefs } from "@/lib/motion";

/**
 * Horizontal accordion builds — replaces the old elevator “Five builds” reel.
 */
export function Capabilities() {
  const site = useSite();
  const { reduced } = useMotionPrefs();
  const items = site.capabilities.items;
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active) {
        video.currentTime = 0;
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, items]);

  function go(delta: number) {
    setActive((current) => (current + delta + items.length) % items.length);
  }

  return (
    <section
      id="capabilities"
      className="px-[clamp(1.25rem,5vw,4rem)] py-[clamp(4rem,8vw,7rem)]"
    >
      <div className="mx-auto w-full max-w-[96rem]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-reactor">{site.capabilities.eyebrow}</p>
            <h2 className="section-title mt-3 text-[clamp(1.7rem,3.6vw,2.4rem)]">
              {site.capabilities.headline}
            </h2>
            <p className="meta-label mt-3 text-muted">{site.capabilities.hint}</p>
          </div>

          <div className="flex items-center gap-3">
            <p className="display text-[0.75rem] tracking-[0.2em]">
              <span className="text-reactor">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="text-muted">
                {" "}
                / {String(items.length).padStart(2, "0")}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="focus-ring display flex h-10 w-10 items-center justify-center border border-seam text-foreground transition-colors hover:border-reactor hover:text-reactor"
                aria-label="Previous build"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="focus-ring display flex h-10 w-10 items-center justify-center border border-seam text-foreground transition-colors hover:border-reactor hover:text-reactor"
                aria-label="Next build"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-8 flex h-[min(68vh,560px)] w-full gap-1.5 overflow-hidden"
          role="list"
          aria-label="System builds"
        >
          {items.map((item, index) => {
            const isActive = index === active;
            return (
              <motion.button
                key={item.id}
                type="button"
                role="listitem"
                onClick={() => setActive(index)}
                onMouseEnter={() => {
                  if (!reduced) setActive(index);
                }}
                className={`group relative h-full overflow-hidden border text-left transition-[border-color] duration-300 ${
                  isActive
                    ? "border-reactor/50 shadow-[inset_3px_0_0_0_var(--reactor)]"
                    : "border-seam hover:border-seam-strong"
                }`}
                initial={false}
                animate={{
                  flexGrow: isActive ? 7.2 : 1,
                  flexBasis: 0,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 140, damping: 22, mass: 0.7 }
                }
                aria-current={isActive ? "true" : undefined}
                aria-label={`${item.title}, build ${index + 1}`}
              >
                <div className="absolute inset-0 bg-black">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className={`h-full w-full object-cover transition-[filter,opacity] duration-500 ${
                      isActive
                        ? "opacity-100 grayscale-0"
                        : "opacity-55 grayscale"
                    }`}
                    src={`${item.video}?v=piso2`}
                    muted
                    loop
                    playsInline
                    preload={Math.abs(index - active) <= 1 ? "auto" : "metadata"}
                    aria-hidden={!isActive}
                  />
                </div>

                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? "bg-gradient-to-t from-black/85 via-black/20 to-black/35 opacity-100"
                      : "bg-black/55 opacity-100"
                  }`}
                />

                <span className="absolute top-3 left-3 z-[2] display text-[0.65rem] tracking-[0.18em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key={`${item.id}-copy`}
                      className="absolute inset-x-0 bottom-0 z-[2] p-4 sm:p-6"
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="meta-label text-reactor">
                        {site.capabilities.hint}
                      </p>
                      <h3 className="display mt-2 text-[clamp(1.15rem,2.2vw,1.85rem)] font-semibold tracking-[0.06em] uppercase">
                        {item.title}
                      </h3>
                      <p className="blurb mt-2 max-w-[36ch] text-[0.88rem] text-muted">
                        <EmphasizedText text={item.detail} />
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key={`${item.id}-rail`}
                      className="absolute bottom-4 left-1/2 z-[2] display text-[0.58rem] tracking-[0.18em] text-muted/75 uppercase [writing-mode:vertical-rl] rotate-180"
                      initial={false}
                      animate={{ opacity: 0.8 }}
                    >
                      {item.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
