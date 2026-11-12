---
name: GÜVEN BİRLİK
description: An Istanbul trading house drawn as the compass chronometer of its own logo.
colors:
  lume: "#4d94ff"
  lume-hot: "#8fbcff"
  action-blue: "#2160dc"
  action-blue-top: "#3a7ff2"
  action-blue-deep: "#1747b4"
  steel-bright: "#f1f4f9"
  steel-mid: "#c3cbd8"
  steel-shadow: "#8a95a8"
  abyss-ground: "#00021c"
  dial-centre: "#112453"
  dial-field: "#0a1738"
  dial-rim: "#061029"
  instrument-well: "#050d24"
  ink-text: "#e9eef7"
  ink-secondary: "#b9c4d8"
  ink-muted: "#8d9cbb"
  ink-dim: "#7788ad"
  hairline: "rgba(143, 188, 255, .13)"
  hairline-strong: "rgba(143, 188, 255, .26)"
  lit-white: "#ffffff"
  fault-red: "#ff7a8a"
typography:
  display:
    fontFamily: "Unbounded, Manrope, Arial, sans-serif"
    fontSize: "clamp(26px, 2.5vw, 44px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: ".025em"
  headline:
    fontFamily: "Unbounded, Manrope, Arial, sans-serif"
    fontSize: "clamp(22px, 2.15vw, 38px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: ".025em"
  title:
    fontFamily: "Unbounded, Manrope, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    letterSpacing: "-.02em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: ".18em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: ".08em"
    fontFeature: "tnum"
  segment:
    fontFamily: "DSEG7, JetBrains Mono, monospace"
    fontSize: "18px"
    fontWeight: 700
    letterSpacing: ".04em"
rounded:
  none: "0px"
  dial: "50%"
spacing:
  hair: "8px"
  tight: "14px"
  grid: "20px"
  panel: "26px"
  section: "44px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.lit-white}"
    rounded: "{rounded.none}"
    padding: "16px 22px"
    typography: "{typography.body}"
  button-text-link:
    textColor: "{colors.steel-bright}"
    padding: "0"
  panel-bezel:
    backgroundColor: "{colors.dial-field}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
  panel-head:
    textColor: "{colors.steel-mid}"
    typography: "{typography.label}"
    padding: "13px 18px 15px"
  input-field:
    backgroundColor: "{colors.instrument-well}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.none}"
    padding: "13px 14px"
  language-switch-active:
    textColor: "{colors.lit-white}"
    typography: "{typography.mono}"
    padding: "5px 8px"
  readout-segment:
    textColor: "{colors.lume-hot}"
    typography: "{typography.segment}"
---

# Design System: GÜVEN BİRLİK

## Overview

**Creative North Star: "The Compass Chronometer"**

The site is the compass dial from the client's logo, enlarged into a working instrument. A deep navy dial ground carries a blue lume glow and a fine guilloché sunburst centred above the fold. Every panel is a brushed-steel octagonal bezel around a navy dial face. Headings are cut in chrome. Indices, ticks, pins and active states glow in luminous blue. Istanbul is the centre pin, and every number on screen is a real reading: a bearing, a distance, a local time, a sun position.

The system is dark-only (`color-scheme: dark`) and dense like an instrument face. Hairline rules, minute tracks and tick rings divide space instead of whitespace slabs. Lit marks are always drawn over their unlit counterparts. Seven-segment digits sit over a ghost 88:88 layer, and the minute tracks draw lit ticks over faint ones. Motion is physical and mechanical. The compass needle behaves like the card of a liquid-filled compass: it swings onto the course, overshoots, and settles in a few decaying swings. Readouts step to their new value instead of gliding. Everything else eases out exponentially and stops.

