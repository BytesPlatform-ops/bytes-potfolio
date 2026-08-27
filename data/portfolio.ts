import type { PortfolioProject } from "./projects";

/* ==========================================================================
   THE PORTFOLIO — one dataset, every surface.

   Twenty-five live websites. The hero orbit, Selected Work, the archive, the
   responsive showcase, the industry previews and the fullscreen viewer all
   read from this file and nothing else. Adding a project here puts it on the
   whole page; there is no second list to keep in step.

   Screenshots live in /public/portfolio as `<slug>-desktop.webp`,
   `<slug>-mobile.webp` and `<slug>-desktop-full.webp` (the tall capture the
   viewer scrolls). Captured at a 1440px desktop viewport and a 390px phone,
   with consent, region and newsletter overlays dismissed before the shutter.
   ========================================================================== */

/**
 * Screenshots whose measured mean luma sits below mid-grey. Drives the VIEW
 * cursor's contrast — a dark capture gets an ink disc with ivory type, a light
 * one gets the inverse — and the caption colour when a shot runs full-bleed.
 */
const DARK_SHOTS = new Set([
  "dala",
  "fable-and-mane",
  "flowers-for-society",
  "jan-jansen",
  "joris-bijdendijk",
  "kinfield",
  "lusion",
  "moooi",
  "pocket-worlds",
  "sikrits",
  "spark-digital-panda",
  "star-atlas",
  "starforest",
  "terminal-industries",
]);

const project = (
  slug: string,
  name: string,
  url: string,
  category: string,
  year: string,
  featured = false,
): PortfolioProject => ({
  slug,
  name,
  url,
  category,
  year,
  featured,
  cursorTheme: DARK_SHOTS.has(slug) ? "dark" : "light",
  desktopImage: `/portfolio/${slug}-desktop.webp`,
  mobileImage: `/portfolio/${slug}-mobile.webp`,
  fullImage: `/portfolio/${slug}-desktop-full.webp`,
  hasShot: true,
  hasMobileShot: true,
});

export const portfolioProjects: PortfolioProject[] = [
  project("cuberto", "Cuberto", "https://cuberto.com/", "Interactive Digital Experience", "2026", true),
  project("lusion", "Lusion", "https://lusion.co/", "Creative / Interactive", "2026", true),
  project("dala", "Dala", "https://dala.craftedbygc.com/", "Brand Experience", "2026", true),
  project("hatom", "Hatom", "https://www.hatom.com/", "Financial Protocol", "2026"),
  project("sikrits", "Sikrits", "https://www.sikrits.com/", "Fragrance Commerce", "2025"),
  project("star-atlas", "Star Atlas", "https://staratlas.com/", "Game Universe", "2026", true),
  project("flowers-for-society", "Flowers for Society", "https://flowersforsociety.com/", "Footwear Brand", "2025", true),
  project("spark-digital-panda", "Spark", "https://spark.thedigitalpanda.com/", "Creative Campaign", "2025"),
  project("terminal-industries", "Terminal Industries", "https://terminal-industries.com/", "AI + Logistics", "2026", true),
  project("pocket-worlds", "Pocket Worlds", "https://www.pocketworlds.com/", "Social Platform", "2025"),
  project("bunsa-studio", "Bunsa Studio", "https://bunsa.studio/", "Design Studio", "2025"),
  project("true-design", "True Design", "https://www.truedesign.it/en/", "Furniture Design", "2025"),
  project("fable-and-mane", "Fable & Mane", "https://fableandmane.com/", "Haircare E-commerce", "2025"),
  project("kinfield", "Kinfield", "https://kinfield.com/", "Outdoor Personal Care", "2024"),
  project("m-fisher", "M. Fisher", "https://mfisher.com/", "Fashion Retail", "2025"),
  project("jan-jansen", "Jan Jansen", "https://en.janjansen.com/", "Footwear Design", "2025"),
  project("etq-amsterdam", "ETQ Amsterdam", "https://www.etq-amsterdam.com/", "Minimal Footwear", "2025"),
  project("heimplanet", "Heimplanet", "https://en.heimplanet.com/", "Outdoor Equipment", "2025"),
  project("starforest", "Starforest", "https://www.starforest.rocks/", "Creative Studio", "2025"),
  project("joris-bijdendijk", "Joris Bijdendijk", "https://www.jorisbijdendijk.nl/", "Restaurant Group", "2025"),
  project("jacques-marie-mage", "Jacques Marie Mage", "https://www.jacquesmariemage.com/", "Luxury Eyewear", "2026"),
  project("moooi", "Moooi", "https://www.moooi.com/us/", "Design & Interiors", "2026", true),
  project("oatly", "Oatly", "https://www.oatly.com/", "Food & Beverage", "2025"),
  project("eleken", "Eleken", "https://www.eleken.co/", "Product Design / UI-UX", "2025"),
  project("eight-sleep", "Eight Sleep", "https://www.eightsleep.com/", "Sleep Technology", "2026", true),
];

const bySlug = (slug: string) => portfolioProjects.find((p) => p.slug === slug);

/** Small helper so sections can pull a specific project without a find(). */
export function pick(...slugs: string[]): PortfolioProject[] {
  return slugs
    .map(bySlug)
    .filter((p): p is PortfolioProject => Boolean(p));
}

/** The eight carried in depth by Selected Work. */
export const featuredPortfolio = pick(
  "cuberto",
  "lusion",
  "dala",
  "star-atlas",
  "terminal-industries",
  "flowers-for-society",
  "moooi",
  "eight-sleep",
);

/**
 * Running order for the hero orbit.
 *
 * The strongest lead, because the first revolution decides whether anyone
 * stays; the rest queue behind them in source order. All twenty-five stay in
 * rotation — nothing is dropped, it just waits its turn.
 */
const LEAD = [
  "cuberto",
  "lusion",
  "dala",
  "hatom",
  "star-atlas",
  "terminal-industries",
  "moooi",
  "pocket-worlds",
  "flowers-for-society",
  "sikrits",
];

export const orbitProjects: PortfolioProject[] = [
  ...pick(...LEAD),
  ...portfolioProjects.filter((p) => !LEAD.includes(p.slug)),
];
