# Pilot Rent a Car — design brief

## Design read
For a family or a couple who just cleared customs at Antalya Airport at 23:40 with
luggage and a tired child, and needs to know — before they book, from their phone,
in a language they trust — that a car will actually be waiting. The register is
calm competence, not showroom swagger.

## Concept spine
**The handover.** Not "we rent cars" but "the moment the key changes hands."
The whole page is one continuous approach toward that moment: the site starts far
away on a dark coastal road and closes on a key in a palm. Every section below the
journey is something the visitor needs settled *before* that moment can happen —
price, class, terms, route, contact.

## Delivery tier
`cinema` — Lenis + GSAP bridge, Tier-1 scroll-scrub hero, scroll chapters.

## Animation mode
Animation mode: animated-website

### Journey shape
`single-shot` — one subject seen ever closer. The story is a single approach to a
single car; there is no second world to travel to. One ~15s continuous take.

### Journey
Four chapters read over one film:

1. **kicker `GECE 23:40`** — "Uçak indi. Araç çoktan burada." — the car waiting on
   a dark coastal overlook, headlights on. Tags: `7/24 karşılama`, `Havalimanında teslim`
2. **kicker `FİLO`** — "Ekonomiden ticariye, on yedi araç." — camera arcs, the body
   line reads. Tags: `17 araç`, `Tam kasko`
3. **(no kicker)** — "Belek'ten Kaş'a, D400 sizin." — closer, wheel and road.
   Tags: `Sınırsız km`
4. **kicker `TESLİM`** — "Anahtar elinizde. Gerisi tatil." — the closing beauty
   state, key at the door. Tags: `Depozitosuz seçenek`

The journey enacts the spine literally: the scroll *is* the approach, and the
visitor arrives at the handover by having pulled themselves toward it.

### World grammar (byte-identical preamble, every generated frame)
Cinematic automotive photography at night, Turkish Mediterranean coast. Near-black
sky; wet dark asphalt with soft specular reflection; the sea a low, dark,
near-featureless horizon band. Neutral cool ambient with warm sodium practicals and
a low red glow from the tail lights bleeding onto the wet ground. Anamorphic 40mm,
controlled shallow depth of field, locked exposure and white balance, minimal motion
blur, fine film grain. Muted and desaturated except the red accents. Background stays
dark, seamless and low-detail so body copy survives over it. Only cars the client
actually rents are modelled, and each keeps its own manufacturer badge visible and
accurate. No readable plate numbers, no on-screen text, no watermarks, no lens flare.

Camera: ONE unbroken slow arc that closes distance — wide establishing on the
overlook, orbiting right while pushing in, settling tight three-quarter front.
Constant speed, ease only at the very first and last beat. START (wide, cold, car
distant) ≠ END (tight, warm cabin glow, key at the handle).

### Mobile framing
The car stays inside the centre-safe 60% for the whole arc — the desktop crop loses
only sky and asphalt at the edges. Mobile encode capped at 720p height.

### Delivery budget
≤32 MiB all desktop clips, ≤16 MiB all mobile clips.

## Locked palette
The client's real mark — supplied as a photograph of their printed card — is a
red arrow on black: `#E5302B` on near-black. That accent is fixed by the brand
and overrides the default palette bans.

| Token | Hex | Role |
|---|---|---|
| `--pilot-abyss` | `#060E17` | deepest surface, section wells |
| `--pilot-night` | `#0A1622` | page ground — a blue-shifted charcoal, never pure black |
| `--pilot-slate` | `#16283A` | raised cards, table rules |
| `--pilot-sky` | `#3CAAE6` | THE brand accent, from the logo |
| `--pilot-deep` | `#1A7FBD` | pressed/active state of the accent |
| `--pilot-travertine` | `#E8DCC8` | warm secondary — Antalya limestone, the counterweight |
| `--pilot-ink` | `#F4F7FA` | primary text |
| `--pilot-muted` | `#90A4B6` | secondary text |

Defence: the ban on "near-black + neon blue" is what a generic AI site does; this
escapes it by refusing pure black (the ground is a *blue* charcoal lifted to
`#0A1622`) and by carrying a warm travertine second colour that does real work —
rules, numerals, the price column, the closing plate. The blue is never a glow; it
is edge light and one filled CTA.

## Locked type
- **Display — Archivo**, 700/800, tracking `-0.03em`. Justification: a grotesque
  with signage lineage; it holds shape at 96px+ where Inter goes limp, and it reads
  as road furniture, which is the subject.
- **Body — Inter**, 400/500.
- **Numerals / spec labels — Archivo**, 500, `+0.14em`, uppercase. Prices and
  specs are the thing this audience actually scans.

No serif anywhere — nothing here is editorial or heritage.

## Section plan
Eyebrow budget: 3 (8 sections).

| # | Section | Layout family |
|---|---|---|
| 1 | Journey (scroll-scrub) | full-bleed cinematic |
| 2 | Rezervasyon bar | instrument panel — inset, dense, dark |
| 3 | Filo, sınıfa göre | horizontal class rail + spec table |
| 4 | Neden Pilot | asymmetric split, image left / claims right |
| 5 | Nereye gidersiniz | editorial place plates, offset grid |
| 6 | Üç adımda | numbered horizontal timeline |
| 7 | Sık sorulanlar | accordion list |
| 8 | İletişim | full-bleed closing plate + contact card |

No two consecutive sections share a family; 7 distinct families across 8 sections.

## Asset plan
- Film: 1× ~15s single-shot, 1080p 16:9, audio off → desktop + mobile encodes +
  exact-frame posters from the encoded clips.
- 4× fleet class plates shot as the real cars: Fiat Egea, Dacia Lodgy, Renault Clio, Fiat Fiorino.
- 3× place & service plates: airport handover, Belek pine road, cabin detail.
- 1× OG / launch cover, 3:2.
- Logo: the client's arrow wordmark, redrawn as vector from their printed card.
- Icons: hand-authored inline SVG, 1.5px stroke, square cap — sharper at UI sizes
  than any raster set and they inherit the accent token.

## CTA inventory
Every CTA is its own component with its own interaction identity. No shared button
utility class anywhere.

| CTA | Garment | Interaction identity |
|---|---|---|
| `WhatsApp'tan yaz` | filled sky capsule | a headlight sweep crosses it left→right on hover |
| `Fiyat al` (booking submit) | solid slab, travertine keyline | presses 1px down and the keyline tightens |
| `Kirala` (fleet card) | ghost outline | fills from the bottom edge, arrow slides right |
| `Hemen ara` | bare text | underline draws in from the left |
| nav `Rezervasyon` | small pill, live dot | the dot pulses; pill border brightens |
