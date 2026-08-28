# Bia Zane — Personal Portfolio

A single-page, portfolio-first site for **Bia Zane**, a CMS developer working in
WordPress, Shopify and Webflow. Built to turn visitors into project enquiries.
Next.js App Router, TypeScript, Tailwind v4, Motion.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

Node 20+ recommended.

---

## Where things live

| What | Where |
|---|---|
| Contact details, wordmark, nav, budget bands | `lib/site.ts` |
| Portfolio projects | `data/projects.ts` |
| Services | `data/services.ts` |
| FAQ | `data/faq.ts` |
| Process phases | `data/process.ts` |
| Industries | `data/industries.ts` |
| Technology groups | `data/technology.ts` |
| Testimonials (intentionally empty) | `data/testimonials.ts` |
| Design tokens & type scale | `app/globals.css` |
| Motion language | `lib/motion.ts` |
| Page composition | `app/page.tsx` |
| Screenshots | `public/portfolio/` |

Each homepage section is its own component under `components/sections/`,
with the portfolio blocks in `components/portfolio/`.

---

## Adding a project

Append one object to `projects` in `data/projects.ts`:

```ts
{
  slug: "acme",
  name: "Acme Co",
  url: "https://acme.com/",
  year: "2026",
  industry: "Retail / DTC",
  services: ["UX/UI", "Development"],
  summary: "One line for the archive index.",
  description: "A short editorial paragraph for the featured block.",
  desktopImage: "/portfolio/acme-desktop.webp",
  desktopImageAlt: "Acme homepage — …",
  mobileImage: "/portfolio/acme-mobile.webp",
  tabletImage: "/portfolio/acme-tablet.webp",
  theme: "light",
  featured: false,
}
```

- `featured: false` → appears in the **archive index** only.
- `featured: true` → also renders a full cinematic block. The three featured
  layouts are hand-composed (`FeaturedOne/Two/Three`); a fourth featured project
  needs a layout choice in `app/page.tsx`.

Every portfolio surface — hero collage, featured blocks, archive, responsive
showcase, industry previews — reads from this one array.

### Replacing screenshots

Drop new files in `public/portfolio/` and point the project object at them.
Recommended: WebP, desktop `2000×1250`, tablet `1000×1333`, mobile `780×1688`.

To recapture from a live URL with Playwright:

```bash
npx playwright install chromium
# capture at 1440×900 (deviceScaleFactor 2), then convert:
npx sharp-cli -i shot.png -o public/portfolio/acme-desktop.webp resize 2000 -- webp --quality 82
```

Always write a meaningful `desktopImageAlt`.

---

## Contact form / email

The enquiry and website-review forms validate on the client **and** on the
server (`app/api/enquiry/route.ts`).

Without credentials the API returns `503` and the UI says so plainly. **It never
claims a message was sent when it wasn't**, and there is no address to fall back
to — no contact address is published anywhere in the client bundle. To enable
real delivery, copy `.env.example` to `.env.local`:

```bash
RESEND_API_KEY=re_xxx
ENQUIRY_FROM_EMAIL=website@yourverifieddomain.com   # verified sender
ENQUIRY_TO_EMAIL=you@yourdomain.com                 # required; server-side only
```

Resend is called over `fetch` — no SDK dependency. Swapping providers means
editing one `fetch` call.

---

## Analytics

Nothing loads unless the variable is set. No placeholder IDs exist anywhere.

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=0000000
```

---

## Theme colours

All tokens are in the `@theme` block at the top of `app/globals.css`:

```css
--color-ink: #0a0a0b;        /* near-black surfaces   */
--color-paper: #f3f0e9;      /* warm ivory surfaces   */
--color-accent: #3e52ff;     /* cobalt, on light      */
--color-accent-soft: #93a2ff;/* cobalt, on dark (AA)  */
--color-accent-deep: #2032cf;/* the craft-demo moment */
```

Two notes if you edit this file:

1. Element resets live inside `@layer base` and component classes inside
   `@layer components`. **Unlayered CSS outranks every Tailwind utility** — moving
   a rule out of its layer silently breaks `bg-*` / `text-*` across the site.
2. `--color-accent` only reaches 3:1 on ink. Use `--color-accent-soft` for small
   accent text on dark surfaces.

---

## Testimonials

`data/testimonials.ts` is deliberately empty. While it is, the credibility
section renders "A good partnership should feel simple." instead. Add real,
attributable, client-approved quotes and the section switches automatically.

No award, rating, metric, client logo or review count on this site is invented.

---

## Motion & accessibility

- One shared easing/duration system in `lib/motion.ts`.
- `prefers-reduced-motion` disables Lenis, parallax, magnetic buttons, marquees
  and text reveals.
- The custom cursor is desktop-and-fine-pointer only, and never replaces the
  pointer inside form fields.
- Modals trap focus, close on Escape, lock body scroll and restore focus.
- Accordions expose `aria-expanded` / `aria-controls`.

**Gotcha worth knowing:** an element whose `initial` state is a fully-collapsed
`clip-path` reports zero intersection, so `whileInView` on it never fires. The
clip must sit on a child of the observed element — see `components/motion/useReveal.ts`.

---

## Deploying to Vercel

```bash
npx vercel        # preview
npx vercel --prod
```

Or push to GitHub and import the repo. Set any env vars from `.env.example`
under **Project → Settings → Environment Variables**. Update `siteConfig.url`
in `lib/site.ts` so canonical/OpenGraph URLs point at the real domain.

---

## Replace before going live

- `NEXT_PUBLIC_SITE_URL` — unset. Until it is, `metadataBase`, the OpenGraph
  `url` and the JSON-LD `url`/`image` are omitted rather than guessed.
- `ENQUIRY_TO_EMAIL` — unset. The form returns `503` until it is set.
- `siteConfig.social.linkedin` / `instagram` / `x` — currently `#`.
- The footer **Privacy** link — currently `#`.
- Optionally add a real OG image; metadata currently points at a portfolio screenshot.

No contact address, phone number or domain is committed to this repository. If
you add one, add it through the environment, not through `lib/site.ts` — anything
in `siteConfig` ships to the browser.