The world is pinned by binding brand assets, not by taste: the emblem rasters `assets/emblem-176.png` and `assets/emblem-320.png`, cut from the client logo; the logo reel `assets/brand/logo-reel.mp4` with its poster; and the DSEG7 Classic Bold seven-segment face (`assets/fonts/DSEG7Classic-Bold.woff2`, OFL, licence shipped alongside).

**Key Characteristics:**
- Navy dial ground with one central lume glow and a conic guilloché sunburst.
- Octagonal steel bezels (CSS clip-path chamfer, steel gradient rim, navy dial in `::before`) on every panel.
- Chrome gradient lettering on the wordmark, h1, h2 and intro word only.
- Luminous blue for indices, ticks, pins, active states and the single primary action.
- Unlit layers drawn under lit ones: ghost seven-segment digits, faint minute ticks.
- One signature motion: the needle as a damped spring that swings, overshoots and settles.

## Colors

A cold, two-material palette: navy dial and polished steel, lit by one blue lume.

### Primary
- **Lume Blue** (`lume`): the luminous index colour. Use it for pins, needle hub, seconds hands, nav underlines, active route bars, rules beside the İSTANBUL · TÜRKİYE line, and the left inset edge of active list rows. It almost always carries its own glow.
- **Hot Lume** (`lume-hot`): the brighter lume for text-scale marks. Use it for major dial ticks, active indices and codes, icons inside links, minute-track ticks and focus outlines.
- **Action Blue** (`action-blue`, lit from `action-blue-top` down to `action-blue-deep`): the single primary action fill ("start cooperation", "prepare inquiry"). It also fills the active globe label plate and the skip link.

