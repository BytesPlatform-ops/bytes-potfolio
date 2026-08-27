/**
 * Central content configuration.
 *
 * One person, not a company. Everything identifying her lives in `me` below —
 * change those fields and the name, role and email update everywhere: header,
 * footer, metadata, JSON-LD, form copy and the enquiry email. Nothing about
 * her identity is hard-coded in a component.
 */
export const me = {
  name: "Baneen",
  role: "Designer + Developer",
  email: "hello@baneen.design",
} as const;

export const siteConfig = {
  name: me.name,
  url: "https://baneen.design",
  tagline: "Designer + Developer",
  description:
    "I'm Baneen — a designer who codes. I build websites, products and interactive things for brands that don't want to look like everyone else.",

  /** Sits under the wordmark, in the footer and in the hero rail. */
  discipline: "designer + developer",

  email: me.email,

  responseNote: "I usually reply within a day.",
  availability: "available for selected projects",
  availabilityWindow: "Q4 '26",

  timezones: "PKT — working with clients worldwide",

  social: {
    linkedin: "#",
    instagram: "#",
    x: "#",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

/**
 * Portrait slot.
 *
 * ⚠️  `public/profile/baneen.webp` does not exist yet, and until a real
 * photograph of Baneen is dropped in, `hasPortrait` stays false and every
 * portrait position renders a designed collage placeholder instead.
 *
 * It deliberately does NOT fall back to a stock face. `guy.jpeg` in this repo
 * is a mood reference for the collage art direction only — that is a
 * photograph of a different person, and dressing it up as Baneen would
 * misrepresent two real people at once.
 */
export const portrait = {
  /**
   * Cut out of the supplied collage sheet and given a torn-paper alpha edge,
   * so she is an independent layer rather than part of a background image.
   * Three crops: `full` (seated), `bust` (head + shoulders), `frame`.
   */
  src: "/collage/portraits/baneen-full.webp",
  hasPortrait: true,
  alt: `${me.name} — ${me.role}`,
} as const;

/** Small true facts. Editable; invent nothing. */
export const personalFacts = [
  { k: "Designing from", v: "PKT" },
  { k: "Working with", v: "clients worldwide" },
  { k: "Usually in", v: "Figma + VS Code" },
] as const;

/** One line, not a section. */
export const tools = [
  "Next.js",
  "React",
  "TypeScript",
  "Motion",
  "Node",
  "Shopify",
  "WordPress",
] as const;

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
