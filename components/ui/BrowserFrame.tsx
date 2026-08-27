import { cx } from "@/lib/utils";
import { prettyUrl } from "@/lib/utils";

/**
 * Minimal browser chrome. Deliberately not a glossy 3D mockup —
 * it exists to frame the screenshot, not to be looked at.
 */
export function BrowserFrame({
  url,
  children,
  className,
  bare = false,
}: {
  url?: string;
  children: React.ReactNode;
  className?: string;
  /** Drop the chrome bar entirely (used for mobile crops). */
  bare?: boolean;
}) {
  return (
    <div className={cx("frame", className)}>
      {!bare ? (
        <div className="frame-bar">
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span className="frame-url">{prettyUrl(url)}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Phone-proportioned frame for mobile screenshots. */
export function DeviceFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[18px] bg-ink-soft p-[3px] shadow-[0_28px_60px_-24px_rgba(10,10,11,0.6)] ring-1 ring-white/10",
        className,
      )}
    >
      <div className="overflow-hidden rounded-[var(--r-md)]">{children}</div>
    </div>
  );
}
