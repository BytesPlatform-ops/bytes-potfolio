export type Phase = {
  number: string;
  title: string;
  blurb: string;
  deliverables: string[];
  /** The handwritten aside pinned near this step. Keep them short and dry. */
  note: string;
};

/** Five verbs. Nothing here should sound like project management. */
export const phases: Phase[] = [
  {
    number: "01",
    title: "Talk",
    blurb:
      "You tell me what you're building and what's getting in the way. I ask a lot of questions before anyone opens a design tool.",
    deliverables: ["A call", "Real questions", "Scope", "A fixed number"],
    note: "usually over coffee",
  },
  {
    number: "02",
    title: "Think",
    blurb:
      "I work out the structure, the priorities and the direction — while it's all still cheap to change.",
    deliverables: ["Sitemap", "Wireframes", "Direction", "Content plan"],
    note: "the messy part",
  },
  {
    number: "03",
    title: "Design",
    blurb:
      "We make it look like itself, not like another template. Real layouts, real content, every width.",
    deliverables: ["Key screens", "Full set", "Responsive", "Design system"],
    note: "no lorem ipsum",
  },
  {
    number: "04",
    title: "Build",
    blurb:
      "I turn the design into the actual thing. Clean structure, CMS setup, motion where it helps, and the small details that make the site feel finished.",
    deliverables: ["Frontend", "CMS", "Motion", "QA"],
    note: "where it gets real",
  },
  {
    number: "05",
    title: "Ship",
    blurb:
      "Test, polish, launch. Then a handover so you can run it yourself without filing a ticket.",
    deliverables: ["Testing", "Analytics", "Deploy", "Handover"],
    note: "and it's live",
  },
];
