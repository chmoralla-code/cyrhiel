"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ScrollMorphVideo } from "@/components/scroll-morph-video";
import { EmphasizedText } from "@/components/emphasized-text";
import { useSite } from "@/components/site-provider";
import { useMotionPrefs } from "@/lib/motion";

export function Hero() {
  const site = useSite();
  const { reduced, transition } = useMotionPrefs();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Only the morph video stays scroll-linked
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);

  const nameWords = site.nameDisplay.split(/\s+/).filter(Boolean);
  const headlineWords = site.hero.headline.split(/\s+/).filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[420vh]"
      aria-label="Hero"
    >
      <div className="sticky top-14 isolate flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden px-[clamp(1.25rem,5vw,4rem)] py-3 sm:py-5 md:justify-center md:overflow-visible lg:py-6">
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-65"
          style={{ backgroundImage: `url('${site.heroBackground}')` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.66) 38%, rgba(5,5,5,0.38) 70%, rgba(5,5,5,0.52) 100%), linear-gradient(180deg, rgba(5,5,5,0.55) 0%, transparent 44%, rgba(5,5,5,0.78) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[96rem] flex-col md:block">
          {/* Copy — compact on mobile so the morph figure stays fully in view */}
          <div className="relative z-20 w-full shrink-0 md:absolute md:top-1/2 md:left-0 md:max-w-[min(34rem,40%)] md:-translate-y-1/2">
            <motion.p
              className="eyebrow mb-1.5 sm:mb-3 lg:mb-5"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...transition,
                duration: reduced ? 0 : 0.7,
                delay: reduced ? 0 : 0.1,
              }}
            >
              {site.role}
            </motion.p>

            <h1
              className="display text-[clamp(1.85rem,7.2vw,4.75rem)] font-semibold leading-[0.95] tracking-[0.04em]"
              aria-label={site.name}
            >
              {nameWords.map((word, wordIndex) => (
                <motion.span
                  key={`${word}-${wordIndex}`}
                  className="mr-[0.18em] inline-block whitespace-nowrap"
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...transition,
                    duration: reduced ? 0 : 0.55,
                    delay: reduced ? 0 : 0.25 + wordIndex * 0.12,
                  }}
                >
                  <span
                    className="silver-shine"
                    style={{
                      animationDelay: `${wordIndex * 1.1}s`,
                    }}
                  >
                    {word}
                  </span>
                </motion.span>
              ))}
            </h1>

            <p
              className="lead mt-2 line-clamp-3 max-w-[36ch] text-[clamp(0.98rem,3.4vw,1.75rem)] sm:mt-4 sm:line-clamp-none lg:mt-7"
              aria-label={site.hero.headline.replace(/\*/g, "")}
            >
              {headlineWords.map((word, i) => {
                const isMark = word.startsWith("*") || word.endsWith("*");
                const clean = word.replace(/\*/g, "");
                return (
                  <motion.span
                    key={`${clean}-${i}`}
                    className={`mr-[0.28em] inline-block ${isMark ? "not-italic" : ""}`}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...transition,
                      duration: reduced ? 0 : 0.5,
                      delay: reduced ? 0 : 0.75 + i * 0.08,
                    }}
                  >
                    {isMark ? <em>{clean}</em> : clean}
                  </motion.span>
                );
              })}
            </p>

            <motion.p
              className="prose-quiet mt-2 hidden md:block lg:mt-5"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...transition,
                duration: reduced ? 0 : 0.65,
                delay: reduced ? 0 : 1.05,
              }}
            >
              <EmphasizedText text={site.hero.supporting} />
            </motion.p>

            <motion.div
              className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3 lg:mt-9 lg:gap-4"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...transition,
                duration: reduced ? 0 : 0.6,
                delay: reduced ? 0 : 1.2,
              }}
            >
              <a
                href={`mailto:${site.email}`}
                className="focus-ring display inline-flex items-center border border-seam-strong bg-foreground px-4 py-2 text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-background transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-[0.7rem] lg:py-3"
              >
                {site.hero.primaryCta}
              </a>
              <a
                href="#capabilities"
                className="focus-ring display inline-flex items-center border border-seam px-4 py-2 text-[0.62rem] tracking-[0.18em] uppercase text-muted transition-colors hover:border-seam-strong hover:text-foreground sm:px-5 sm:py-2.5 sm:text-[0.7rem] lg:py-3"
              >
                {site.hero.secondaryCta}
              </a>
            </motion.div>

            <motion.p
              className="meta-label mt-1.5 text-[0.58rem] tracking-[0.24em] uppercase text-muted/70 sm:mt-3 sm:text-[0.65rem] lg:mt-8"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{
                ...transition,
                duration: reduced ? 0 : 0.7,
                delay: reduced ? 0 : 1.4,
              }}
            >
              {site.hero.scrollHint}
            </motion.p>
          </div>

          {/* Morph stage — takes remaining sticky height on mobile so full figure fits */}
          <motion.div
            className="relative z-10 mt-1 flex min-h-0 w-full flex-1 items-center justify-center md:absolute md:top-1/2 md:right-[-2vw] md:mt-0 md:block md:h-auto md:w-[min(916px,84vw)] md:max-w-none md:flex-none md:-translate-y-1/2"
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              ...transition,
              duration: reduced ? 0 : 0.8,
              delay: reduced ? 0 : 0.2,
            }}
          >
            <motion.div
              className="relative flex h-full max-h-full w-full max-w-[min(92vw,640px)] items-center justify-center md:max-w-none"
              style={reduced ? undefined : { scale: videoScale }}
            >
              <ScrollMorphVideo
                src={site.heroVideo}
                progress={scrollYProgress}
                className="max-h-full w-full md:max-h-none"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="hud-hairline relative z-10 mx-auto mt-2 hidden w-full max-w-6xl md:mt-4 md:block lg:mt-12" />
      </div>
    </section>
  );
}
