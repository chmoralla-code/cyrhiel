"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ScrollMorphVideo } from "@/components/scroll-morph-video";
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
  const [morphActive, setMorphActive] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Morph covers profile first, scrubs, then fades to reveal copy.
  const morphProgress = useTransform(
    scrollYProgress,
    [0, 0.4],
    [0, 1],
    { clamp: true },
  );
  const morphOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.42, 0.5],
    [1, 1, 0.2, 0],
  );
  const morphScale = useTransform(scrollYProgress, [0.28, 0.48], [1, 0.94]);
  const morphVisibility = useTransform(morphOpacity, (v) =>
    v <= 0.02 ? "hidden" : "visible",
  );
  const profileOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.4, 0.5],
    [0, 0.55, 1],
  );
  const profileY = useTransform(scrollYProgress, [0.3, 0.48], [18, 0]);

  const featuredScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75],
    [0.98, 1.01, 1],
  );
  const featuredOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.48, 0.58],
    [0.35, 0.85, 1],
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
    setMorphActive(value < 0.52);

    const video = featuredVideoRef.current;
    if (!video) return;
    const visible = value >= 0.35 && value < 0.98;
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
    return () => {
      video.pause();
      featuredVisibleRef.current = false;
    };
  }, [site.featured.video]);

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
    <section ref={sectionRef} id="about" className="relative h-[260vh]">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="relative mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-3 px-[clamp(1.25rem,5vw,4rem)] py-3 md:grid md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:items-start md:gap-8 md:py-6 lg:gap-12 xl:gap-14">
          {/* Profile column — morph sits in front, then fades to reveal copy */}
          <div className="relative z-10 min-h-0 flex-[1_1_48%] overflow-hidden md:flex-none md:h-[calc(100svh-5.5rem)] md:max-h-[calc(100svh-5.5rem)] md:overflow-visible md:pt-2">
            <motion.div
              className="relative z-10 h-full min-h-0 overflow-y-auto pr-1"
              style={{ opacity: profileOpacity, y: profileY }}
            >
              <p className="eyebrow">{site.about.eyebrow}</p>
              <p className="meta-label mt-1.5 text-muted md:mt-2 lg:mt-3">
                {site.about.base ?? ""}
              </p>
              <SilverShineText
                as="h2"
                text={site.about.headline}
                className="section-title mt-2 text-[clamp(1.3rem,2.8vw,2.15rem)] md:mt-3 lg:mt-4"
              />

              <div className="mt-2.5 space-y-3 sm:space-y-3.5 md:mt-4 lg:mt-5 lg:space-y-4">
                {site.about.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="prose-quiet max-w-[40ch] text-[0.9rem] sm:text-[0.95rem] lg:text-[1rem]"
                  >
                    <EmphasizedText text={paragraph} />
                  </p>
                ))}
                {site.about.helps ? (
                  <p className="prose-quiet max-w-[40ch] text-[0.9rem] sm:text-[0.95rem] lg:text-[1rem]">
                    <EmphasizedText text={site.about.helps} />
                  </p>
                ) : null}
                {site.about.proof ? (
                  <p className="max-w-[38ch] text-[0.88rem] text-reactor/90 sm:text-[0.9rem] lg:text-[0.95rem]">
                    <EmphasizedText text={site.about.proof} />
                  </p>
                ) : null}
              </div>

              {(site.about.tags?.length ?? 0) > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2 md:mt-5">
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
                  className="focus-ring display mt-3 inline-flex items-center border border-seam-strong bg-foreground px-3.5 py-1.5 text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-background transition-opacity hover:opacity-90 sm:mt-5 sm:px-4 sm:py-2 sm:text-[0.65rem] lg:mt-6 lg:px-5 lg:py-2.5 lg:text-[0.7rem]"
                >
                  {site.about.cta}
                </a>
              ) : null}
            </motion.div>

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-gradient-to-b from-background/70 via-background/40 to-background/80 pb-1 md:items-center md:bg-transparent md:pb-0"
              style={{
                opacity: morphOpacity,
                scale: morphScale,
                visibility: morphVisibility,
              }}
            >
              <ScrollMorphVideo
                src={site.about.morphVideo}
                progress={morphProgress}
                aspectClass="aspect-[768/1168]"
                className="max-h-[min(52vh,28rem)] w-[min(100%,280px)] !h-full md:max-h-[min(78vh,40rem)] md:w-[min(100%,380px)]"
                active={morphActive}
              />
            </motion.div>
          </div>

          {/* Highlighted Omni AI project */}
          <div className="relative z-[5] flex min-h-0 flex-1 flex-col">
            <motion.div
              ref={featuredStageRef}
              className="pointer-events-auto flex min-h-0 w-full flex-1 flex-col gap-2 sm:gap-3 lg:gap-4"
              style={{ scale: featuredScale, opacity: featuredOpacity }}
            >
              <div className="shrink-0">
                <p className="meta-label text-reactor">
                  {site.featured.eyebrow}
                </p>
                <h3 className="display mt-1 text-[clamp(1.15rem,4.2vw,1.85rem)] font-semibold tracking-[0.06em] text-foreground sm:mt-1.5 lg:mt-2">
                  {site.featured.title}
                </h3>
                <p className="blurb mt-1 line-clamp-2 max-w-[42ch] text-[0.82rem] text-muted sm:mt-1.5 sm:line-clamp-none sm:text-[0.88rem] lg:mt-2 lg:text-[0.95rem]">
                  <EmphasizedText text={site.featured.detail} />
                </p>
              </div>

              <div className="relative mx-auto flex min-h-0 w-full max-w-[min(100%,22rem)] flex-1 items-center justify-center md:max-w-[min(100%,26rem)]">
                <div className="relative h-full max-h-full w-full overflow-hidden border border-seam-strong bg-background/90 shadow-[0_0_0_1px_var(--reactor-soft)]">
                  <div className="relative mx-auto aspect-[592/1280] h-full max-h-[min(42vh,24rem)] w-auto max-w-full bg-black sm:max-h-[min(48vh,28rem)] md:max-h-[min(62vh,36rem)]">
                    <video
                      ref={featuredVideoRef}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      src={`${site.featured.video}?v=featured-phone1`}
                      loop
                      playsInline
                      preload="auto"
                      muted
                      controls={isFullscreen}
                      aria-label={`${site.featured.title} featured build`}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"
                    />
                    <div className="hud-brackets pointer-events-none absolute inset-2 z-[2] sm:inset-3" />

                    <div className="absolute top-2 right-2 z-[4] flex items-center gap-1.5 sm:top-3 sm:right-3 sm:gap-2">
                      {!soundArmed ? (
                        <button
                          type="button"
                          onClick={enableSound}
                          className="focus-ring display border border-seam-strong bg-background/90 px-2.5 py-1.5 text-[0.52rem] tracking-[0.16em] uppercase text-foreground transition-colors hover:border-reactor sm:px-3 sm:py-2 sm:text-[0.58rem]"
                        >
                          Sound on
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="focus-ring display border border-seam-strong bg-background/90 px-2.5 py-1.5 text-[0.52rem] tracking-[0.16em] uppercase text-foreground transition-colors hover:border-reactor sm:px-3 sm:py-2 sm:text-[0.58rem]"
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
