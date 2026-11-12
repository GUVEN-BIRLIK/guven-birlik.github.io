/* Draws the equirectangular land mask used by the globe.
   R = land fill, G = country borders/coastline, B = blurred coastal halo.
   Normally pre-baked into assets/land-*.png (drawing 4096px at runtime blocks the page);
   this module is only loaded as a fallback if the PNG is missing. */
/** R = land fill, G = country borders/coastline, B = blurred coastal halo. Equirectangular. */
export function drawLandCanvas(world, W) {
  const H = W / 2;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);

  const rings = [];
  for (const f of world.features) {
    const geom = f.geometry; if (!geom) continue;
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
    for (const p of polys) rings.push(p);
  }
  const trace = (ctx, ring, xoff, w = W, h = H) => {
    let prev = null; let first = null; let last = null;
    ring.forEach(([lon, lat], i) => {
      if (prev !== null) { while (lon - prev > 180) lon -= 360; while (lon - prev < -180) lon += 360; }
      prev = lon;
      const x = (lon + 180) / 360 * w + xoff, y = (90 - lat) / 180 * h;
      if (i === 0) { ctx.moveTo(x, y); first = [x, lat]; } else ctx.lineTo(x, y);
      last = [x, lat];
    });
    // Polar rings (Antarctica) wrap the whole globe: close them through the pole edge.
    if (first && Math.abs(last[0] - first[0]) > w * 0.9) { const yEdge = last[1] < 0 ? h : 0; ctx.lineTo(last[0], yEdge); ctx.lineTo(first[0], yEdge); }
    ctx.closePath();
  };
  const drawAll = (ctx, w, h, mode) => {
    for (const poly of rings) {
      for (const xoff of [-w, 0, w]) {
        ctx.beginPath(); poly.forEach(r => trace(ctx, r, xoff, w, h));
        if (mode === 'fill') ctx.fill('evenodd'); else ctx.stroke();
      }
    }
  };
  g.fillStyle = 'rgb(255,0,0)'; drawAll(g, W, H, 'fill');
  g.globalCompositeOperation = 'lighter';
  g.strokeStyle = 'rgb(0,255,0)'; g.lineWidth = Math.max(1, W / 2600); g.lineJoin = 'round'; drawAll(g, W, H, 'stroke');

  // Coastal halo in blue channel
  const sw = 1024, sh = 512, s = document.createElement('canvas'); s.width = sw; s.height = sh;
  const sg = s.getContext('2d');
  sg.filter = 'blur(5px)'; sg.fillStyle = '#fff'; drawAll(sg, sw, sh, 'fill'); sg.filter = 'none';
  sg.globalCompositeOperation = 'source-in'; sg.fillStyle = 'rgb(0,0,255)'; sg.fillRect(0, 0, sw, sh);
  g.drawImage(s, 0, 0, W, H);
  g.globalCompositeOperation = 'source-over';

  return c;
}
