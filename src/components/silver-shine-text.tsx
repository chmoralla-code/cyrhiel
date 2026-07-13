type SilverShineTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Delay between each word’s wave crest (seconds) */
  stagger?: number;
};

/**
 * Word-by-word looping silver shine. Plain spans only —
 * keep Framer Motion transforms off these nodes.
 */
export function SilverShineText({
  text,
  className = "",
  as: Tag = "span",
  stagger = 1.1,
}: SilverShineTextProps) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="mr-[0.22em] inline-block whitespace-nowrap last:mr-0"
        >
          <span
            className="silver-shine"
            style={{ animationDelay: `${wordIndex * stagger}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
