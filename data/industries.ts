export type Industry = { name: string; note: string; image?: string };

/** Image crops are reused from real project screenshots — never stock. */
export const industries: Industry[] = [
  { name: "Startups", note: "First real site, investor-ready", image: "/portfolio/taleem-desktop-alt.webp" },
  { name: "Professional Services", note: "Credibility before contact", image: "/portfolio/cross-country-desktop-alt.webp" },
  { name: "Healthcare", note: "Clarity under pressure", image: "/portfolio/nonnis-desktop.webp" },
  { name: "Real Estate", note: "Listings people finish browsing", image: "/portfolio/cross-country-desktop.webp" },
  { name: "Technology", note: "Product explained in one screen", image: "/portfolio/taleem-desktop.webp" },
  { name: "Education", note: "Long content, short attention", image: "/portfolio/taleem-desktop-alt.webp" },
  { name: "E-commerce", note: "Fewer steps to checkout", image: "/portfolio/nonnis-desktop-alt.webp" },
  { name: "B2B", note: "Long cycles, clear proof", image: "/portfolio/cross-country-desktop-alt.webp" },
];
