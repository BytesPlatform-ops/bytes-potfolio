"use client";

import { useCallback, useState } from "react";

export type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent" }
  /** Delivery is not configured. We say so plainly; there is no address to
      fall back to, so we never pretend the answers went anywhere. */
  | { status: "manual"; message: string }
  | { status: "error"; message: string };

export function useEnquirySubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(
    async (kind: "enquiry" | "review", data: Record<string, string>) => {
      setState({ status: "sending" });

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
            message:
              "This deployment doesn't have email delivery connected yet, so nothing was sent. Nothing has been lost either — try again once it's configured.",
          });
          return;
        }

        setState({
          status: "error",
          message:
            json.error ?? "Something went wrong on my end. Please try again.",
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
