# The Rest Is Accountancy brand system

One coded design system for two brands:

- **The Rest Is Accountancy**: club, membership and community. The parent brand. Black and white, quiet, exact. `data-brand="club"` (the default).
- **Stick to Accounting**: media and podcast. Newsprint and night, tape yellow as the light, black-and-white photos and marker. Headlines in condensed capitals. `data-brand="podcast"`.

There is no grey. Hierarchy comes from size and weight. The club draws its structure in ink rules. The podcast draws none: fields sit edge to edge and separate by fill and space, and the only lines left are ledger lines, tinted pencil rather than neutral. Controls keep a 1px edge.

```bash
pnpm install
pnpm dev       # the brand guide at http://localhost:4173
pnpm test      # compiles, then runs every check with node:test
```

## React

```tsx
import { ClubLogo, PodcastLogo } from "@therestisaccountancy/brand/logo"

<ClubLogo title="The Rest Is Accountancy" size={160} />
<ClubLogo variant="mono" />                       // draws in currentColor
<PodcastLogo layout="tagline" title="Stick to Accounting" />
<PodcastLogo variant="reversed" />                // on black
<PodcastLogo variant="mono" color="#A8180F" />    // one colour; "Podcast Show" cut out of the tape
```

| Prop | Values | Default |
| --- | --- | --- |
| `layout` (podcast only) | `"lockup"` · `"tagline"` · `"wordmark"` | `"lockup"` |
| `variant` | `"color"` · `"reversed"` · `"mono"` | `"color"` |
| `color` (mono only) | any CSS colour | `currentColor` |
| `size` | the width; height follows the artwork | intrinsic |
| `title` | accessible name; without it the logo is decorative (`aria-hidden`) | none |

Any other `<svg>` prop passes through. The types reject a `color` on a non-mono logo, a `layout` on the club logo, and an unknown layout or variant. `type-tests/logo.ts` holds that contract.

The root entry is React-free:

```ts
import { colors, themes, themeVariables, logoAssets } from "@therestisaccountancy/brand"

colors.tape                  // "#F7D52A"
themes.podcast.bg            // ["#F7D52A", "#000000"], as [light, dark]
`var(${themeVariables.onAccent})`  // "var(--on-accent)"
logoAssets                   // every logo file with brand, layout, variant, aspect and PNG size
```

## CSS

```html
<link rel="stylesheet" href="css/brand.css">
<section class="ground" data-brand="podcast">
  <span class="tape">Ep. 44</span>
  <h1 class="title">Who signs off <span class="mark">the AI audit</span>?</h1>
  <a class="btn" href="/listen">Listen now</a>
</section>
```

`brand.css` is the only stylesheet a page needs. It loads `fonts.css` (self-hosted) and `tokens.css`.

`data-brand` sets the brand for everything inside an element. It sets no background: `body` takes the brand's ground, and `.ground` gives it to any other element. Every per-brand difference is a custom property, so brands nest either way.

Semantic variables: `--bg`, `--surface`, `--ink`, `--accent`, `--on-accent`, `--mark`, `--on-mark`, `--alert`. Each resolves per brand and per light or dark mode. Raw colours are `--color-*`, for artwork that must not follow the theme.

Every class in `brand.css` is shown working in the guide.

## Logos

The React components are the single source. `pnpm build:logos` renders them into the files below, and a test fails if a file differs from its component by one byte. `assets/logos/catalog.json` lists every file with its brand, layout, variant, aspect ratio, byte size and PNG size.

| File | What |
| --- | --- |
| `tria-wordmark-{color,reversed,mono}.svg` | The Rest Is Accountancy |
| `sta-lockup-{color,reversed,mono}.svg` | Tape label and wordmark |
| `sta-tagline-{color,reversed,mono}.svg` | Lockup with "Death, Taxes and Ai." |
| `sta-wordmark-{color,reversed,mono}.svg` | Wordmark only, for where the tape won't fit |
| `png/*.png` | 2000px-wide transparent PNG of every non-mono file |

`mono` draws in `currentColor`; in the podcast mono files, "Podcast Show" is cut out of the tape. Every SVG is tight-cropped plain paths with a `viewBox`, no fixed size and an accessible name.

The geometry (`src/logo/geometry.ts`) comes from the designer's files. Illustrator wraps the artwork in `source/sta-artwork.ai` in masks, filters and bitmap textures; `scripts/extract-logos.py` follows those back to the original vector paths. The result matches the original render at 99.95% pixel overlap. The tape's photographic crinkle is dropped: the tape is a flat `#F7D52A` shape.

