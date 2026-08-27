import { cx } from "@/lib/utils";

/** `01 / SELECTED WORK` — the running index that ties the page together. */
export function SectionLabel({
  index,
  children,
  className,
  tone = "ink",
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <span
      className={cx(
        "t-label inline-flex items-center gap-2.5",
        tone === "ink" ? "text-muted-ink" : "text-muted",
        className,
      )}
    >
      {index ? (
        <>
          <span className={tone === "paper" ? "text-accent-soft" : "text-accent"}>
            {index}
          </span>
          <span aria-hidden="true" className="opacity-40">
            /
          </span>
        </>
      ) : null}
      <span>{children}</span>
    </span>
  );
}
