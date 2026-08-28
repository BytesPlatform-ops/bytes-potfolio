# Profile assets

`bia-zane.webp` is the canonical portrait — the standing figure flattened onto
an opaque cream ground, used for OpenGraph, Twitter cards and anywhere an
avatar is needed. It is deliberately not transparent: several clients render
alpha as black.

The section figures live in `public/collage/portraits/`:

| file                | used by  | why                                             |
| ------------------- | -------- | ----------------------------------------------- |
| `bia-hero.webp`     | Hero     | narrowest silhouette, so it can be very tall     |
| `bia-seated.webp`   | About    | seated with the laptop — reads as working        |
| `bia-standing.webp` | Contact  | standing with laptop and bag                     |
| `bia-coffee.webp`   | —        | spare                                            |
| `bia-desk.webp`     | —        | spare                                            |

These are full-length figures, which is what lets the hero work: the head sits
in the top fifth, so a headline can cross the figure low without landing on the
face. The previous head-and-shoulders crops could not do that — the face filled
two thirds of the frame.

They arrive as clean cut-outs with their own collage already around them, so no
torn-paper edge is applied and each section keeps its own decoration light near
them.

Originals are kept out of `public/` in `profile-source/` at the repo root — the
supplied PNGs are ~2MB each and should never be served.
