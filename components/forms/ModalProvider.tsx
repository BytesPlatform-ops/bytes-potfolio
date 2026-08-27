"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EnquiryModal } from "./EnquiryModal";
import { ReviewModal } from "./ReviewModal";

type ModalKind = "enquiry" | "review" | null;

type Api = {
  open: ModalKind;
  openEnquiry: () => void;
  openReview: () => void;
  close: () => void;
};

const Ctx = createContext<Api | null>(null);

export function useModals() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModals must be used inside <ModalProvider>");
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<ModalKind>(null);

  const openEnquiry = useCallback(() => setOpen("enquiry"), []);
  const openReview = useCallback(() => setOpen("review"), []);
  const close = useCallback(() => setOpen(null), []);

  const api = useMemo(
    () => ({ open, openEnquiry, openReview, close }),
    [open, openEnquiry, openReview, close],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <EnquiryModal open={open === "enquiry"} onClose={close} />
      <ReviewModal open={open === "review"} onClose={close} />
    </Ctx.Provider>
  );
}
