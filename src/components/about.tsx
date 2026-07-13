"use client";

import { useRef, useState } from "react";
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
  const [featuredActive, setFeaturedActive] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const featuredScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7],
    [0.98, 1.02, 1],
  );
  const featuredMorphProgress = useTransform(
    scrollYProgress,
    [0.05, 0.95],
    [0, 1],
    { clamp: true },
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setFeaturedActive(value < 0.98);
  });

  return (
    <section ref={sectionRef} id="about" className="relative h-[220vh]">
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

          {/* Featured scroll-morph stage */}
          <div className="relative z-[5] min-h-0 flex-1">
            <div className="relative flex h-full min-h-[38vh] items-start justify-center pt-2 md:min-h-[calc(100svh-6rem)] md:items-center md:pt-0">
              <motion.div
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

                <div className="relative mx-auto flex w-full max-w-[min(100%,560px)] items-center justify-center md:max-w-[min(100%,620px)]">
                  <ScrollMorphVideo
                    src={site.featured.video}
                    progress={featuredMorphProgress}
                    aspectClass="aspect-[768/1168]"
                    className="max-h-[min(58vh,32rem)] w-auto !h-full md:max-h-[min(68vh,38rem)]"
                    active={featuredActive}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