### Secondary
- **Polished Steel** (`steel-bright`, `steel-mid`, `steel-shadow`): bezel rims, h3 titles, panel-head labels, clock hands, compass tail and the engraved marquee text. The rim itself is a seven-stop 135° steel gradient (#eef2f7 to #5d687c and back) with a 1px/3px brushed stripe over it.

### Neutral
- **Abyss Ground** (`abyss-ground`): the page and the logo reel's backdrop. Nothing sits on it unframed except the header, the brand reel and the trade strip.
- **Dial Navy** (`dial-centre` to `dial-field` to `dial-rim`): the radial face painted inside every bezel, lit at top centre.
- **Instrument Well** (`instrument-well`): recessed input fields, with an inner shadow.
- **Ink** (`ink-text`, `ink-secondary`, `ink-muted`, `ink-dim`): text in four steps. The primary text is a cool off-white. Use `ink-dim` for indices, codes and UTC offsets, and never for running copy.
- **Hairline** (`hairline`, `hairline-strong`): blue-tinted 1px rules between rows and under panel heads, and borders for chips and ghost controls.
- **Lit White** (`lit-white`): text and needle tips in the lit or active state only. It is never a surface.
- **Fault Red** (`fault-red`): invalid-field border and ring. This is its only role.

### Named Rules
**The One Lume Rule.** Blue is the only hue that glows. Glow (`text-shadow` / `drop-shadow` / `box-shadow` in lume RGB) belongs to lume-coloured marks and lit readouts. Steel and ink never glow.

**The No Flat White Rule.** There are no white or light surfaces anywhere. White appears only as lit text, needle tips and chrome highlights.

## Typography

**Display Font:** Unbounded (fallback Manrope, Arial)
**Body Font:** Manrope (fallback Arial)
**Label/Mono Font:** JetBrains Mono for data; DSEG7 Classic Bold for live seven-segment readouts

**Character:** Unbounded is wide and extended, set in caps and cut in chrome like the logo's wordmark. Manrope is a quiet grotesk for reading. Mono and seven-segment carry the instrument's numbers, always with tabular figures.

### Hierarchy
- **Display** (Unbounded 800, clamp(26px, 2.5vw, 44px), 1.2, caps, .025em): the hero h1, with its second line on its own row.
- **Headline** (Unbounded 800, clamp(22px, 2.15vw, 38px), 1.2, caps, .025em, `text-wrap: balance`): section h2. The contact h2 runs slightly larger, at clamp(24px, 2.4vw, 40px). On mobile it is clamp(21px, 6.4vw, 28px).
- **Title** (Unbounded 600, 17px for pillars, 18px for steps, 20px for the form, 23px for solutions, -.02em, flat `steel-bright`): card and panel titles.
- **Body** (Manrope 400, 15px/1.7; section copy 1.75 to 1.85): copy in `ink-secondary`, measure capped at 40 to 54ch.
- **Label** (Manrope 700, 10.5px to 11px, .14em to .2em, uppercase): panel heads, bar titles, readout terms and form labels.
- **Mono** (JetBrains Mono 500, 10px to 11px, .08em to .1em, tabular): indices, codes, coordinates, km, UTC offsets and the address.
- **Segment** (DSEG7 700, 12px meta / 15px clocks / 18px readouts, `#dbe9ff` with lume text-shadow): live clocks, the course and local time.

### Named Rules
**The Chrome Lettering Rule.** The chrome gradient (white to #dfe5ee to #8a95a8 to #f3f6fa to #b6bfcd, top to bottom, with a 1px dark drop) is the logo's wordmark and is used on the wordmark, h1, h2 and intro word only. It repeats per line (`background-size: 100% 1.2em; repeat-y`), so every line of a multi-line heading reads as its own chrome bar. Titles below h2 are flat steel.

**The Unlit Segment Rule.** Every seven-segment readout carries its ghost (`data-ghost="88:88"`, `888`, `88:88:88`) at 10% lume behind the lit digits. A segment readout without its unlit layer is wrong.

## Layout

The page has a single max width of 1480px. The gutter is `max(5vw, (100vw - 1480px) / 2)` and drops to 14px under 760px. The hero is one large bezel ("console") with a three-column instrument grid: copy (.92fr), globe stage (1.5fr) and side instruments (.78fr). Below it sits a three-column data row of distance chart, day chart and chronometer sub-dials. Each later section is its own large bezel ("screen"), opened by a bar carrying a steel bar-mark and a ruler track. It is padded 46px 44px 50px, or 28px 18px 32px on mobile.

Rhythm: 20px grid gaps, 14px stacked gaps, 22px to 26px panel padding, 40px from heading to content. Breakpoints are 1280 (side instruments drop below the globe), 1100 (sub-dials go six across, pillars go three across), 980 (the nav becomes a full-screen menu and single-column sections) and 760 (the bottom data row becomes a horizontal snap scroller of 88% panels). Small breakpoints never stack the hero instruments into tiny duplicates. The globe stays a full-width stage.

## Elevation & Depth

Depth is material, not floating. Bezels have no outer shadow. Their depth comes from the steel rim's light and dark gradient stops against the darker dial inside, and from the dial's radial lighting at the top. Recesses (inputs) carry an inner shadow. Shadows are otherwise glow: lume light around lit marks, plus one dark drop under the compass.

### Shadow Vocabulary
- **Lume pin** (`box-shadow: 0 0 8px var(--lume)` to `0 0 12px`): pins, markers, active route bars, rules.
- **Lume text** (`text-shadow: 0 0 10px rgba(77,148,255,.75)`): lit seven-segment digits and the blue İSTANBUL · TÜRKİYE line.
- **Emblem halo** (`filter: drop-shadow(0 6px 14px rgba(29,86,220,.55))`): the header emblem at rest.
- **Chrome drop** (`filter: drop-shadow(0 1px 0 rgba(0,0,0,.6))`): under chrome lettering.
- **Instrument drop** (`filter: drop-shadow(0 10px 22px rgba(0,0,0,.55))`): the compass instrument only.
- **Well** (`inset 0 2px 8px rgba(0,0,0,.45)`): input recess. On focus it adds a `0 0 0 3px rgba(77,148,255,.22)` ring.
- **Floor line** (`0 0 14px 2px rgba(77,148,255,.8), 0 0 60px 12px rgba(29,86,220,.35)`): the glossy floor under the hero console, echoing the logo's reflection.

### Named Rules
**The Glow Is Light Rule.** A shadow in this system is either light emitted by lume or a material recess. Hard offset shadows have no place in this world.

## Shapes

The octagon is the system's silhouette, taken from the emblem's frame. Panels, buttons, index plates, globe controls, bar-marks, step nodes, the back-to-top plate and marquee marks are all clipped to a chamfered octagon (`clip-path` polygon with corner size `--c`): 30px on the console and screens (18px on mobile), 22px on the footer, 14px on panels, 9px on buttons and pillar indices, and 3px to 7px on small marks. Rims are drawn by insetting the navy dial 1.5px to 2.5px inside the steel fill.

Circles are reserved for dials: the compass, sub-dials, the globe, pins, satellites and lume dots. Rows, inputs and chips are square-cornered (0 radius). The brand reel container keeps the 14px radius it was delivered with. That radius is an exception for the reel and is not a shape to reuse.

**The CSS Bezel Rule.** Bezels are drawn in CSS: a steel gradient rim with a brushed stripe, a clip-path chamfer, and the navy dial painted in `::before`. They are not a raster brushed-steel 9-slice cut from the emblem. This is a user-accepted deviation: the user was offered "frames from the logo's steel" and declined it. The emblem raster appears only as the emblem itself.

**The Octagon Bezel Rule.** Anything that frames content is an octagon with a steel rim. Nothing gets a rounded-rectangle frame.

## Components

### Buttons
- **Shape:** octagon chamfer (9px).
- **Primary:** a vertically lit action-blue fill (#3a7ff2 to #2160dc to #1747b4), white 700 13.5px text, 16px 22px padding, a 1px inner top highlight, and an arrow icon pushed to the far end.
- **Hover / Active:** `brightness(1.12)` on fine pointers. Press scales to .97 over 160ms ease-out. Focus is a 2px hot-lume outline offset 3px.
- **Text link:** steel-bright 700 13.5px with a hot-lume arrow that nudges 2px up and right on hover, and a lume underline.
- **Ghost (header CTA, copy button):** a hairline-strong 1px frame that turns lume on hover with a 12% lume wash.

### Chips (language switch)
- **Style:** a mono 600 11px trio inside a hairline-strong 1px frame.
- **State:** the active button gets a 20% lume wash, white text and a 1.5px lume underline inset. Inactive buttons are muted.

### Cards / Containers
- **Corner Style:** octagon bezel (14px chamfer, 1.5px rim).
- **Background:** dial navy radial with a faint guilloché ring pattern, inside the steel rim.
- **Shadow Strategy:** none outside. See Elevation & Depth.
- **Border:** the rim is the border. Internal divisions are hairlines.
- **Internal Padding:** 20px to 26px.
- **Panel head:** a label-type title with a mono code at the right, a hairline under it, and a 96px minute track of lit ticks (1px every 8px) at its left foot.
- **Accepted card grids:** the About A/B/C pillars (octagon index plates), the three Solutions cards (isometric line illustrations of crates, containers and rings in lume line, lifting 5px on hover) and the three Process step cards (outlined numerals hanging from a lit rail) remain bezel cards. This is a user-accepted deviation from the direction's refusal of icon cards: the user was offered "cards to instrument scales" and declined it. Card grids may appear only as bezel cards in this form.

### Inputs / Fields
- **Style:** an instrument-well fill, a 1px hairline border at 22% lume, 0 radius, an inset recess shadow, Manrope 14.5px (16px on mobile). Selects use a hot-lume chevron drawn in CSS.
- **Focus:** the border turns lume and a 3px lume ring appears at 22%.
- **Error:** a fault-red border with an 18% ring. Status text is #ff9aa6.

### Navigation
- **Style:** Manrope 600 13.5px in `ink-secondary`. Hover and current states turn white, and a 1.5px glowing lume underline sweeps in from the left over 350ms.
- **Header:** transparent until scrolled. It then becomes 88% abyss with a 14px blur and a hairline bottom edge.
- **Mobile (≤980px):** a full-screen 98% abyss sheet with Unbounded 600 24px steel links divided by hairlines. The toggle is two steel bars that cross.

### Logo Lockup (signature)
The emblem (52px, or 42px on mobile) sits left of a chrome Unbounded 700 19px wordmark over a blue Manrope 700 9px İSTANBUL · TÜRKİYE line set between two glowing 16px rules. On hover the emblem turns 45°. The lockup runs one 7 s light pass, taken from the close of the logo reel: a glint crosses the steel bezel, an anamorphic flare stretches off its right edge, then a blue-white band passes through the chrome letters.

### Bearing Compass and Readouts (signature)
The compass has a steel rim, a navy face, faint minor ticks and hot-lume majors, a 35% lume rose and mono cardinals. The needle is a damped spring run in JavaScript (stiffness 38, damping 4.3, so a damping ratio of about 0.35 and a swing period of about 1 s). It takes the shortest way round to the new course, overshoots by about 30% of the turn, and settles in a couple of decaying swings, like a liquid-filled compass. Scrolling the page adds an angular kick proportional to the scroll delta (1.6°/s per px, capped at ±160°/s), so the needle jolts when the instrument moves. A faint sway made of two summed sines (at most about ±1.4°) keeps it alive at rest. The spring runs only while the compass is on screen and the tab is visible, and under reduced motion the needle snaps straight to the course. This is the system's signature motion and the only place it is used. The `--ease-settle` curve (`cubic-bezier(0.34, 1.42, 0.5, 1)`) is still declared in the stylesheet but no longer drives anything. Readouts below it step: they drop in from -55%, overshoot 8%, then land, over 340ms. They never count or glide.

### Chronometer Sub-dials
50px dials with a steel rim, minor and hour ticks, steel hour and minute hands, a lume seconds hand and pin, and a seven-segment time beside them. The active city's rim lights hot-lume.

### Brand Reel
The delivered logo reel plays muted and looped, its edges dissolved by a mask into the abyss panel, over a glossy floor and a mirrored, blurred İSTANBUL · TÜRKİYE tag.

## Do's and Don'ts

### Do:
- **Do** frame every content panel in the octagon steel bezel: chamfer 14px for panels, 30px for screens, and a 1.5px to 2.5px rim painted around the navy dial.
- **Do** set h1, h2 and the wordmark in Unbounded caps with the chrome gradient repeated per line. Set titles below h2 in flat steel-bright.
- **Do** keep lume as the only glowing hue, and give lit marks their unlit counterpart (ghost 88:88 digits, faint minor ticks).
- **Do** use JetBrains Mono or DSEG7 with tabular figures for every number, code and coordinate.
- **Do** move pointers as a damped spring (an underdamped ratio of about 0.35, with a period of about 1 s) that overshoots and settles, pause it off screen, and snap it under reduced motion. Step readouts. Use `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`) for everything else, and collapse all motion under `prefers-reduced-motion`.
- **Do** draw icons as 16px stroked SVG symbols (1.6 stroke, round caps) in `currentColor`, usually hot-lume.

### Don't:
- **Don't** place a white or light surface anywhere. White is only for lit text and highlights.
- **Don't** frame content in rounded rectangles. The reel's 14px radius is a delivered exception and is not a pattern.
- **Don't** apply the chrome gradient to body copy, labels, titles below h2 or numerals.
- **Don't** let readouts glide or count up. They step, and only the needle overshoots.
- **Don't** add a second accent hue. Fault red exists only for invalid fields.
- **Don't** put an unframed card grid on the dial. Card grids are allowed only as the accepted bezel cards.