## Broadcast kit

`pnpm dev`, then open `http://localhost:4173/broadcast/`. The control room drives `broadcast/overlay.html`, a transparent 1920 × 1080 page for a browser source.

- **One state.** View, layout, segment, headline, hosts, guest, clock label, sponsor, ticker and countdown travel in the overlay's URL hash. A copied URL is a complete frame.
- **Lower third.** Three rows, 240px: strip, headline, ticker. The headline is always paper. The strip carries the segment: night by default, tape for News, redline for a Correction. The logo rises above the strip on a torn paper edge.
- **Layouts.** 1-up, 2-up full, 2-up, 3-up and blank, from the `LAYOUTS` table in `broadcast/state.js`.
- **Countdown and stinger.** The countdown cuts to the show at zero. Three strips of tape cover each change of view or layout.
- **Card.** 1080 × 1350, drawn on a canvas from the same state. Download PNG saves it.
- **Going to air.** Buttons reach every overlay open in the same browser at once. Typed text shows in the preview and goes to air when you leave the field.

A browser source in OBS runs in its own browser, so it does not follow the control room: paste a new URL to change it. This has not been tested in OBS.

## Files

| Path | What |
| --- | --- |
| `tokens/tokens.json` | Source of truth: colours, type, space, strokes, angles, motion, per-brand roles and settings, and the contrast contract |
| `css/tokens.css`, `src/generated/tokens.ts` | Generated from the JSON |
| `css/brand.css` | Type, graphic devices and components |
| `css/fonts.css`, `assets/fonts/` | Geist Serif, Geist Mono, Geist Pixel, Anton, Gochi Hand and Instrument Sans, latin and latin-ext |
| `src/logo/` | `ClubLogo`, `PodcastLogo`, the `logoAssets` manifest and the extracted geometry |
| `dist/` | Compiled ES modules and `.d.ts` files (built by `pnpm build`) |
| `index.html`, `guide/` | The brand guide. Not part of the package. Every artboard has a PNG button that saves it at its real pixel size (the podcast cover saves as a 3000px JPEG). |
| `guide/photos/` | The hosts' own shoots, downscaled and set in black and white, for the guide's social and merch examples. Not part of the package. Hosts are named as the designer's files label them. |
| `broadcast/` | The broadcast kit: control room, overlay and card. Not part of the package. |
| `llms.txt` | The rules and file map for AI agents |
| `source/` | The designer's artwork |
| `tests/`, `type-tests/` | Checks on tokens, components, logos, fonts, package exports, the guide and the public types |

## Commands

```bash
pnpm build:tokens    # after editing tokens/tokens.json (fails on a contrast breach)
pnpm extract:logos   # after the designer sends new artwork (needs poppler)
pnpm build:logos     # render the SVG files and PNGs from the components (PNGs need librsvg)
pnpm fonts           # re-download the fonts (Google Fonts, and the geist npm package for Geist Serif)
```

## Where the values come from

- Ink `#231F20` and tape `#F7D52A` were read from the fills in `source/sta-artwork.ai`.
- Highlighter `#F4DD6C` comes from the Canva banner.
- Newsprint `#F2EFE8` is the designer's paper texture, warmed so it reads as paper, not grey. Pencil `#E2D9BE` and `#3B3422` are the podcast's ledger lines on newsprint and night.
- Redline `#A8180F` is new to this system, dark enough to read on tape yellow (5.2:1). On dark grounds it lifts to `#FF6A5C`.
- Both wordmarks are outlined artwork, and their original typefaces are not in the files. Geist Serif (club display), Anton (podcast display), Gochi Hand, Instrument Sans, Geist Mono (code) and Geist Pixel (podcast timecodes) are open-licence companions, not the logo fonts.
- The designer's guide sets its headlines in heavy condensed capitals, outlined, so the PDF names no font. Anton is the closest open-licence match.
- Logo design by Kavindu Sooriya Design; copyright transferred to The Rest Is Accountancy on 6 January 2024.

## Cover images

Covers follow one system, the working paper: a halftone cut-out of one object, taped into a ledger with one strip of tape and ticked once in redline. `pnpm cover <topic>` prints the image-model prompt. The system, the evidence for each topic and the checks are in [imagery/README.md](imagery/README.md), and the reference covers are in `assets/covers/`.
