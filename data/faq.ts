export type FaqItem = { q: string; a: string };

/** Four. If a fifth is genuinely worth asking, something else has to go. */
export const faqs: FaqItem[] = [
  {
    q: "What does a project cost?",
    a: "It depends on scope, not page count. A focused marketing site, a full redesign with a CMS, and a web app with user accounts are three very different jobs. I'll give you a fixed number after a short call — not a range that quietly doubles.",
  },
  {
    q: "How long does it take?",
    a: "Four to eight weeks for a well-defined site. Bigger builds run longer. The honest variable is rarely me — it's how fast content and feedback come back.",
  },
  {
    q: "Do you design and code?",
    a: "Both. That's the whole point of hiring me rather than two people. What you approve in design is what shows up in the browser, including the states and the motion.",
  },
  {
    q: "What happens after launch?",
    a: "Testing, analytics and a handover so you can run it yourself. After that it's your call — some people take the keys, others keep me around for the next thing.",
  },
];
