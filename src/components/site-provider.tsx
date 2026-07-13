"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_SITE, type SiteContent } from "@/lib/content";

const SiteContext = createContext<SiteContent>(DEFAULT_SITE);

export function SiteProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return (
    <SiteContext.Provider value={content}>{children}</SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
