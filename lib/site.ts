/**
 * Central content configuration.
 *
 * One person, not a company. Everything identifying her lives in `me` below —
 * change those fields and the name and role update everywhere: header, footer,
 * metadata, JSON-LD and form copy. Nothing about her identity is hard-coded in
 * a component.
 *
 * There is deliberately no address or domain here. See `siteUrl` below.
 *
 * She goes by the short form everywhere, so `name` and `brand` are the same
 * name — `brand` is only its all-caps setting, which the header lockup and the
 * modal eyebrow want. Everything else — About, footer, SEO title, OpenGraph,
 * Person schema — reads `name`.
 */
export const me = {
  /** How she is named everywhere: introductions, metadata, structured data. */
  name: "Bia Z.",
  /** The same name, set in caps for the header lockup. Not a second name. */
  brand: "BIA Z.",
  role: "CMS Developer",
  /** The three platforms the practice is actually built on. */
  platforms: ["WordPress", "Shopify", "Webflow"],
} as const;

/**
 * Canonical origin — deliberately unset.
 *
 * No domain is claimed for this site yet, and inventing one would put a false
 * address into the canonical tag, OpenGraph and structured data, where search
 * engines read it as fact. Everything that needs an absolute URL checks this
 * first and omits the field when it is null, so the metadata stays honest and
 * simply says less. Set `NEXT_PUBLIC_SITE_URL` at deploy time to restore it.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;

/** "CMS Developer · WordPress · Shopify · Webflow" — the positioning line. */
export const positioning = `${me.role} · ${me.platforms.join(" · ")}`;

export const siteConfig = {
  name: me.name,
  brand: me.brand,
  tagline: positioning,
  description:
    "I'm Bia Z. — a CMS developer building high-performance WordPress, Shopify and Webflow sites. Figma to CMS, theme and template customisation, and the integrations that make it all actually work.",

  /** Sits under the wordmark, in the footer and in the hero rail. */
  discipline: "CMS developer",

  /* No public address. The enquiry form is the only way in, and it posts to
     whatever `ENQUIRY_TO_EMAIL` names on the server — the inbox is never
     shipped to the browser. */

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
 * Three supplied full-length figures, one per section, so she is never the
 * same picture twice on one page. They are cut-outs with their own collage
 * around them and sit on their own layer above the page's paper.
 *
 * `/profile/bia-z.webp` is the flattened version on an opaque cream ground
 * for OpenGraph and avatars, where transparency renders as black in several
 * clients.
 */
export const portrait = {
  src: "/profile/bia-z.webp",
  hasPortrait: true,
  alt: `${me.name} — ${me.role}`,
} as const;

/** Small true facts. Editable; invent nothing. */
export const personalFacts = [
  { k: "Building from", v: "PKT" },
  { k: "Working with", v: "clients worldwide" },
  { k: "Usually in", v: "Figma + VS Code" },
] as const;

/**
 * Hero sticker. Unpacks the one subjective word in the headline into three
 * things that are actually measurable, so "personality" reads as a way of
 * working rather than a mood. Her own vocabulary — nothing added.
 */
export const personalityKeywords = ["fast", "responsive", "conversion-focused"] as const;

/**
 * About — the specialisation list, straight from the Upwork profile.
 * Rendered as a scannable two-column list rather than a run-on sentence.
 * Editable, but invent nothing: these are the services actually offered.
 */
export const specialties = [
  "Custom development",
  "Theme customization",
  "Figma to WordPress",
  "Figma to Shopify",
  "Figma to Webflow",
  "Elementor Pro",
  "DIVI",
  "AVADA",
  "Liquid",
  "CRO",
  "Replit AI Apps",
  "Custom integrations",
] as const;

/** One line, not a section. Ordered by what actually fills the week. */
export const tools = [
  "WordPress",
  "Shopify",
  "Webflow",
  "Elementor",
  "Liquid",
  "Figma",
  "PHP",
] as const;

/** Budget bands shown in the enquiry modal. Purely UI copy — edit freely. */
export const budgetBands = [
  "Under $2k",
  "$2k – $5k",
  "$5k – $10k",
  "$10k+",
  "Not sure yet",
] as const;

export const projectTypes = [
  "WordPress Site",
  "Shopify Store",
  "Webflow Site",
  "Figma to CMS",
  "Redesign / Migration",
  "Something Else",
] as const;
