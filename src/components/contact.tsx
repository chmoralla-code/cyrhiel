"use client";

import { EmphasizedText } from "@/components/emphasized-text";
import { useSite } from "@/components/site-provider";

export function Contact() {
  const site = useSite();

  return (
    <section
      id="contact"
      className="px-[clamp(1.25rem,5vw,4rem)] pt-[clamp(4rem,8vw,7rem)] pb-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="hud-frame p-8 sm:p-12">
          <p className="eyebrow">{site.contact.eyebrow}</p>
          <h2 className="section-title mt-5 max-w-xl text-[clamp(1.85rem,4.2vw,2.9rem)]">
            {site.contact.headline}
          </h2>
          <p className="prose-quiet mt-5">
            <EmphasizedText text={site.contact.body} />
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={`mailto:${site.email}`}
              className="focus-ring display inline-flex w-fit items-center border border-seam-strong bg-foreground px-5 py-3 text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-background transition-opacity hover:opacity-90"
            >
              {site.contact.cta}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="focus-ring display text-sm tracking-[0.08em] text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {site.email}
            </a>
          </div>
        </div>

        <footer className="mt-12 flex flex-col gap-2 border-t border-seam pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="meta-label">
            {site.name} · {site.role}
          </p>
          <p className="blurb text-xs text-muted-dim">
            © {new Date().getFullYear()} — {site.footer.tagline}
          </p>
        </footer>
      </div>
    </section>
  );
}
