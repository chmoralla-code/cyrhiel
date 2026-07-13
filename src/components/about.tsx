"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ScrollMorphVideo } from "@/components/scroll-morph-video";
import { SilverShineText } from "@/components/silver-shine-text";
import { EmphasizedText } from "@/components/emphasized-text";
import { useSite } from "@/components/site-provider";

function WebShot({
  progress,
  x,
  endX,
  start,
  end,
}: {
  progress: MotionValue<number>;
  x: number;
  endX: number;
  start: number;
  end: number;
}) {
  const length = useTransform(progress, [start, end], [0, 1]);
  const forkLength = useTransform(progress, [end - 0.08, end + 0.08], [0, 1]);
  const opacity = useTransform(
    progress,
    [start, start + 0.06, 0.9, 1],
    [0, 0.9, 0.75, 0],
  );

  const mainPath = `M ${x} 23 C ${x - 1.5} 36, ${x + 1.6} 49, ${
    x - 0.7
  } 62 S ${endX + 1.2} 78, ${endX} 88`;
  const echoPath = `M ${x + 0.55} 23 C ${x + 1.2} 39, ${
    x - 1.1
  } 52, ${x + 0.6} 65 S ${endX - 0.9} 79, ${endX + 0.4} 88`;
  const forkPath = `M ${endX} 88 Q ${endX - 2.8} 90, ${
    endX - 3.7
  } 94 M ${endX} 88 Q ${endX + 2.9} 90, ${
    endX + 3.8
  } 94 M ${endX} 88 L ${endX} 96`;

  return (
    <g>
      <motion.path
        d={mainPath}
        fill="none"
        stroke="rgba(232,244,255,0.88)"
        strokeWidth="0.09"
        strokeLinecap="round"
        style={{ pathLength: length, opacity }}
      />
      <motion.path
        d={echoPath}
        fill="none"
        stroke="rgba(200,230,255,0.34)"
        strokeWidth="0.045"
        strokeLinecap="round"
        style={{ pathLength: length, opacity }}
      />
      <motion.path
        d={forkPath}
        fill="none"
        stroke="rgba(232,244,255,0.64)"
        strokeWidth="0.07"
        strokeLinecap="round"
        style={{ pathLength: forkLength, opacity }}
      />
    </g>
  );
}

