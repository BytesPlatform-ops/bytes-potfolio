export type Phase = {
  number: string;
  title: string;
  blurb: string;
  deliverables: string[];
};

/** Five verbs. Nothing here should sound like project management. */
export const phases: Phase[] = [
  {
    number: "01",
    title: "Talk",
    blurb:
      "You tell me what you're building and what's getting in the way. I ask a lot of questions before anyone opens a design tool.",
    deliverables: ["A call", "Real questions", "Scope", "A fixed number"],
  },
  {
    number: "02",
    title: "Think",
    blurb:
      "I work out the structure, the priorities and the direction — while it's all still cheap to change.",
    deliverables: ["Sitemap", "Wireframes", "Direction", "Content plan"],
  },
  {
    number: "03",
    title: "Design",
    blurb:
      "We make it look like itself, not like another template. Real layouts, real content, every width.",
    deliverables: ["Key screens", "Full set", "Responsive", "Design system"],
  },
  {
    number: "04",
    title: "Build",
    blurb:
      "I turn the design into the actual product. Motion where it helps, none where it doesn't.",
    deliverables: ["Frontend", "CMS", "Motion", "QA"],
  },
  {
    number: "05",
    title: "Ship",
    blurb:
      "Test, polish, launch. Then a handover so you can run it yourself.",
    deliverables: ["Testing", "Analytics", "Deploy", "Handover"],
  },
];
