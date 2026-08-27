"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/utils";

type Base = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function Field({
  label,
  error,
  hint,
  className,
  textarea,
  ...rest
}: Base & { textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const errId = `${id}-err`;

  const shared = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: cx(
      "w-full bg-transparent pb-3 pt-2 text-[1.02rem] text-paper outline-none",
      "placeholder:text-white/25",
      textarea ? "min-h-[110px] resize-none" : "",
    ),
  };

  return (
    <div className={cx("relative", className)}>
      <label htmlFor={id} className="t-label block text-muted">
        {label}
      </label>

      {textarea ? (
        <textarea
          {...shared}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input {...shared} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}

      {/* animated focus rule */}
      <span className="absolute bottom-0 left-0 h-px w-full bg-white/15" aria-hidden="true" />
      <span
        aria-hidden="true"
        className={cx(
          "absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          focused ? "scale-x-100" : "scale-x-0",
        )}
      />

      {error ? (
        <p id={errId} role="alert" className="t-meta mt-2 text-[#FF8A7A]">
          {error}
        </p>
      ) : hint ? (
        <p className="t-meta mt-2 text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function ChoiceGrid({
  name,
  options,
  value,
  onChange,
  columns = 2,
  legend,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
  legend: string;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="sr-only">{legend}</legend>
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <label
              key={opt}
              className={cx(
                "group relative flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-4 transition-colors duration-300",
                active
                  ? "border-accent bg-accent/12 text-paper"
                  : "border-white/12 text-paper/70 hover:border-white/30 hover:text-paper",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={active}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              <span className="text-[0.95rem] tracking-[-0.01em]">{opt}</span>
              <span
                aria-hidden="true"
                className={cx(
                  "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                  active ? "bg-accent" : "bg-white/20 group-hover:bg-white/40",
                )}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
