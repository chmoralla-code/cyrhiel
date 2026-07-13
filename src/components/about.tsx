"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { SilverShineText } from "@/components/silver-shine-text";
import { EmphasizedText } from "@/components/emphasized-text";
import { useSite } from "@/components/site-provider";

export function About() {
  const site = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  const featuredStageRef = useRef<HTMLDivElement>(null);
  const featuredVideoRef = useRef<HTMLVideoElement>(null);
  const soundArmedRef = useRef(false);
  const featuredVisibleRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundArmed, setSoundArmed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const featuredScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75],
    [0.98, 1.02, 1],
  );

  const playFeatured = useCallback(async (withSound: boolean) => {
    const video = featuredVideoRef.current;
    if (!video) return;
    video.volume = 1;
    video.muted = !withSound;
    try {
      await video.play();
      if (withSound) {
        soundArmedRef.current = true;
        setSoundArmed(true);
      }
    } catch {
      if (withSound) {
        video.muted = true;
        try {
          await video.play();
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  useEffect(() => {
    const unlock = () => {
      soundArmedRef.current = true;
      setSoundArmed(true);
      if (featuredVisibleRef.current) {
        void playFeatured(true);
      }
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [playFeatured]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const video = featuredVideoRef.current;
    if (!video) return;
    // Play while About is the sticky focus; pause when nearly scrolled past.
    const visible = value >= 0 && value < 0.98;
    if (visible) {
      if (!featuredVisibleRef.current) {
        featuredVisibleRef.current = true;
        void playFeatured(soundArmedRef.current);
      }
    } else if (featuredVisibleRef.current) {
      featuredVisibleRef.current = false;
      video.pause();
    }
  });

  useEffect(() => {
    const video = featuredVideoRef.current;
    if (!video) return;
    featuredVisibleRef.current = true;
    void playFeatured(false);
    return () => {
      video.pause();
      featuredVisibleRef.current = false;
    };
  }, [playFeatured, site.featured.video]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const active =
        document.fullscreenElement === featuredStageRef.current ||
        doc.webkitFullscreenElement === featuredStageRef.current;
      setIsFullscreen(Boolean(active));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange,
      );
    };
  }, []);

  async function toggleFullscreen() {
    const stage = featuredStageRef.current;
    if (!stage) return;

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    const el = stage as HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };

    const active =
      document.fullscreenElement === stage ||
      doc.webkitFullscreenElement === stage;

    if (active) {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      return;
    }

    if (stage.requestFullscreen) await stage.requestFullscreen();
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    await playFeatured(true);
  }

  async function enableSound() {
    soundArmedRef.current = true;
    setSoundArmed(true);
    await playFeatured(true);
  }

  return (
    <section ref={sectionRef} id="about" className="relative h-[180vh]">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col gap-4 px-[clamp(1.25rem,5vw,4rem)] py-4 md:grid md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:items-start md:gap-8 md:py-6 lg:gap-12 xl:gap-14">
          {/* Identity — stays visible beside the highlighted build */}
          <div className="relative z-10 min-h-0 shrink-0 overflow-y-auto pr-1 max-h-[min(46%,22rem)] md:max-h-[calc(100svh-5.5rem)] md:pt-2">
            <p className="eyebrow">{site.about.eyebrow}</p>
            <p className="meta-label mt-2 text-muted lg:mt-3">
              {site.about.base ?? ""}
            </p>
            <SilverShineText
              as="h2"
              text={site.about.headline}
              className="section-title mt-3 text-[clamp(1.45rem,2.8vw,2.15rem)] lg:mt-4"
            />

            <div className="mt-4 space-y-3.5 lg:mt-5 lg:space-y-4">
              {site.about.body.map((paragraph) => (
                <p key={paragraph} className="prose-quiet max-w-[40ch] text-[0.95rem] lg:text-[1rem]">
                  <EmphasizedText text={paragraph} />
                </p>
              ))}
              {site.about.helps ? (
                <p className="prose-quiet max-w-[40ch] text-[0.95rem] lg:text-[1rem]">
                  <EmphasizedText text={site.about.helps} />
                </p>
              ) : null}
              {site.about.proof ? (
                <p className="max-w-[38ch] text-[0.9rem] text-reactor/90 lg:text-[0.95rem]">
                  <EmphasizedText text={site.about.proof} />
                </p>
              ) : null}
            </div>

            {(site.about.tags?.length ?? 0) > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {site.about.tags.map((tag) => (
                  <li
                    key={tag}
                    className="display border border-seam px-2.5 py-1 text-[0.55rem] tracking-[0.16em] uppercase text-muted lg:px-3 lg:py-1.5 lg:text-[0.58rem]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {site.about.cta ? (
              <a
                href={`mailto:${site.email}`}
                className="focus-ring display mt-5 inline-flex items-center border border-seam-strong bg-foreground px-4 py-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-background transition-opacity hover:opacity-90 lg:mt-6 lg:px-5 lg:py-2.5 lg:text-[0.7rem]"
              >
                {site.about.cta}
              </a>
            ) : null}
          </div>

          {/* Highlighted Omni AI project */}
          <div className="relative z-[5] min-h-0 flex-1">
            <div className="relative flex h-full min-h-[38vh] items-start justify-center pt-2 md:min-h-[calc(100svh-6rem)] md:items-center md:pt-0">
              <motion.div
                ref={featuredStageRef}
                className="pointer-events-auto relative z-[5] flex w-full flex-col justify-center gap-3 lg:gap-4"
                style={{ scale: featuredScale }}
              >
                <div>
                  <p className="meta-label text-reactor">
                    {site.featured.eyebrow}
                  </p>
                  <h3 className="display mt-1.5 text-[clamp(1.25rem,2.6vw,1.85rem)] font-semibold tracking-[0.06em] text-foreground lg:mt-2">
                    {site.featured.title}
                  </h3>
                  <p className="blurb mt-1.5 max-w-[42ch] text-[0.88rem] text-muted lg:mt-2 lg:text-[0.95rem]">
                    <EmphasizedText text={site.featured.detail} />
                  </p>
                </div>

                <div className="relative overflow-hidden border border-seam-strong bg-background/90 shadow-[0_0_0_1px_var(--reactor-soft)]">
                  <div className="relative aspect-[1168/784] w-full max-h-[min(48vh,28rem)] bg-black lg:max-h-[min(58vh,34rem)]">
                    <video
                      ref={featuredVideoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={`${site.featured.video}?v=featured-restore`}
                      loop
                      playsInline
                      preload="auto"
                      muted
                      controls={isFullscreen}
                      aria-label={`${site.featured.title} featured build`}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
                    />
                    <div className="hud-brackets pointer-events-none absolute inset-3 z-[2]" />

                    <div className="absolute top-3 right-3 z-[4] flex items-center gap-2">
                      {!soundArmed ? (
                        <button
                          type="button"
                          onClick={enableSound}
                          className="focus-ring display border border-seam-strong bg-background/90 px-3 py-2 text-[0.58rem] tracking-[0.16em] uppercase text-foreground transition-colors hover:border-reactor"
                        >
                          Sound on
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="focus-ring display border border-seam-strong bg-background/90 px-3 py-2 text-[0.58rem] tracking-[0.16em] uppercase text-foreground transition-colors hover:border-reactor"
                        aria-label={
                          isFullscreen
                            ? "Exit full screen"
                            : "Expand featured video to full screen"
                        }
                      >
                        {isFullscreen ? "Exit" : "Full screen"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
