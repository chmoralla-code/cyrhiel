import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_SITE, type SiteContent } from "@/lib/content";

const DATA_PATH = path.join(process.cwd(), "data", "site-content.json");

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Shallow-merge stored JSON onto defaults so missing keys never crash the site. */
function mergeSite(raw: unknown): SiteContent {
  if (!isObject(raw)) return structuredClone(DEFAULT_SITE);
  const base = structuredClone(DEFAULT_SITE);
  return {
    ...base,
    ...raw,
    hero: { ...base.hero, ...(isObject(raw.hero) ? raw.hero : {}) },
    about: {
      ...base.about,
      ...(isObject(raw.about) ? raw.about : {}),
      body: Array.isArray((raw.about as { body?: unknown })?.body)
        ? ((raw.about as { body: string[] }).body as string[])
        : base.about.body,
      base:
        typeof (raw.about as { base?: unknown })?.base === "string"
          ? (raw.about as { base: string }).base
          : base.about.base,
      helps:
        typeof (raw.about as { helps?: unknown })?.helps === "string"
          ? (raw.about as { helps: string }).helps
          : base.about.helps,
      proof:
        typeof (raw.about as { proof?: unknown })?.proof === "string"
          ? (raw.about as { proof: string }).proof
          : base.about.proof,
      tags: Array.isArray((raw.about as { tags?: unknown })?.tags)
        ? ((raw.about as { tags: string[] }).tags as string[])
        : base.about.tags,
      cta:
        typeof (raw.about as { cta?: unknown })?.cta === "string"
          ? (raw.about as { cta: string }).cta
          : base.about.cta,
    },
    featured: {
      ...base.featured,
      ...(isObject(raw.featured) ? raw.featured : {}),
    },
    capabilities: {
      ...base.capabilities,
      ...(isObject(raw.capabilities) ? raw.capabilities : {}),
      items: Array.isArray((raw.capabilities as { items?: unknown })?.items)
        ? ((raw.capabilities as { items: SiteContent["capabilities"]["items"] })
            .items)
        : base.capabilities.items,
    },
    work: {
      ...base.work,
      ...(isObject(raw.work) ? raw.work : {}),
      projects: Array.isArray((raw.work as { projects?: unknown })?.projects)
        ? ((raw.work as { projects: SiteContent["work"]["projects"] }).projects)
        : base.work.projects,
    },
    contact: {
      ...base.contact,
      ...(isObject(raw.contact) ? raw.contact : {}),
    },
    footer: {
      ...base.footer,
      ...(isObject(raw.footer) ? raw.footer : {}),
    },
    nav: Array.isArray(raw.nav)
      ? (raw.nav as SiteContent["nav"])
      : base.nav,
  } as SiteContent;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return mergeSite(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_SITE);
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(content, null, 2), "utf8");
}
