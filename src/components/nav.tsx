"use client";

import { useState } from "react";
import { MusicToggle } from "@/components/background-music";
import { useSite } from "@/components/site-provider";

export function Nav() {
  const site = useSite();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-seam bg-[rgba(5,5,5,0.92)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-[clamp(1.25rem,5vw,4rem)]">
        <a
          href="#top"
          className="display focus-ring text-xs font-semibold tracking-[0.18em] text-foreground"
        >
          {site.nameDisplay.split(" ")[0]}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring display text-[0.65rem] tracking-[0.2em] uppercase text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <MusicToggle />
          <a
            href={`mailto:${site.email}`}
            className="focus-ring display border border-seam-strong px-3 py-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-foreground transition-colors hover:border-reactor hover:bg-panel-hover"
          >
            {site.hero.primaryCta}
          </a>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <MusicToggle />
          <button
            type="button"
            className="focus-ring display text-[0.65rem] tracking-[0.18em] uppercase text-muted"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-seam px-[clamp(1.25rem,5vw,4rem)] py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="focus-ring display block py-1 text-xs tracking-[0.18em] uppercase text-muted"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.email}`}
                className="focus-ring display block border border-seam-strong px-3 py-2 text-center text-xs tracking-[0.18em] uppercase"
                onClick={() => setOpen(false)}
              >
                {site.hero.primaryCta}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
