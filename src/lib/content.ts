export type NavItem = {
  label: string;
  href: string;
};

export type CapabilityItem = {
  id: string;
  title: string;
  detail: string;
  video: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  blurb: string;
  video?: string;
};

export type FeaturedBuild = {
  eyebrow: string;
  title: string;
  detail: string;
  video: string;
};

export type SiteContent = {
  name: string;
  nameDisplay: string;
  role: string;
  title: string;
  description: string;
  email: string;
  heroVideo: string;
  heroBackground: string;
  hero: {
    headline: string;
    supporting: string;
    primaryCta: string;
    secondaryCta: string;
    scrollHint: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    body: string[];
    base: string;
    helps: string;
    proof: string;
    tags: string[];
    cta: string;
    morphVideo: string;
  };
  featured: FeaturedBuild;
  capabilities: {
    eyebrow: string;
    headline: string;
    hint: string;
    items: CapabilityItem[];
  };
  work: {
    eyebrow: string;
    headline: string;
    note: string;
    projects: ProjectItem[];
  };
  contact: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
  };
  footer: {
    tagline: string;
  };
  nav: NavItem[];
};

export const DEFAULT_SITE: SiteContent = {
  name: "Cyrhiel Moralla",
  nameDisplay: "CYRHIEL MORALLA",
  role: "Architecture graduate & architect for systems",
  title: "Cyrhiel Moralla — Blueprint Systems",
  description:
    "Cyrhiel Moralla designs and ships the systems businesses run on—websites, Android apps, custom software, POS, and PisoWiFi networks.",
  email: "cyrhiel2020@gmail.com",
  heroVideo: "/videos/hero-morph-alpha.webm",
  heroBackground: "/ironman-hero-bg.png",
  hero: {
    headline:
      "One purpose: help the business *earn more* & *reach goals* through systems that save time and money from manual mistakes.",
    supporting:
      "Websites, APKs, software, POS, and PisoWiFi—*drawn with the discipline of architecture.* Clear load paths. No wasted motion.",
    primaryCta: "Brief me",
    secondaryCta: "See builds",
    scrollHint: "Scroll to morph",
  },
  about: {
    eyebrow: "Profile",
    headline: "Architecture graduate. Systems builder.",
    body: [
      "Instead of drafting buildings for everyone, I design *structures and systems* that uplift the business industry.",
      "Same discipline as architecture—constraints, load paths, no wasted motion—applied to websites, APKs, software, POS, and PisoWiFi stacks.",
    ],
    base: "Ubujan, Tagbilaran, Bohol",
    helps:
      "Built for people chasing *passive income*—and business owners who want to *save time and money.*",
    proof:
      "With AI in the loop, I ship systems *faster than traditional IT timelines.*",
    tags: [
      "Websites",
      "Android APK",
      "Software",
      "POS",
      "PisoWiFi",
      "AI",
    ],
    cta: "Brief me",
    morphVideo: "/videos/featured-morph-alpha.webm",
  },
  featured: {
    eyebrow: "#1 SOFTWARE MADE SO FAR",
    title: "Omni AI Builder",
    detail:
      "ChatGPT-class AI—*built to design, code, and ship almost anything,* from interfaces to full operating systems.",
    video: "/videos/featured-build.mp4",
  },
  capabilities: {
    eyebrow: "Builds",
    headline: "Five systems. One standard.",
    hint: "Hover or arrow through",
    items: [
      {
        id: "web",
        title: "Websites",
        detail:
          "Business sites and ops interfaces built for *clarity, speed, and daily use*—not decoration.",
        video: "/videos/capability-websites.mp4",
      },
      {
        id: "apk",
        title: "Android APK",
        detail:
          "Field apps for inventory, crews, and workflows that need to work *offline-first.*",
        video: "/videos/capability-apk.mp4",
      },
      {
        id: "software",
        title: "Software",
        detail:
          "Custom systems shaped around how your floor already moves—*so the tool fits the work.*",
        video: "/videos/capability-software.mp4",
      },
      {
        id: "pos",
        title: "POS",
        detail:
          "Checkout and inventory flows tuned for retail pace: *fewer taps, cleaner control, less leakage.*",
        video: "/videos/capability-pos.mp4",
      },
      {
        id: "pisowifi",
        title: "PisoWiFi",
        detail:
          "Coin-op and community WiFi stacks that stay up at the edge—*local, reliable, ownable.*",
        video: "/videos/capability-pisowifi.mp4",
      },
    ],
  },
  work: {
    eyebrow: "Builds",
    headline: "Selected systems in the field",
    note: "Case study soon",
    projects: [
      {
        id: "omni-ai",
        title: "Omni AI Builder",
        blurb:
          "ChatGPT-class AI—*built to design, code, and ship almost anything.*",
        video: "/videos/featured-build.mp4",
      },
      {
        id: "retail-core",
        title: "Retail Core",
        blurb: "POS and inventory spine for *day-to-day retail control.*",
        video: "/videos/capability-pos.mp4",
      },
      {
        id: "edge-net",
        title: "Edge Net",
        blurb: "PisoWiFi network stack built for *uptime at the edge.*",
        video: "/videos/capability-pisowifi.mp4",
      },
      {
        id: "storefront-os",
        title: "Storefront OS",
        blurb: "Public site plus ops UI—*one surface for brand and work.*",
        video: "/videos/capability-websites.mp4",
      },
      {
        id: "field-app",
        title: "Field App",
        blurb: "Android APK for crews who work *away from the desk.*",
        video: "/videos/capability-apk.mp4",
      },
      {
        id: "floor-software",
        title: "Floor Software",
        blurb:
          "Custom tools shaped around how the floor already moves—*so the system fits the work.*",
        video: "/videos/capability-software.mp4",
      },
    ],
  },
  contact: {
    eyebrow: "Engage",
    headline: "Bring the constraint. I'll bring the system.",
    body: "Tell me what is slowing the floor down. I will map the build and answer with a *clear next step.*",
    cta: "Email Cyrhiel",
  },
  footer: {
    tagline: "Blueprint in. System out.",
  },
  nav: [
    { label: "Profile", href: "#about" },
    { label: "Builds", href: "#capabilities" },
    { label: "Engage", href: "#contact" },
  ],
};

/** @deprecated Prefer useSite() — kept for static fallbacks */
export const site = DEFAULT_SITE;
