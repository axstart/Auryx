import type { ReactNode } from "react";

/** Render text with `**bold**` segments and mailto links for emails. */
export function RichText({
  text,
  className,
  strongClassName = "text-foreground font-medium",
}: {
  text: string;
  className?: string;
  strongClassName?: string;
}): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|[\w.+-]+@[\w.-]+\.\w+)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (!part) return null;
        const bold = /^\*\*(.+)\*\*$/.exec(part);
        if (bold) {
          return (
            <strong key={i} className={strongClassName}>
              {bold[1]}
            </strong>
          );
        }
        if (/^[\w.+-]+@[\w.-]+\.\w+$/.test(part)) {
          return (
            <a
              key={i}
              href={`mailto:${part}`}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