export function About() {
  const site = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  const featuredStageRef = useRef<HTMLDivElement>(null);
  const featuredVideoRef = useRef<HTMLVideoElement>(null);
  const soundArmedRef = useRef(false);
  const featuredVisibleRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundArmed, setSoundArmed] = useState(false);
  const [ironActive, setIronActive] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const webProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 28,
    mass: 0.35,
    restDelta: 0.0005,
  });
  const netLength = useTransform(webProgress, [0.42, 0.72], [0, 1]);
  const netOpacity = useTransform(
    webProgress,
    [0.4, 0.5, 0.74, 0.86],
    [0, 0.48, 0.42, 0],
  );

  // Iron Man finishes the morph, then yields to the featured build.
  const ironOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.52, 0.58],
    [1, 1, 0.15, 0],
  );
  const ironScale = useTransform(scrollYProgress, [0.45, 0.58], [1, 0.9]);
  const ironVisibility = useTransform(ironOpacity, (value) =>
    value <= 0.01 ? "hidden" : "visible",
  );
  // Featured arrives mid-scroll so Profile + video hold side-by-side longer.
  const featuredOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.58, 0.66],
    [0, 0.92, 1],
  );
  const featuredScale = useTransform(
    scrollYProgress,
    [0.5, 0.62, 0.7],
    [0.94, 1.01, 1],
  );
  const featuredY = useTransform(scrollYProgress, [0.5, 0.62], [28, 0]);
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.54, 0.62, 0.7],
    [0, 0.95, 1],
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
      // Browsers block unmuted autoplay until a gesture — fall back muted.
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

  // Any click/key/touch unlocks unmuted playback for when the featured card shows.
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
    setIronActive(value < 0.58);
    const video = featuredVideoRef.current;
    if (!video) return;
    const visible = value >= 0.5;
    if (visible) {
      if (!featuredVisibleRef.current) {
        featuredVisibleRef.current = true;
        // Auto-play with sound as soon as the highlighted build appears.
        void playFeatured(true);
      }
    } else if (featuredVisibleRef.current) {
      featuredVisibleRef.current = false;
      video.pause();
    }
  });

  useEffect(() => {
    const video = featuredVideoRef.current;
    if (!video) return;
    video.pause();
    featuredVisibleRef.current = false;
    soundArmedRef.current = false;
    setSoundArmed(false);
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
    <section ref={sectionRef} id="about" className="relative h-[300vh]">
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

          {/* Right stage: Iron Man morph → featured project */}
          <div className="relative z-[5] min-h-0 flex-1">
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[4] hidden h-full w-full lg:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter
                  id="web-glow"
                  x="-20%"
                  y="-10%"
                  width="140%"
                  height="130%"
                >
                  <feGaussianBlur stdDeviation="0.22" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g filter="url(#web-glow)">
                <WebShot
                  progress={webProgress}
                  x={22}
                  endX={23}
                  start={0.08}
                  end={0.42}
                />
                <WebShot
                  progress={webProgress}
                  x={43}
                  endX={42}
                  start={0.14}
                  end={0.48}
                />
                <WebShot
                  progress={webProgress}
                  x={64}
                  endX={65}
                  start={0.2}
                  end={0.54}
                />
                <WebShot
                  progress={webProgress}
                  x={85}
                  endX={84}
                  start={0.26}
                  end={0.6}
                />

                <motion.path
                  d="M 23 88 Q 32 80, 42 88 Q 53 79, 65 88 Q 75 80, 84 88 M 23 78 Q 32 86, 42 78 Q 53 86, 65 78 Q 75 86, 84 78 M 23 88 L 42 78 L 65 88 L 84 78"
                  fill="none"
                  stroke="rgba(200,230,255,0.42)"
                  strokeWidth="0.05"
                  strokeLinecap="round"
                  style={{ pathLength: netLength, opacity: netOpacity }}
                />
              </g>
            </svg>

            <div className="relative flex h-full min-h-[38vh] items-start justify-center pt-2 md:min-h-[calc(100svh-6rem)] md:items-center md:pt-0">
              <motion.div
                aria-hidden
                className="relative z-[1] w-[min(42vw,200px)] lg:w-[min(36vw,22rem)]"
                style={{
                  opacity: ironOpacity,
                  scale: ironScale,
                  visibility: ironVisibility,
                }}
              >
                <ScrollMorphVideo
                  src={site.about.morphVideo}
                  progress={scrollYProgress}
                  aspectClass="aspect-[1080/1746]"
                  className="w-full"
                  active={ironActive}
                />
              </motion.div>

              <motion.div
                ref={featuredStageRef}
                className="pointer-events-auto absolute inset-0 z-[5] flex flex-col justify-center gap-3 lg:gap-4"
                style={{
                  opacity: featuredOpacity,
                  scale: featuredScale,
                  y: featuredY,
                }}
              >
                <motion.div style={{ opacity: captionOpacity }}>
                  <p className="meta-label text-reactor">
                    {site.featured.eyebrow}
                  </p>
                  <h3 className="display mt-1.5 text-[clamp(1.25rem,2.6vw,1.85rem)] font-semibold tracking-[0.06em] text-foreground lg:mt-2">
                    {site.featured.title}
                  </h3>
                  <p className="blurb mt-1.5 max-w-[42ch] text-[0.88rem] text-muted lg:mt-2 lg:text-[0.95rem]">
                    <EmphasizedText text={site.featured.detail} />
                  </p>
                </motion.div>

                <div className="relative overflow-hidden border border-seam-strong bg-background/90 shadow-[0_0_0_1px_var(--reactor-soft)]">
                  <div className="relative aspect-[1168/784] w-full max-h-[min(36vh,20rem)] bg-black lg:max-h-[min(48vh,26rem)]">
                    <video
                      ref={featuredVideoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={`${site.featured.video}?v=featured-audio2`}
                      loop
                      playsInline
                      preload="auto"
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
