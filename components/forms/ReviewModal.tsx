"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Modal } from "@/components/ui/Modal";
import { Field } from "./Field";
import { useEnquirySubmit, isEmail, isUrlish } from "./useEnquirySubmit";
import { siteConfig } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Arrow";

/** Compact micro-conversion — four fields, no steps. */
export function ReviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    website: "",
    name: "",
    email: "",
    challenge: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, submit, reset } = useEnquirySubmit();

  const close = () => {
    onClose();
    window.setTimeout(() => {
      setForm({ website: "", name: "", email: "", challenge: "" });
      setErrors({});
      reset();
    }, 500);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.website.trim()) err.website = "I need a URL to look at.";
    else if (!isUrlish(form.website)) err.website = "That doesn't look like a web address.";
    if (!form.name.trim()) err.name = "Required.";
    if (!form.email.trim()) err.email = "Required.";
    else if (!isEmail(form.email)) err.email = "That email doesn't look right.";
    setErrors(err);
    if (Object.keys(err).length) return;

    submit("review", {
      Website: form.website,
      name: form.name,
      email: form.email,
      "Main challenge": form.challenge,
    });
  };

  const done = state.status === "sent" || state.status === "manual";

  return (
    <Modal open={open} onClose={close} labelledBy="review-title" className="lg:py-0">
      <div className="mx-auto flex min-h-full w-full max-w-[46rem] flex-col justify-center px-[var(--gutter)] py-24">
        <button
          type="button"
          onClick={close}
          className="t-label absolute right-[var(--gutter)] top-8 flex items-center gap-2 text-muted transition-colors hover:text-paper"
        >
          Close
          <span aria-hidden="true" className="relative block h-3 w-3">
            <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>

        {!done ? (
          <>
            <span className="t-label text-accent-soft">Website review</span>
            <h2 id="review-title" className="t-section mt-6 text-paper">
              Send me the URL.
            </h2>
            <p className="t-body measure mt-6 text-muted">
              I&rsquo;ll go through it properly and write back with what
              I&rsquo;d change and why — UX, design, conversion, performance. No
              deck, no pitch call required.
            </p>

            <form onSubmit={onSubmit} className="mt-12 grid gap-8 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                label="Website URL *"
                data-autofocus
                value={form.website}
                error={errors.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="company.com"
                autoComplete="url"
              />
              <Field
                label="Name *"
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                autoComplete="name"
              />
              <Field
                label="Work email *"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@company.com"
                autoComplete="email"
              />
              <Field
                className="sm:col-span-2"
                label="What's the main problem?"
                textarea
                value={form.challenge}
                onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                placeholder="Traffic that doesn't convert, a site that looks dated, slow on mobile…"
              />

              {state.status === "error" ? (
                <p role="alert" className="t-meta text-[#FF8A7A] sm:col-span-2">
                  {state.message}
                </p>
              ) : null}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={state.status === "sending"}
                  className="group relative inline-flex h-[3.4rem] items-center gap-3 overflow-hidden rounded-full bg-paper px-8 text-[0.98rem] font-medium text-ink disabled:opacity-60"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-[420ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100"
                  />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {state.status === "sending" ? "Sending…" : "Request the review"}
                  </span>
                  <ArrowUpRight className="relative z-10 h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </button>
                <p className="t-meta mt-6 text-muted">{siteConfig.responseNote}</p>
              </div>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="t-label text-accent-soft">
              {state.status === "sent" ? "Received" : "Almost there"}
            </span>
            <h2 id="review-title" className="t-section mt-6 text-paper">
              {state.status === "sent" ? (
                <>
                  I&rsquo;ll take a <span className="serif-i">look.</span>
                </>
              ) : (
                <>
                  One more <span className="serif-i">click.</span>
                </>
              )}
            </h2>
            <p className="t-body-lg measure mt-7 text-muted">
              {state.status === "sent"
                ? `Thanks — the review is on my list. ${siteConfig.responseNote}`
                : state.message}
            </p>
            {state.status === "manual" ? (
              <a
                href={state.mailto}
                className="group mt-9 inline-flex h-[3.4rem] items-center gap-3 rounded-full bg-paper px-8 text-[0.98rem] font-medium text-ink"
              >
                Open the email
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
            <button
              type="button"
              onClick={close}
              className="t-label mt-10 block text-muted transition-colors hover:text-paper"
            >
              Close
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
