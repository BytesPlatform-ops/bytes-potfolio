export type FaqItem = { q: string; a: string };

/** Four. If a fifth is genuinely worth asking, something else has to go. */
export const faqs: FaqItem[] = [
  {
    q: "What does a project cost?",
    a: "It depends on scope, not page count. A Shopify theme customisation, a full WordPress rebuild and a Figma-to-Webflow build are three very different jobs. I'll give you a fixed number after a short call — not a range that quietly doubles.",
  },
  {
    q: "How long does it take?",
    a: "Two to six weeks for a well-defined site on WordPress, Shopify or Webflow. Migrations and larger builds run longer. The honest variable is rarely me — it's how fast content and feedback come back.",
  },
  {
    q: "Which platform should I be on?",
    a: "Whichever one you can still run in a year. Webflow if marketing needs to move fast, WordPress if you need plugins and control, Shopify if you're selling. I'll tell you when the one you asked for is the wrong fit.",
  },
  {
    q: "What happens after launch?",
    a: "Testing, analytics and a handover so your team can edit it without me. After that it's your call — some people take the keys, others keep me around for the next thing.",
  },
];
