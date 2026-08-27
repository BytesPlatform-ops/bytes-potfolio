/**
 * Central content configuration.
 * Replace the values here to update contact details across the entire site.
 */
export const siteConfig = {
  name: "Bytes Platform",
  wordmark: { left: "BYTES", right: "PLATFORM" },
  url: "https://bytesplatform.com",
  tagline: "Web Design & Development Studio",
  description:
    "Bytes Platform is an independent design and development studio. We build custom websites, web applications and digital products — from strategy through to launch.",

  // --- Contact ------------------------------------------------------------
  email: "hello@bytesplatform.com",
  // NOTE: demo/placeholder number — replace with the real studio line.
  phone: "+1 (646) 555-0182",
  phoneHref: "+16465550182",

  // Editable copy, not an operational guarantee.
  responseNote: "Response usually within one business day.",
  availability: "Available for selected projects",
  availabilityWindow: "Q3 / Q4 2026",

  timezones: "PKT / EST",

  social: {
    linkedin: "#",
    instagram: "#",
    x: "#",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
  ],
} as const;

/** Budget bands shown in the enquiry modal. Purely UI copy — edit freely. */
export const budgetBands = [
  "Under $5k",
  "$5k – $10k",
  "$10k – $25k",
  "$25k+",
  "Not sure yet",
] as const;

export const projectTypes = [
  "New Website",
  "Website Redesign",
  "Web Application",
  "E-commerce",
  "UI/UX",
  "Something Else",
] as const;
