export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "How much does a website project cost?",
    a: "It depends on scope more than page count. A focused marketing site, a full redesign with a CMS, and a web application with user accounts are three very different pieces of work. The things that move the number are: how much design is custom, how many templates and content types exist, what has to integrate with what, and whether we're writing content or receiving it. We give you a fixed figure after a short scoping call — not a range that quietly doubles later.",
  },
  {
    q: "How long does a website take?",
    a: "A well-defined marketing site usually runs four to eight weeks from kickoff. Larger builds with custom functionality, complex content models or several rounds of stakeholder review run longer. The honest variable is rarely us — it's how quickly content, feedback and approvals come back. We'll tell you the dependencies up front and keep the schedule visible while we're in it.",
  },
  {
    q: "Do you only design, or do you also develop?",
    a: "Both, with the same team. Design and development happen side by side rather than one being thrown over a wall to the other. That means the thing you approve in design is the thing you get in the browser — including the states, the breakpoints and the motion, which are the parts that usually go missing in a handoff.",
  },
  {
    q: "Can you redesign an existing website?",
    a: "Yes, and it's a lot of what we do. We start by looking at what's actually working — traffic, the pages that convert, the content people read — so the redesign keeps what's earning and fixes what isn't. We can rebuild on a new stack or work within the platform you're already on if there's a good reason to stay.",
  },
  {
    q: "Can you work with our existing brand?",
    a: "Yes. If you have brand guidelines, we design inside them and extend them where the web needs more than a print system provides — interaction states, motion, responsive type. If the brand is thin or dated, we'll say so and scope the extra work separately rather than quietly redesigning your identity.",
  },
  {
    q: "What happens after launch?",
    a: "Launch day includes testing across browsers and devices, performance checks, analytics, and a handover so your team can edit what they need to edit. After that it's your call: some clients take the keys and run, others keep us on for ongoing support, iteration and new sections. Either way the site is built to be maintained and extended, not frozen.",
  },
];
