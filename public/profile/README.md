# Portrait slot

Drop Baneen's photograph here as:

    public/profile/baneen.webp

Then set `portrait.hasPortrait = true` in `lib/site.ts`. Nothing else needs
to change — the hero, About and Contact compositions all read from that one
flag and swap the placeholder for the real image in place.

Until then every portrait position renders a designed collage frame (grid,
halftone, registration corners, initial). That is deliberate.

## About guy.jpeg

`guy.jpeg` in the repo root is a **mood reference only** — it sets the
editorial-collage art direction: torn paper, engineering grid, pencil
scribble, halftone, red paper objects. It is a photograph of someone else and
must never be shown as Baneen. It is also a watermarked stock comp, so it is
not licensed for display either way.

## Recommended source image

- waist-up or head-and-shoulders, facing camera or slightly angled
- background removed or cleanly maskable — the composition sits her on top of
  vector collage, so a busy studio backdrop fights it
- warm neutral grade to sit with the cream palette
- ~1200×1600, exported as WebP
