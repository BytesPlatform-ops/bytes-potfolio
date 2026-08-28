export type Service = {
  id: string;
  number: string;
  title: string;
  blurb: string;
  points: string[];
};

/**
 * What the practice actually sells.
 *
 * Rewritten around CMS work. The previous set read like a general studio
 * menu — UI/UX, web applications, creative development — which described a
 * different job to the one being done here. These six are the things a
 * WordPress, Shopify and Webflow developer is genuinely hired for.
 */
export const services: Service[] = [
  {
    id: "wordpress",
    number: "01",
    title: "WordPress Development",
    blurb:
      "Custom themes and builder work that stays fast. Elementor Pro, DIVI and AVADA when the team needs to edit it themselves, hand-built templates when the design deserves better than a widget.",
    points: ["Custom themes", "Elementor Pro", "DIVI / AVADA", "Speed & Core Web Vitals"],
  },
  {
    id: "shopify",
    number: "02",
    title: "Shopify Development",
    blurb:
      "Storefronts designed around the purchase, not the homepage. Liquid theme work, clear product pages, honest merchandising, and a checkout that doesn't lose people halfway through.",
    points: ["Liquid themes", "Product pages", "App integration", "Checkout UX"],
  },
  {
    id: "webflow",
    number: "03",
    title: "Webflow Development",
    blurb:
      "Pixel-accurate builds with a CMS your marketing team can run without opening a ticket. Clean class structure, real interactions, and collections set up so content scales.",
    points: ["Webflow CMS", "Interactions", "Responsive builds", "Client handover"],
  },
  {
    id: "figma-to-cms",
    number: "04",
    title: "Figma to CMS",
    blurb:
      "A design file turned into a working, editable site — WordPress, Shopify or Webflow. What you approved in Figma is what ships, including the states, the breakpoints and the empty cases.",
    points: ["Figma to WordPress", "Figma to Shopify", "Figma to Webflow", "Design QA"],
  },
  {
    id: "redesign-migration",
    number: "05",
    title: "Redesign & Migration",
    blurb:
      "Moving a site onto a platform that fits it, without losing the traffic you already have. Redirects mapped, structure kept, content brought across intact.",
    points: ["Replatforming", "Redirect mapping", "Content migration", "SEO continuity"],
  },
  {
    id: "cro-integrations",
    number: "06",
    title: "CRO & Integrations",
    blurb:
      "The work after launch that decides whether the site pays for itself. Conversion-focused changes backed by analytics, plus the custom integrations that connect it to everything else you run.",
    points: ["Conversion optimisation", "Analytics", "Custom integrations", "AI apps"],
  },
];
