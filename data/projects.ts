export type Project = {
  slug: string;
  name: string;
  url?: string;
  year?: string;
  industry: string;
  services: string[];
  /** One-line index summary. */
  summary: string;
  /** Longer editorial description used on featured project blocks. */
  description?: string;
  /** Two-or-three words. What the card and the viewer print under the name. */
  tag: string;
  desktopImage: string;
  desktopImageAlt?: string;
  mobileImage?: string;
  tabletImage?: string;
  /**
   * Tall full-page capture. The fullscreen viewer scrolls this so a visitor
   * reads the whole page, not just the fold. Falls back to `desktopImage`.
   */
  desktopFullImage?: string;
  /**
   * Tall full-page mobile capture. Optional — the viewer falls back to
   * `mobileImage`, so dropping one in later needs no code change.
   */
  mobileFullImage?: string;
  /** Controls the surface the project is presented on. */
  theme: "light" | "dark";
  /**
   * Brightness of the screenshot itself, measured from the capture — decides
   * whether the VIEW cursor over this project is an ivory disc with ink type
   * or the inverse. Independent of `theme`, which is about the page around it.
   */
  cursorTheme: "light" | "dark";
  featured: boolean;
};

/**
 * Single source of truth for every portfolio surface on the page:
 * hero collage, featured project blocks, project index, responsive showcase.
 *
 * To add a project: append one object here and drop its screenshots into
 * /public/portfolio. Set `featured: true` for a full cinematic block,
 * `featured: false` to appear only in the archive index.
 */
export const projects: Project[] = [
  {
    slug: "nonnis-placement",
    name: "Nonnis Placement",
    url: "https://nonnisplacement.com/",
    year: "2026",
    industry: "Healthcare / Senior Care",
    services: ["Strategy", "UX/UI", "Development"],
    tag: "Healthcare Website",
    summary: "RN-led senior care placement across Washington State.",
    description:
      "Families arrive here in the middle of a hard week. The site had to feel calm and certain — warm typography, one obvious next step on every screen, and a matching flow that reads clearly whether you're a family, a hospital, or a provider.",
    desktopImage: "/portfolio/nonnis-desktop.webp",
    desktopImageAlt:
      "Nonnis Placement homepage — warm dark hero with 'Real care, matched to real needs' headline and a care-match interface panel",
    mobileImage: "/portfolio/nonnis-mobile.webp",
    tabletImage: "/portfolio/nonnis-tablet.webp",
    desktopFullImage: "/portfolio/nonnis-desktop-full.webp",
    theme: "dark",
    cursorTheme: "dark",
    featured: true,
  },
  {
    slug: "cross-country-asset-recovery",
    name: "Cross Country Asset Recovery",
    url: "https://croscountry.netlify.app/",
    year: "2026",
    industry: "Logistics / Asset Recovery",
    services: ["Art Direction", "Web Design", "Development"],
    tag: "Logistics Platform",
    summary: "Cross-state recovery, transport and remarketing for lenders.",
    description:
      "An industry that usually settles for stock photography and a phone number. I went cinematic instead — full-bleed field imagery, serif headlines with weight behind them, and a recovery request that never sits more than one scroll away.",
    desktopImage: "/portfolio/cross-country-desktop.webp",
    desktopImageAlt:
      "Cross Country Asset Recovery homepage — full-bleed photograph of heavy equipment on a transport trailer with the headline 'Recovering Value. Restoring Control.'",
    mobileImage: "/portfolio/cross-country-mobile.webp",
    tabletImage: "/portfolio/cross-country-tablet.webp",
    desktopFullImage: "/portfolio/cross-country-desktop-full.webp",
    theme: "dark",
    cursorTheme: "dark",
    featured: true,
  },
  {
    slug: "taleem",
    name: "Taleem Network",
    url: "https://taleem-online.netlify.app/",
    year: "2026",
    industry: "Education / Non-profit",
    services: ["UX/UI", "Design System", "Development"],
    tag: "Education Network",
    summary: "Connecting universities, industry and policy in Pakistan.",
    description:
      "A network with a lot to say and a broad audience to say it to. The answer was restraint: a disciplined editorial grid, one accent colour doing all the emphasis, and long-form content that stays readable at every width.",
    desktopImage: "/portfolio/taleem-desktop.webp",
    desktopImageAlt:
      "Taleem Network homepage — light editorial layout with the headline 'Building a stronger higher education system, and a stronger future for Pakistan.'",
    mobileImage: "/portfolio/taleem-mobile.webp",
    tabletImage: "/portfolio/taleem-tablet.webp",
    desktopFullImage: "/portfolio/taleem-desktop-full.webp",
    theme: "light",
    cursorTheme: "light",
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/**
 * The archive index below the featured work.
 * Only renders projects that actually exist in `projects` — no placeholder clients.
 */
export const indexProjects = projects;

/** Used by the responsive-craft section. */
export const responsiveShowcase =
  projects.find((p) => p.slug === "nonnis-placement") ?? projects[0];

/* ==========================================================================
   SHOWCASE VIEW MODEL

   The flat shape the hero orbit and the fullscreen viewer consume. It exists
   so those two components never have to know about editorial fields they
   don't render (`description`, `services`, `theme`, …).

   `orbitProjects` is derived from `projects` above — the single source of
   truth. Add a project there and it appears in the carousel automatically.

   Screenshots live in /public/portfolio. A missing capture is not an error:
   `hasShot: false` swaps the frame for the "preview unavailable" panel and
   the live-site link keeps working.
   ========================================================================== */

export type PortfolioProject = {
  slug: string;
  name: string;
  url: string;
  desktopImage: string;
  mobileImage?: string;
  /** Tall full-page capture, scrollable inside the fullscreen viewer. */
  fullImage?: string;
  featured: boolean;
  category?: string;
  /** Screenshot brightness — picks the VIEW cursor's contrast. */
  cursorTheme?: "light" | "dark";
  /** Shown beside the name in the archive and the viewer's top bar. */
  year?: string;
  /** False when there is no desktop capture — renders the graceful fallback. */
  hasShot?: boolean;
  hasMobileShot?: boolean;
};

/** Adapt an editorial `Project` into the flat shape the showcase surfaces use. */
export function toPortfolioProject(p: Project): PortfolioProject {
  return {
    slug: p.slug,
    name: p.name,
    url: p.url ?? "",
    category: p.tag,
    desktopImage: p.desktopImage,
    mobileImage: p.mobileFullImage ?? p.mobileImage,
    fullImage: p.desktopFullImage ?? p.desktopImage,
    featured: p.featured,
    cursorTheme: p.cursorTheme,
    hasShot: Boolean(p.desktopImage),
    hasMobileShot: Boolean(p.mobileFullImage ?? p.mobileImage),
  };
}

/**
 * What the hero carousel rotates through. Featured work leads; everything
 * else queues behind it in source order. Nothing is hidden.
 */
export const orbitProjects: PortfolioProject[] = [
  ...projects.filter((p) => p.featured),
  ...projects.filter((p) => !p.featured),
].map(toPortfolioProject);
