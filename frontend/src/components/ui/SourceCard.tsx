import type { Source } from "../../types";

export const SourceCard: React.FC<{ source: Source; index: number }> = ({
  source,
  index,
}) => {
  const title =
    (typeof source === "string" ? source : source.title || source.link) ||
    `Source ${index + 1}`;
  const url = typeof source !== "string" ? source.link : undefined;
  const snippet = typeof source !== "string" ? source.snippet : undefined;

  return (
    <div className="flex gap-2.5 items-start p-2.5 bg-c-card border border-[var(--c-border-sub)] rounded-xl transition-colors hover:border-[var(--c-border-act)]">
      <span className="min-w-[20px] h-5 rounded-full bg-c-accent-dim border border-[var(--c-border-act)] text-c-accent-hi text-[10px] font-semibold flex items-center justify-center shrink-0">
        {index + 1}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] text-c-accent font-medium truncate hover:underline"
          >
            {title}
          </a>
        ) : (
          <span className="text-[12.5px] text-c-text-2 font-medium">
            {title}
          </span>
        )}
        {snippet && (
          <p className="text-[11.5px] text-c-text-3 leading-snug line-clamp-2">
            {snippet}
          </p>
        )}
      </div>
    </div>
  );
};
