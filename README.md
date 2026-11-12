# GÜVEN BİRLİK

Responsive, buildless company website in Russian, English and Turkish.

## Local preview

From this folder run `python -m http.server 4173 --directory dist`, then open http://localhost:4173. Serve over HTTP because the globe loads its local geographic data with `fetch`.

## Features

- Interactive spherical 3D globe with two-axis drag rotation, touch support, two-finger zoom, zoom buttons, pause, reset and keyboard controls.
- Animated great-circle route illustrations from Istanbul. Region buttons update the highlighted route.
- Language selection is remembered in the visitor's browser.
- Inquiry form prepares an email to guvenbirlikicvedisticaret@gmail.com in the visitor's email application. It does not send or store submissions on a server.
- Responsive layout, keyboard focus states and reduced-motion support.

## Files

`dist/index.html`, `dist/style.css`, `dist/app.js` and `dist/assets/` form the complete deployable site. No build step or dependencies are needed. Site identity is recorded in `.openai/hosting.json`.

## Assets

Port photograph: Unsplash, https://images.unsplash.com/photo-1578575437130-527eed3abbec

Geographic outline data: D3 Graph Gallery world GeoJSON, https://github.com/holtzy/D3-graph-gallery/blob/master/DATA/world.geojson

Fonts: Manrope and Space Grotesk via Google Fonts. The page falls back to system fonts if Google Fonts is unavailable.

The globe and trade routes are visual illustrations, not shipment tracking or a statement of active routes. No customer numbers, certifications or operating statistics are asserted.
