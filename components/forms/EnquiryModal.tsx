"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Modal } from "@/components/ui/Modal";
import { Field, ChoiceGrid } from "./Field";
import { useEnquirySubmit, isEmail } from "./useEnquirySubmit";
import { budgetBands, projectTypes, siteConfig } from "@/lib/site";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Arrow";
import { cx } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const STEPS = ["What you need", "Project size", "Your details"] as const;

export function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    website: "",
    details: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, submit, reset } = useEnquirySubmit();
  const reduce = useSafeReducedMotion();

  // Slide direction is part of what renders, so it lives in state.
  const [dir, setDir] = useState(1);

  const close = () => {
    onClose();
    // Let the exit animation finish before wiping the form.
    window.setTimeout(() => {
      setStep(0);
      setType("");
      setBudget("");
      setForm({ name: "", company: "", email: "", website: "", details: "" });
      setErrors({});
      reset();
    }, 500);
  };

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const validateFinal = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "We need something to call you.";
    if (!form.email.trim()) e.email = "An email address, so we can reply.";
    else if (!isEmail(form.email)) e.email = "That email doesn't look right.";
    if (!form.details.trim() || form.details.trim().length < 12)
      e.details = "A sentence or two about the project helps a lot.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFinal()) return;
    submit("enquiry", {
      "Project type": type || "Not specified",
      "Budget range": budget || "Not specified",
      name: form.name,
      company: form.company,
      email: form.email,
      website: form.website,
      details: form.details,
    });
  };

  const slide = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, x: 28 * dir },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, x: -28 * dir },
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  };

  const done = state.status === "sent" || state.status === "manual";

  return (
    <Modal open={open} onClose={close} labelledBy="enquiry-title">
      <div className="grid min-h-full grid-cols-1 lg:grid-cols-[42%_58%]">
        {/* ---------------- Left panel ---------------- */}
        <aside className="relative flex flex-col justify-between border-b border-[var(--line-ink)] px-[var(--gutter)] pb-10 pt-24 lg:border-b-0 lg:border-r lg:pb-14 lg:pt-[13vh]">
          <div>
            <span className="t-label text-muted">
              {siteConfig.wordmark.left} / {siteConfig.wordmark.right}
            </span>
            <h2
              id="enquiry-title"
              className="t-display mt-8 max-w-[13ch] text-paper"
            >
              Tell us what
              <br />
              you&rsquo;re <span className="serif-i">building.</span>
            </h2>
            <p className="t-body measure mt-7 text-muted">
              Three short steps. No sales sequence afterwards — a real person reads
              this and writes back.
            </p>
          </div>

          <div className="mt-12 hidden lg:block">
            <div className="rule rule-ink mb-6" />
            <a
              href={`mailto:${siteConfig.email}`}
              className="t-body block text-paper transition-colors hover:text-accent"
            >
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="t-body mt-1 block text-muted transition-colors hover:text-paper"
            >
              {siteConfig.phone}
            </a>
            <p className="t-meta mt-6 text-muted">{siteConfig.responseNote}</p>
          </div>
        </aside>

        {/* ---------------- Right panel ---------------- */}
        <div className="relative px-[var(--gutter)] pb-24 pt-12 lg:pt-[13vh]">
          <button
            type="button"
            onClick={close}
            className="t-label absolute right-[var(--gutter)] top-8 z-10 flex items-center gap-2 text-muted transition-colors hover:text-paper lg:top-10"
          >
            Close
            <span aria-hidden="true" className="relative block h-3 w-3">
              <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>

          {!done ? (
            <>
              {/* progress */}
              <div className="mb-12 flex items-center gap-4">
                <span className="t-label text-paper">
                  0{step + 1} <span className="text-muted">/ 03</span>
                </span>
                <div className="flex flex-1 gap-1.5">
                  {STEPS.map((s, i) => (
                    <span
                      key={s}
                      className={cx(
                        "h-px flex-1 origin-left transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
                        i <= step ? "bg-accent" : "bg-white/15",
                      )}
                    />
                  ))}
                </div>
                <span className="t-label hidden text-muted sm:block">
                  {STEPS[step]}
                </span>
              </div>

              <form onSubmit={onSubmit} className="max-w-[46rem]">
                <AnimatePresence mode="wait" initial={false}>
                  {step === 0 ? (
                    <motion.div key="s0" {...slide}>
                      <h3 className="t-sub mb-8 text-paper">What do you need?</h3>
                      <ChoiceGrid
                        legend="Project type"
                        name="project-type"
                        options={projectTypes}
                        value={type}
                        onChange={(v) => {
                          setType(v);
                          window.setTimeout(() => go(1), 200);
                        }}
                        columns={2}
                      />
                      <div className="mt-10 flex items-center gap-6">
                        <button
                          type="button"
                          onClick={() => go(1)}
                          className="group t-label flex items-center gap-2 text-paper"
                        >
                          Continue
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <span className="t-meta text-muted">or pick one above</span>
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 1 ? (
                    <motion.div key="s1" {...slide}>
                      <h3 className="t-sub mb-3 text-paper">
                        What&rsquo;s your approximate project size?
                      </h3>
                      <p className="t-meta mb-8 text-muted">
                        Rough is fine. It just tells us what scope to talk about.
                      </p>
                      <ChoiceGrid
                        legend="Budget range"
                        name="budget"
                        options={budgetBands}
                        value={budget}
                        onChange={(v) => {
                          setBudget(v);
                          window.setTimeout(() => go(2), 200);
                        }}
                        columns={2}
                      />
                      <div className="mt-10 flex items-center gap-8">
                        <button
                          type="button"
                          onClick={() => go(0)}
                          className="t-label text-muted transition-colors hover:text-paper"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => go(2)}
                          className="group t-label flex items-center gap-2 text-paper"
                        >
                          Continue
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  ) : null}

                  {step === 2 ? (
                    <motion.div key="s2" {...slide}>
                      <h3 className="t-sub mb-9 text-paper">
                        Where do we send the reply?
                      </h3>
                      <div className="grid gap-8 sm:grid-cols-2">
                        <Field
                          label="Name *"
                          data-autofocus
                          value={form.name}
                          error={errors.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Jane Doe"
                          autoComplete="name"
                        />
                        <Field
                          label="Company"
                          value={form.company}
                          onChange={(e) =>
                            setForm({ ...form, company: e.target.value })
                          }
                          placeholder="Optional"
                          autoComplete="organization"
                        />
                        <Field
                          label="Work email *"
                          type="email"
                          value={form.email}
                          error={errors.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="jane@company.com"
                          autoComplete="email"
                        />
                        <Field
                          label="Current website"
                          value={form.website}
                          onChange={(e) =>
                            setForm({ ...form, website: e.target.value })
                          }
                          placeholder="company.com"
                          autoComplete="url"
                        />
                        <Field
                          className="sm:col-span-2"
                          label="Project details *"
                          textarea
                          value={form.details}
                          error={errors.details}
                          onChange={(e) =>
                            setForm({ ...form, details: e.target.value })
                          }
                          placeholder="What are you building, and what's the deadline you're working to?"
                        />
                      </div>

                      {state.status === "error" ? (
                        <p role="alert" className="t-meta mt-6 text-[#FF8A7A]">
                          {state.message}
                        </p>
                      ) : null}

                      <div className="mt-11 flex flex-wrap items-center gap-8">
                        <button
                          type="button"
                          onClick={() => go(1)}
                          className="t-label text-muted transition-colors hover:text-paper"
                        >
                          Back
                        </button>
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
                            {state.status === "sending"
                              ? "Sending…"
                              : "Send project enquiry"}
                          </span>
                          <ArrowUpRight className="relative z-10 h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                        </button>
                      </div>

                      <p className="t-meta mt-7 text-muted">
                        {siteConfig.responseNote}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[38rem] pt-6"
            >
              <span className="t-label text-accent-soft">
                {state.status === "sent" ? "Received" : "Almost there"}
              </span>
              <h3 className="t-display mt-6 text-paper">
                {state.status === "sent" ? (
                  <>
                    Thanks — <span className="serif-i">got it.</span>
                  </>
                ) : (
                  <>
                    One more <span className="serif-i">click.</span>
                  </>
                )}
              </h3>
              <p className="t-body-lg measure mt-7 text-muted">
                {state.status === "sent"
                  ? `Your enquiry is with us. ${siteConfig.responseNote}`
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
      </div>
    </Modal>
  );
}
