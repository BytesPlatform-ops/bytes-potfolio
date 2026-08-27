export type TechGroup = { label: string; items: string[] };

export const techGroups: TechGroup[] = [
  { label: "Frontend", items: ["Next.js", "React", "TypeScript"] },
  { label: "Styling", items: ["Tailwind", "CSS", "Motion"] },
  { label: "Backend", items: ["Node.js", "APIs", "Databases"] },
  { label: "CMS & Commerce", items: ["WordPress", "Shopify", "Headless CMS"] },
  { label: "Infrastructure", items: ["Vercel", "Cloud", "CI/CD"] },
];
