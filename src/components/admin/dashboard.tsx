"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/content";

type Tab =
  | "identity"
  | "media"
  | "hero"
  | "about"
  | "featured"
  | "capabilities"
  | "work"
  | "contact"
  | "nav";

const TABS: { id: Tab; label: string }[] = [
  { id: "identity", label: "Identity" },
  { id: "media", label: "Media" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "Profile" },
  { id: "featured", label: "Featured" },
  { id: "capabilities", label: "5 Builds" },
  { id: "work", label: "Selected" },
  { id: "contact", label: "Engage" },
  { id: "nav", label: "Nav" },
];

function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const className =
    "w-full border border-seam bg-panel px-3 py-2.5 text-sm text-foreground outline-none focus:border-seam-strong";
  return (
    <label className="block space-y-2">
      <span className="display block text-[0.6rem] tracking-[0.16em] uppercase text-muted">
        {label}
      </span>
      {multiline ? (
        <textarea
          className={className}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint ? <span className="block text-xs text-muted-dim">{hint}</span> : null}
    </label>
  );
}

export function AdminDashboard({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("identity");
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial],
  );

  async function save() {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error || "Save failed");
        return;
      }
      setStatus("saved");
      setMessage("Published to the live site.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error while saving.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function moveCapability(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= draft.capabilities.items.length) return;
    const items = [...draft.capabilities.items];
    const [item] = items.splice(index, 1);
    items.splice(next, 0, item);
    update("capabilities", { ...draft.capabilities, items });
  }

  return (
    <div className="mx-auto max-w-6xl px-[clamp(1.25rem,5vw,4rem)] py-8">
      <header className="flex flex-col gap-4 border-b border-seam pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="display mt-2 text-2xl font-semibold tracking-wide">
            Site control
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Edit every section: identity, media paths, copy, the featured reveal,
            all five project builds, selected work, contact, and nav.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="display border border-seam px-3 py-2 text-[0.65rem] tracking-[0.16em] uppercase text-muted hover:text-foreground"
          >
            View site
          </a>
          <button
            type="button"
            onClick={logout}
            className="display border border-seam px-3 py-2 text-[0.65rem] tracking-[0.16em] uppercase text-muted hover:text-foreground"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            className="display border border-seam-strong bg-foreground px-4 py-2 text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-background disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {message ? (
        <p
          className={`mt-4 text-sm ${
            status === "error" ? "text-red-300" : "text-muted"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`display px-3 py-2 text-[0.65rem] tracking-[0.16em] uppercase border ${
              tab === item.id
                ? "border-seam-strong bg-panel-hover text-foreground"
                : "border-seam text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {tab === "identity" ? (
          <section className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              value={draft.name}
              onChange={(v) => update("name", v)}
            />
            <Field
              label="Display name"
              value={draft.nameDisplay}
              onChange={(v) => update("nameDisplay", v)}
            />
            <Field
              label="Role / eyebrow"
              value={draft.role}
              onChange={(v) => update("role", v)}
            />
            <Field
              label="Email"
              value={draft.email}
              onChange={(v) => update("email", v)}
            />
            <Field
              label="Browser title"
              value={draft.title}
              onChange={(v) => update("title", v)}
            />
            <div className="sm:col-span-2">
              <Field
                label="Meta description"
                value={draft.description}
                onChange={(v) => update("description", v)}
                multiline
              />
            </div>
          </section>
        ) : null}

        {tab === "media" ? (
          <section className="grid gap-4">
            <p className="text-sm text-muted">
              Paths are relative to <code className="text-foreground">/public</code>
              . Example: <code className="text-foreground">/videos/capability-pos.mp4</code>
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Hero morph video"
                value={draft.heroVideo}
                onChange={(v) => update("heroVideo", v)}
                hint="Supports .webm with alpha or .mp4"
              />
              <Field
                label="Hero background image"
                value={draft.heroBackground}
                onChange={(v) => update("heroBackground", v)}
              />
              <Field
                label="Profile Iron Man morph video"
                value={draft.about.morphVideo}
                onChange={(v) =>
                  update("about", { ...draft.about, morphVideo: v })
                }
              />
              <Field
                label="Featured build video"
                value={draft.featured.video}
                onChange={(v) =>
                  update("featured", { ...draft.featured, video: v })
                }
                hint="Reveals after Iron Man finishes transforming"
              />
            </div>
          </section>
        ) : null}

        {tab === "hero" ? (
          <section className="grid gap-4">
            <Field
              label="Headline"
              value={draft.hero.headline}
              onChange={(v) => update("hero", { ...draft.hero, headline: v })}
              hint="Wrap key words in *asterisks* for emphasis"
            />
            <Field
              label="Supporting"
              value={draft.hero.supporting}
              onChange={(v) =>
                update("hero", { ...draft.hero, supporting: v })
              }
              multiline
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Primary CTA"
                value={draft.hero.primaryCta}
                onChange={(v) =>
                  update("hero", { ...draft.hero, primaryCta: v })
                }
              />
              <Field
                label="Secondary CTA"
                value={draft.hero.secondaryCta}
                onChange={(v) =>
                  update("hero", { ...draft.hero, secondaryCta: v })
                }
              />
              <Field
                label="Scroll hint"
                value={draft.hero.scrollHint}
                onChange={(v) =>
                  update("hero", { ...draft.hero, scrollHint: v })
                }
              />
            </div>
          </section>
        ) : null}

        {tab === "about" ? (
          <section className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={draft.about.eyebrow}
                onChange={(v) =>
                  update("about", { ...draft.about, eyebrow: v })
                }
              />
              <Field
                label="Headline"
                value={draft.about.headline}
                onChange={(v) =>
                  update("about", { ...draft.about, headline: v })
                }
              />
            </div>
            <Field
              label="Iron Man morph video path"
              value={draft.about.morphVideo}
              onChange={(v) =>
                update("about", { ...draft.about, morphVideo: v })
              }
            />
            {draft.about.body.map((paragraph, index) => (
              <Field
                key={index}
                label={`Paragraph ${index + 1}`}
                value={paragraph}
                multiline
                rows={4}
                onChange={(v) => {
                  const body = [...draft.about.body];
                  body[index] = v;
                  update("about", { ...draft.about, body });
                }}
              />
            ))}
            <div className="flex gap-3">
              <button
                type="button"
                className="display border border-seam px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase text-muted"
                onClick={() =>
                  update("about", {
                    ...draft.about,
                    body: [...draft.about.body, ""],
                  })
                }
              >
                Add paragraph
              </button>
              {draft.about.body.length > 1 ? (
                <button
                  type="button"
                  className="display border border-seam px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase text-muted"
                  onClick={() =>
                    update("about", {
                      ...draft.about,
                      body: draft.about.body.slice(0, -1),
                    })
                  }
                >
                  Remove last
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {tab === "featured" ? (
          <section className="grid gap-4">
            <p className="text-sm text-muted">
              This is the highlighted project that appears in front of Iron Man
              after the morph finishes.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={draft.featured.eyebrow}
                onChange={(v) =>
                  update("featured", { ...draft.featured, eyebrow: v })
                }
              />
              <Field
                label="Title"
                value={draft.featured.title}
                onChange={(v) =>
                  update("featured", { ...draft.featured, title: v })
                }
              />
            </div>
            <Field
              label="Detail"
              value={draft.featured.detail}
              onChange={(v) =>
                update("featured", { ...draft.featured, detail: v })
              }
              multiline
            />
            <Field
              label="Video path"
              value={draft.featured.video}
              onChange={(v) =>
                update("featured", { ...draft.featured, video: v })
              }
            />
            <div className="border border-seam p-4">
              <p className="display text-[0.6rem] tracking-[0.16em] uppercase text-muted">
                Quick pick from 5 builds
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {draft.capabilities.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="display border border-seam px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase text-muted hover:border-seam-strong hover:text-foreground"
                    onClick={() =>
                      update("featured", {
                        ...draft.featured,
                        title: item.title,
                        detail: item.detail,
                        video: item.video,
                      })
                    }
                  >
                    Use {item.title}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === "capabilities" ? (
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Eyebrow"
                value={draft.capabilities.eyebrow}
                onChange={(v) =>
                  update("capabilities", {
                    ...draft.capabilities,
                    eyebrow: v,
                  })
                }
              />
              <Field
                label="Headline"
                value={draft.capabilities.headline}
                onChange={(v) =>
                  update("capabilities", {
                    ...draft.capabilities,
                    headline: v,
                  })
                }
              />
              <Field
                label="Hint"
                value={draft.capabilities.hint}
                onChange={(v) =>
                  update("capabilities", {
                    ...draft.capabilities,
                    hint: v,
                  })
                }
              />
            </div>
            <p className="text-sm text-muted">
              Elevator reel — edit all five project builds (title, detail, video).
            </p>
            {draft.capabilities.items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="grid gap-3 border border-seam p-4 sm:grid-cols-2"
              >
                <div className="sm:col-span-2 flex items-center justify-between gap-3">
                  <p className="display text-[0.65rem] tracking-[0.18em] uppercase text-foreground">
                    Build {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="display border border-seam px-2 py-1 text-[0.55rem] tracking-[0.12em] uppercase text-muted disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() => moveCapability(index, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="display border border-seam px-2 py-1 text-[0.55rem] tracking-[0.12em] uppercase text-muted disabled:opacity-40"
                      disabled={index === draft.capabilities.items.length - 1}
                      onClick={() => moveCapability(index, 1)}
                    >
                      Down
                    </button>
                  </div>
                </div>
                <Field
                  label="ID"
                  value={item.id}
                  onChange={(v) => {
                    const items = [...draft.capabilities.items];
                    items[index] = { ...item, id: v };
                    update("capabilities", {
                      ...draft.capabilities,
                      items,
                    });
                  }}
                />
                <Field
                  label="Title"
                  value={item.title}
                  onChange={(v) => {
                    const items = [...draft.capabilities.items];
                    items[index] = { ...item, title: v };
                    update("capabilities", {
                      ...draft.capabilities,
                      items,
                    });
                  }}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Detail"
                    value={item.detail}
                    multiline
                    onChange={(v) => {
                      const items = [...draft.capabilities.items];
                      items[index] = { ...item, detail: v };
                      update("capabilities", {
                        ...draft.capabilities,
                        items,
                      });
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Video path"
                    value={item.video}
                    onChange={(v) => {
                      const items = [...draft.capabilities.items];
                      items[index] = { ...item, video: v };
                      update("capabilities", {
                        ...draft.capabilities,
                        items,
                      });
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="display text-left text-[0.6rem] tracking-[0.14em] uppercase text-muted hover:text-foreground sm:col-span-2"
                  onClick={() =>
                    update("capabilities", {
                      ...draft.capabilities,
                      items: draft.capabilities.items.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                >
                  Remove build
                </button>
              </div>
            ))}
            <button
              type="button"
              className="display border border-seam px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase text-muted"
              onClick={() =>
                update("capabilities", {
                  ...draft.capabilities,
                  items: [
                    ...draft.capabilities.items,
                    {
                      id: `item-${draft.capabilities.items.length + 1}`,
                      title: "New build",
                      detail: "",
                      video: "/videos/capability-software.mp4",
                    },
                  ],
                })
              }
            >
              Add build
            </button>
          </section>
        ) : null}

        {tab === "work" ? (
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Eyebrow"
                value={draft.work.eyebrow}
                onChange={(v) =>
                  update("work", { ...draft.work, eyebrow: v })
                }
              />
              <Field
                label="Headline"
                value={draft.work.headline}
                onChange={(v) =>
                  update("work", { ...draft.work, headline: v })
                }
              />
              <Field
                label="Card note"
                value={draft.work.note}
                onChange={(v) => update("work", { ...draft.work, note: v })}
              />
            </div>
            {draft.work.projects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="grid gap-3 border border-seam p-4 sm:grid-cols-2"
              >
                <Field
                  label="ID"
                  value={project.id}
                  onChange={(v) => {
                    const projects = [...draft.work.projects];
                    projects[index] = { ...project, id: v };
                    update("work", { ...draft.work, projects });
                  }}
                />
                <Field
                  label="Title"
                  value={project.title}
                  onChange={(v) => {
                    const projects = [...draft.work.projects];
                    projects[index] = { ...project, title: v };
                    update("work", { ...draft.work, projects });
                  }}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Blurb"
                    value={project.blurb}
                    multiline
                    onChange={(v) => {
                      const projects = [...draft.work.projects];
                      projects[index] = { ...project, blurb: v };
                      update("work", { ...draft.work, projects });
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Video path (optional)"
                    value={project.video || ""}
                    onChange={(v) => {
                      const projects = [...draft.work.projects];
                      projects[index] = {
                        ...project,
                        video: v || undefined,
                      };
                      update("work", { ...draft.work, projects });
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="display text-left text-[0.6rem] tracking-[0.14em] uppercase text-muted hover:text-foreground sm:col-span-2"
                  onClick={() =>
                    update("work", {
                      ...draft.work,
                      projects: draft.work.projects.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                >
                  Remove project
                </button>
              </div>
            ))}
            <button
              type="button"
              className="display border border-seam px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase text-muted"
              onClick={() =>
                update("work", {
                  ...draft.work,
                  projects: [
                    ...draft.work.projects,
                    {
                      id: `project-${draft.work.projects.length + 1}`,
                      title: "New project",
                      blurb: "",
                      video: "",
                    },
                  ],
                })
              }
            >
              Add project
            </button>
          </section>
        ) : null}

        {tab === "contact" ? (
          <section className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Eyebrow"
                value={draft.contact.eyebrow}
                onChange={(v) =>
                  update("contact", { ...draft.contact, eyebrow: v })
                }
              />
              <Field
                label="CTA label"
                value={draft.contact.cta}
                onChange={(v) =>
                  update("contact", { ...draft.contact, cta: v })
                }
              />
            </div>
            <Field
              label="Headline"
              value={draft.contact.headline}
              onChange={(v) =>
                update("contact", { ...draft.contact, headline: v })
              }
            />
            <Field
              label="Body"
              value={draft.contact.body}
              multiline
              onChange={(v) =>
                update("contact", { ...draft.contact, body: v })
              }
            />
            <Field
              label="Footer tagline"
              value={draft.footer.tagline}
              onChange={(v) => update("footer", { tagline: v })}
            />
          </section>
        ) : null}

        {tab === "nav" ? (
          <section className="space-y-4">
            {draft.nav.map((item, index) => (
              <div
                key={`${item.href}-${index}`}
                className="grid gap-3 border border-seam p-4 sm:grid-cols-[1fr_1fr_auto]"
              >
                <Field
                  label="Label"
                  value={item.label}
                  onChange={(v) => {
                    const nav = [...draft.nav];
                    nav[index] = { ...item, label: v };
                    update("nav", nav);
                  }}
                />
                <Field
                  label="Href"
                  value={item.href}
                  onChange={(v) => {
                    const nav = [...draft.nav];
                    nav[index] = { ...item, href: v };
                    update("nav", nav);
                  }}
                />
                <button
                  type="button"
                  className="display self-end border border-seam px-3 py-2.5 text-[0.6rem] tracking-[0.14em] uppercase text-muted"
                  onClick={() =>
                    update(
                      "nav",
                      draft.nav.filter((_, i) => i !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="display border border-seam px-3 py-2 text-[0.6rem] tracking-[0.14em] uppercase text-muted"
              onClick={() =>
                update("nav", [
                  ...draft.nav,
                  { label: "New link", href: "#top" },
                ])
              }
            >
              Add nav link
            </button>
          </section>
        ) : null}
      </div>
    </div>
  );
}
