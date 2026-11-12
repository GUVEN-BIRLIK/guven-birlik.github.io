# GÜVEN BİRLİK

Static company website in Russian, English and Turkish. White frosted-glass theme with blue lines and accents. The hero is a glass "screen" with an interactive WebGL 3D globe and live data panels. There is no build step.

## Local preview

From this folder run `python -m http.server 4173 --directory dist`, then open http://localhost:4173. Serve the site over HTTP: the globe is an ES module and loads its texture over the network, so it does not run from `file://`.

## Deploy

Upload the contents of `dist/` to any static host. `.openai/hosting.json` records the site identity for the original hosting.

## Files

| Path | Purpose |
|---|---|
| `dist/index.html` | Markup and default Russian copy |
| `dist/style.css` | Theme tokens (white glass + blue), layout, responsive rules |
| `dist/app.js` | Translations, language switch, live panels (clocks, distances, sun chart), region selection, inquiry form |
| `dist/globe.js` | WebGL globe (three.js r160): dotted continents, country borders, live day/night terminator, atmosphere, animated routes from Istanbul |
| `dist/land-canvas.js` | Draws the land mask from `world.geojson`; used to bake the PNGs and as a runtime fallback |
| `dist/assets/land-4096.png`, `land-2048.png` | Pre-baked land mask (R = land, G = borders, B = coastal halo). Desktop loads 4096, phones load 2048 |
| `dist/assets/vendor/three.module.min.js` | three.js r160, vendored so the site does not depend on a CDN |

Drawing the 4096px land mask in the browser blocked the page for up to ~25 s on some machines, so the mask is baked ahead of time. If you change `world.geojson`, regenerate the PNGs by running `drawLandCanvas(world, 4096)` (and 2048) from `land-canvas.js` in a browser and saving the canvas as PNG.

## Content notes

- The logo is an inline SVG (a "G" drawn as a globe outline, with a spinning meridian and an orbit dot) used in the header, the footer and the intro splash. `assets/favicon.svg` is the static version. The intro splash shows once per browser session and is skipped when reduced motion is on.
- Each content section is a glass "screen" with a HUD bar, matching the hero console.
- Direction reference points (Berlin, Moscow, Dubai, Shanghai, Lagos) are set in `HUBS` in `app.js`.
- Distances, local times, business-hour overlap and the sun's position are all calculated live. No customer numbers, certifications or operating statistics are claimed.
- The routes illustrate trade directions. They are not shipment tracking.
- The inquiry form opens the visitor's email app with a prepared message to guvenbirlikicvedisticaret@gmail.com. Nothing is sent to or stored on a server.

## Assets

- Geographic data: D3 Graph Gallery world GeoJSON, https://github.com/holtzy/D3-graph-gallery/blob/master/DATA/world.geojson
- three.js: MIT licence
- Fonts: Unbounded, Manrope and JetBrains Mono via Google Fonts, with system font fallbacks
