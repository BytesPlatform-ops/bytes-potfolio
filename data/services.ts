export type Service = {
  id: string;
  number: string;
  title: string;
  blurb: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "website-design",
    number: "01",
    title: "Website Design",
    blurb:
      "Custom design built around what your business actually needs the site to do. Every screen has a job — usually getting the right person to the right next step without thinking about it.",
    points: ["Art direction", "Marketing sites", "Landing pages", "Redesigns"],
  },
  {
    id: "web-development",
    number: "02",
    title: "Web Development",
    blurb:
      "Production front-end and full-stack work. Clean markup, real responsiveness, fast loads, and code the next developer can read without an archaeology dig.",
    points: ["Next.js / React", "CMS integration", "APIs", "Performance"],
  },
  {
    id: "ui-ux",
    number: "03",
    title: "UI/UX Design",
    blurb:
      "Products, dashboards, portals and internal tools. We map the flows first, then design the screens — so the interface follows the work instead of fighting it.",
    points: ["User flows", "Design systems", "Dashboards", "Prototypes"],
  },
  {
    id: "ecommerce",
    number: "04",
    title: "E-commerce",
    blurb:
      "Storefronts designed around the purchase, not the homepage. Clear product pages, honest merchandising, and a checkout that doesn't lose people halfway through.",
    points: ["Shopify", "Headless commerce", "Product pages", "Checkout UX"],
  },
  {
    id: "web-applications",
    number: "05",
    title: "Web Applications",
    blurb:
      "Custom tools, SaaS products and business platforms. From the first sketch of the data model through to the interface your team opens every morning.",
    points: ["SaaS products", "Client portals", "Internal tools", "Integrations"],
  },
  {
    id: "creative-development",
    number: "06",
    title: "Creative Development",
    blurb:
      "Motion, interaction and the front-end work that makes a site feel built rather than assembled. Used where it earns attention — not everywhere at once.",
    points: ["Scroll sequences", "Interaction design", "WebGL / Canvas", "Micro-detail"],
  },
];
