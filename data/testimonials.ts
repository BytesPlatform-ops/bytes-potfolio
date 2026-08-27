export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

/**
 * ⚠️  INTENTIONALLY EMPTY.
 *
 * No testimonial is displayed unless it is a real, attributable quote from a
 * real client who has approved its use. Do not populate this array with
 * example or placeholder content — the <Credibility /> section reads its
 * length and renders the non-testimonial variant while it is empty.
 *
 * To enable testimonials later, add objects in this shape:
 *
 *   { quote: "…", author: "…", role: "…", company: "…" }
 *
 * The section will switch to the quote layout automatically.
 */
export const testimonials: Testimonial[] = [];
