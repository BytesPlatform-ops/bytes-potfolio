import type { Project } from "@/data/projects";
import { cx } from "@/lib/utils";

export function ProjectMeta({
  project,
  tone = "ink",
  className,
  layout = "row",
}: {
  project: Project;
  tone?: "ink" | "paper";
  className?: string;
  layout?: "row" | "stack";
}) {
  const label = tone === "paper" ? "text-muted" : "text-muted-ink";
  const value = tone === "paper" ? "text-paper" : "text-ink";

  const cells = [
    { k: "Industry", v: project.industry },
    { k: "Services", v: project.services.join(" · ") },
    ...(project.year ? [{ k: "Year", v: project.year }] : []),
  ];

  return (
    <dl
      className={cx(
        layout === "row"
          ? "grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3"
          : "flex flex-col gap-6",
        className,
      )}
    >
      {cells.map((c) => (
        <div key={c.k}>
          <dt className={cx("t-label mb-2.5", label)}>{c.k}</dt>
          <dd className={cx("text-[0.98rem] leading-snug tracking-[-0.015em]", value)}>
            {c.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
