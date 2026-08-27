"use client";

import { useCallback, useState } from "react";
import { siteConfig } from "@/lib/site";

export type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  /** Delivery is not configured — we say so and hand over a mailto fallback. */
  | { status: "manual"; mailto: string; message: string }
  | { status: "error"; message: string };

function buildMailto(kind: string, data: Record<string, string>) {
  const subject = `${kind} — ${data.name || "Website enquiry"}`;
  const body = Object.entries(data)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function useEnquirySubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(
    async (kind: "enquiry" | "review", data: Record<string, string>) => {
      setState({ status: "sending" });
      const label = kind === "review" ? "Website review" : "Project enquiry";

      try {
        const res = await fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, data }),
        });
        const json = await res.json().catch(() => ({}));

        if (res.ok && json.delivered) {
          setState({ status: "sent" });
          return;
        }

        if (res.status === 503) {
          setState({
            status: "manual",
            mailto: buildMailto(label, data),
            message:
              "This deployment doesn't have email delivery connected yet, so nothing was sent. Your answers are ready in an email — one click and it's on its way.",
          });
          return;
        }

        setState({
          status: "error",
          message:
            json.error ?? "Something went wrong on our end. Please try again.",
        });
      } catch {
        setState({
          status: "error",
          message: "Couldn't reach the server. Check your connection and try again.",
        });
      }
    },
    [],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, reset };
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isUrlish = (v: string) =>
  /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/i.test(v.trim());
