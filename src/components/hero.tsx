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
      <div className="sticky top-14 isolate flex min-h-[calc(100svh-3.5rem)] flex-col justify-center overflow-x-clip overflow-y-visible px-[clamp(1.25rem,5vw,4rem)] py-4 sm:py-6 md:h-[calc(100svh-3.5rem)] md:min-h-0 md:overflow-visible lg:py-6">
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

        <div className="relative z-10 mx-auto flex w-full max-w-[96rem] flex-col items-center gap-4 md:block md:min-h-[calc(100svh-5rem)]">
          <div className="relative z-20 w-full md:absolute md:top-1/2 md:left-0 md:max-w-[min(34rem,40%)] md:-translate-y-1/2">
            <motion.p
              className="eyebrow mb-3 lg:mb-5"
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
              className="display text-[clamp(2.4rem,5.5vw,4.75rem)] font-semibold leading-[0.95] tracking-[0.04em]"
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
                      // Wave crest travels word by word
                      animationDelay: `${wordIndex * 1.1}s`,
                    }}
                  >
                    {word}
                  </span>
                </motion.span>
              ))}
            </h1>

            <p
              className="lead mt-4 max-w-[36ch] text-[clamp(1.2rem,2.4vw,1.75rem)] lg:mt-7"
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
              className="prose-quiet mt-3 lg:mt-5"
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
              className="mt-4 flex flex-wrap items-center gap-3 lg:mt-9 lg:gap-4"
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
                className="focus-ring display inline-flex items-center border border-seam-strong bg-foreground px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-background transition-opacity hover:opacity-90 lg:py-3"
              >
                {site.hero.primaryCta}
              </a>
              <a
                href="#capabilities"
                className="focus-ring display inline-flex items-center border border-seam px-5 py-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-muted transition-colors hover:border-seam-strong hover:text-foreground lg:py-3"
              >
                {site.hero.secondaryCta}
              </a>
            </motion.div>

            <motion.p
              className="mt-3 text-[0.65rem] tracking-[0.24em] uppercase text-muted/70 lg:mt-8 meta-label"
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

          <motion.div
            className="relative z-10 mx-auto flex w-full max-w-[min(92vw,640px)] items-center justify-center self-center md:absolute md:top-1/2 md:right-[-2vw] md:w-[min(916px,84vw)] md:max-w-none md:-translate-y-1/2"
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              ...transition,
              duration: reduced ? 0 : 0.8,
              delay: reduced ? 0 : 0.2,
            }}
          >
            <motion.div
              className="relative w-full"
              style={reduced ? undefined : { scale: videoScale }}
            >
              <ScrollMorphVideo
                src={site.heroVideo}
                progress={scrollYProgress}
                className="mx-auto w-full"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="hud-hairline relative z-10 mx-auto mt-4 w-full max-w-6xl lg:mt-12" />
      </div>
    </section>
  );
}
