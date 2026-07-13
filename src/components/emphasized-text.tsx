"use client";

import { Fragment, type ReactNode } from "react";

/**
 * Renders plain copy with optional *italic* emphasis markers.
 * Example: "Clear load paths. *No wasted motion.*"
 */
export function EmphasizedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const nodes = emphasize(text);
  if (!className) return <>{nodes}</>;
  return <span className={className}>{nodes}</span>;
}

function emphasize(text: string): ReactNode[] {
  const parts = text.split(/(\*[^*\n]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}
