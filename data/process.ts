export type Phase = {
  number: string;
  title: string;
  blurb: string;
  deliverables: string[];
};

export const phases: Phase[] = [
  {
    number: "01",
    title: "Discovery",
    blurb:
      "We learn the business before we open a design tool. Who buys, what they compare you against, where the current site loses them, and what success actually looks like six months from now.",
    deliverables: ["Stakeholder interviews", "Competitor review", "Audience & positioning", "Requirements"],
  },
  {
    number: "02",
    title: "Direction",
    blurb:
      "Structure first, then art direction. We agree on what goes where and why, and settle the visual language — typography, colour, imagery, tone — before anything gets expensive to change.",
    deliverables: ["Sitemap & IA", "Wireframes", "Creative direction", "Content plan"],
  },
  {
    number: "03",
    title: "Design",
    blurb:
      "High-fidelity screens across desktop, tablet and mobile — including the states nobody remembers to design. You review real layouts with real content, not a mood board.",
    deliverables: ["Key page design", "Full template set", "Responsive layouts", "Design system"],
  },
  {
    number: "04",
    title: "Build",
    blurb:
      "Front-end, back-end, CMS and integrations. Motion is added where it supports hierarchy. Everything is reviewed on a staging URL you can open any time you want.",
    deliverables: ["Development", "CMS & integrations", "Motion & interaction", "QA"],
  },
  {
    number: "05",
    title: "Launch",
    blurb:
      "Cross-browser and cross-device testing, performance and accessibility passes, analytics, deployment, and a handover session so your team can run the site without calling us first.",
    deliverables: ["Testing & optimisation", "Analytics & SEO", "Deployment", "Handover & training"],
  },
];
