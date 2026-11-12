/* GÜVEN BİRLİK — WebGL 3D globe (three.js r160, vendored).
   Dotted continents + glowing borders from world.geojson, live day/night terminator,
   atmosphere, animated great-circle arcs from Istanbul, HTML labels. */
import * as THREE from './assets/vendor/three.module.min.js';

const GB = window.GB;
const stage = document.getElementById('globe-stage');
const canvas = document.getElementById('globe');
const labelsEl = document.getElementById('globe-labels');
const loadingEl = document.getElementById('globe-loading');
const RAD = Math.PI / 180;
const RED = new THREE.Color('#1a56f0');
const reduced = GB.reducedMotion;
const small = matchMedia('(max-width: 760px)').matches;

const toVec = ([lon, lat], r = 1) => new THREE.Vector3(
  Math.cos(lat * RAD) * Math.sin(lon * RAD) * r, Math.sin(lat * RAD) * r, Math.cos(lat * RAD) * Math.cos(lon * RAD) * r);
const toLonLat = v => { const n = v.clone().normalize(); return [Math.atan2(n.x, n.z) / RAD, Math.asin(n.y) / RAD]; };
const wrap = d => ((d + 540) % 360) - 180;

function failGracefully(reason) {
  console.warn('[globe]', reason);
  stage.classList.add('globe-failed');
  loadingEl?.remove();
}

/* ---------- Textures ---------- */
function glowTexture(size = 128, inner = 'rgba(26,86,240,1)', mid = 'rgba(26,86,240,.35)', outer = 'rgba(26,86,240,0)') {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner); grd.addColorStop(0.22, mid); grd.addColorStop(1, outer);
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}

/** Land mask: pre-baked PNG (fast, decoded off the main thread); runtime drawing only as fallback. */
async function loadLandTexture(W, maxAniso) {
  let tex;
  try {
    tex = await new THREE.TextureLoader().loadAsync(`assets/land-${W}.png`);
  } catch {
    const [{ drawLandCanvas }, world] = await Promise.all([
      import('./land-canvas.js'),
      fetch('assets/world.geojson').then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    ]);
    tex = new THREE.CanvasTexture(drawLandCanvas(world, 2048));
  }
  tex.anisotropy = Math.min(8, maxAniso);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/* ---------- Shaders ---------- */
const globeVert = /* glsl */`
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
void main(){
  vObj = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = -mv.xyz;
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;
const globeFrag = /* glsl */`
uniform sampler2D uLand; uniform vec3 uSun; uniform float uDot;
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
const float PI = 3.141592653589793;
vec2 uvOf(float lon, float lat){ return vec2(lon / (2.0 * PI) + 0.5, lat / PI + 0.5); }
void main(){
  vec3 n = normalize(vObj);
  float lat = asin(clamp(n.y, -1.0, 1.0));
  float lon = atan(n.x, n.z);
  vec4 land = texture2D(uLand, uvOf(lon, lat));

  // Equal-area-ish dot lattice
  float sp = uDot * PI / 180.0;
  float row = floor((lat + 0.5 * PI) / sp);
  float latC = (row + 0.5) * sp - 0.5 * PI;
  float cols = max(1.0, floor(2.0 * PI * cos(latC) / sp));
  float spL = 2.0 * PI / cols;
  float lonC = (floor((lon + PI) / spL) + 0.5) * spL - PI;
  vec3 c = vec3(cos(latC) * sin(lonC), sin(latC), cos(latC) * cos(lonC));
  float d = length(n - c) / sp;
  float aa = length(fwidth(n)) / sp;
  float dotMask = 1.0 - smoothstep(0.30 - aa, 0.30 + aa, d);
  float landC = texture2D(uLand, uvOf(lonC, latC)).r;

  float sunD = dot(n, uSun);
  float day = smoothstep(-0.16, 0.24, sunD);
  float term = 1.0 - smoothstep(0.0, 0.16, abs(sunD + 0.03));

  vec3 N = normalize(vN); vec3 V = normalize(vV);
  float ndv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - ndv, 3.0);

  // Light "frosted glass" globe: pale sphere, blue dotted land, blue borders, blue rim
  vec3 ocean = mix(vec3(0.83, 0.88, 0.97), vec3(0.96, 0.975, 1.0), day);
  ocean = mix(ocean, vec3(0.74, 0.83, 1.0), land.b * 0.45);
  vec3 landFill = mix(vec3(0.76, 0.83, 0.97), vec3(0.88, 0.92, 1.0), day);
  vec3 col = mix(ocean, landFill, land.r * 0.7);
  vec3 dotCol = mix(vec3(0.05, 0.20, 0.70), vec3(0.10, 0.36, 0.95), day);
  col = mix(col, dotCol, dotMask * landC * 0.92);
  col = mix(col, vec3(0.10, 0.34, 0.94), land.g * 0.55);
  col = mix(col, vec3(0.55, 0.70, 1.0), term * 0.12);
  col *= 0.86 + 0.14 * pow(ndv, 0.6);
  col = mix(col, vec3(0.40, 0.60, 1.0), fres * 0.75);
  gl_FragColor = vec4(col, 1.0);
}`;
const atmoFrag = /* glsl */`
uniform vec3 uColor; uniform float uStrength;
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
void main(){
  float d = dot(normalize(vN), normalize(vV));
  float a = smoothstep(0.0, 0.55, -d);
  a = pow(a, 1.8) * uStrength;
  gl_FragColor = vec4(uColor, a);
}`;
const arcVert = /* glsl */`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const arcFrag = /* glsl */`
uniform float uHead; uniform float uActive; uniform float uReveal; uniform vec3 uColor;
varying vec2 vUv;
void main(){
  float t = vUv.x;
  if (t > uReveal) discard;
  float base = mix(0.22, 0.75, uActive);
  float dt = uHead - t;
  float comet = dt >= 0.0 ? pow(max(0.0, 1.0 - dt / 0.24), 2.4) : 0.0;
  float a = base + comet * mix(0.55, 1.6, uActive);
  vec3 col = mix(uColor, vec3(0.0, 0.62, 1.0), comet * uActive * 0.7);
  gl_FragColor = vec4(col, min(1.0, a));
}`;

/* ---------- Main ---------- */
async function main() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return failGracefully('WebGL unavailable'); }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.75 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const globe = new THREE.Group(); globe.rotation.order = 'XYZ'; scene.add(globe);

  let landTex;
  try { landTex = await loadLandTexture(small ? 2048 : 4096, renderer.capabilities.getMaxAnisotropy()); }
  catch (e) { return failGracefully('Geo data unavailable: ' + (e && e.message)); }
  const sphereGeo = new THREE.SphereGeometry(1, small ? 96 : 128, small ? 64 : 96);
  const globeMat = new THREE.ShaderMaterial({
    vertexShader: globeVert, fragmentShader: globeFrag,
    uniforms: { uLand: { value: landTex }, uSun: { value: new THREE.Vector3(1, 0, 0) }, uDot: { value: small ? 1.45 : 1.1 } },
    extensions: { derivatives: true }
  });
  globe.add(new THREE.Mesh(sphereGeo, globeMat));

  // Atmosphere shell + wide soft halo
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 48), new THREE.ShaderMaterial({
    vertexShader: globeVert, fragmentShader: atmoFrag, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    uniforms: { uColor: { value: new THREE.Color('#2f6bff') }, uStrength: { value: 0.3 } }
  }));
  scene.add(atmo);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(256, 'rgba(26,86,240,.14)', 'rgba(26,86,240,.06)'), transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
  halo.scale.setScalar(3.6); halo.renderOrder = -1; scene.add(halo); // depth-tested: hidden behind the globe's front face

  // Floating dust
  const dustCount = small ? 260 : 520, dustPos = new Float32Array(dustCount * 3), dustCol = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(1.35 + Math.random() * 1.6);
    dustPos.set([v.x, v.y, v.z], i * 3);
    const white = Math.random() < 0.25; dustCol.set(white ? [0.22, 0.74, 0.97] : [0.1, 0.34, 0.94], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.022, map: glowTexture(64, 'rgba(255,255,255,1)', 'rgba(255,255,255,.35)', 'rgba(255,255,255,0)'), vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.NormalBlending }));
  scene.add(dust);

  // HUD orbit rings
  const orbitGroup = new THREE.Group(); scene.add(orbitGroup);
  const makeOrbit = (r, tiltX, tiltZ, opacity, dashed) => {
    const pts = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2).getPoints(220).map(p => new THREE.Vector3(p.x, 0, p.y));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = dashed
      ? new THREE.LineDashedMaterial({ color: RED, transparent: true, opacity, dashSize: 0.05, gapSize: 0.035, depthWrite: false, blending: THREE.NormalBlending })
      : new THREE.LineBasicMaterial({ color: RED, transparent: true, opacity, depthWrite: false, blending: THREE.NormalBlending });
    const line = new THREE.LineLoop(geo, mat); if (dashed) line.computeLineDistances();
    line.rotation.set(tiltX, 0, tiltZ); orbitGroup.add(line); return line;
  };
  const orbitA = makeOrbit(1.32, 1.28, 0.42, 0.42, false);
  makeOrbit(1.46, 1.12, -0.55, 0.28, true);
  const satTex = glowTexture(64);
  const satellite = new THREE.Sprite(new THREE.SpriteMaterial({ map: satTex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
  satellite.scale.setScalar(0.07); orbitA.add(satellite);

  /* ---- Markers ---- */
  const markerTex = glowTexture(64);
  const markers = new Map();
  const addMarker = (hub, isOrigin) => {
    const v = toVec(hub.coord);
    const group = new THREE.Group(); group.position.copy(v); globe.add(group);
    group.lookAt(v.clone().multiplyScalar(2)); // +Z now points away from the surface
    const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
    dot.scale.setScalar(isOrigin ? 0.075 : 0.05); dot.position.z = 0.006; group.add(dot);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.026, 0.031, 48), new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.NormalBlending }));
    ring.position.z = 0.003; group.add(ring);
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, isOrigin ? 0.2 : 0.13)]);
    beamGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array([0.1, 0.34, 0.94, 1, 0.1, 0.34, 0.94, 0]), 4));
    const beam = new THREE.Line(beamGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
    group.add(beam);
    const label = document.createElement('div');
    label.className = 'g-label' + (isOrigin ? ' origin' : '');
    labelsEl.appendChild(label);
    const m = { hub, v, group, dot, ring, beam, label, isOrigin, active: isOrigin ? 1 : 0, phase: Math.random() * Math.PI * 2 };
    markers.set(hub.key, m); return m;
  };
  addMarker(GB.origin, true);
  GB.hubs.forEach(h => addMarker(h, false));

  /* ---- Arcs ---- */
  const arcs = new Map();
  const vo = toVec(GB.origin.coord);
  GB.hubs.forEach((h, i) => {
    const vb = toVec(h.coord); const ang = vo.angleTo(vb); const lift = 0.05 + ang * 0.2;
    const pts = [];
    for (let k = 0; k <= 80; k++) {
      const t = k / 80, s = Math.sin(ang);
      const v = vo.clone().multiplyScalar(Math.sin((1 - t) * ang) / s).add(vb.clone().multiplyScalar(Math.sin(t * ang) / s));
      pts.push(v.multiplyScalar(1.002 + lift * Math.sin(Math.PI * t)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const mat = new THREE.ShaderMaterial({
      vertexShader: arcVert, fragmentShader: arcFrag, transparent: true, depthWrite: false, blending: THREE.NormalBlending,
      uniforms: { uHead: { value: 0 }, uActive: { value: 0 }, uReveal: { value: 1 }, uColor: { value: RED.clone() } }
    });
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, small ? 0.0075 : 0.0062, 8, false), mat);
    globe.add(tube);
    const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
    head.scale.setScalar(0.06); globe.add(head);
    const mid = toLonLat(vo.clone().add(vb));
    arcs.set(h.key, { curve, mat, head, offset: i * 0.21, active: 0, reveal: 1, mid, ang });
  });

  /* ---- View state ---- */
  const HOME = { lon: 24, lat: 24, zoom: 1 };
  const view = { lon: HOME.lon - 40, lat: HOME.lat, zoom: 0.86 };
  const target = { ...HOME };
  let flying = true, paused = reduced, lastInteraction = -1e9, baseD = 4.6, radiusPx = 200;
  const vel = { lon: 0, lat: 0 };

  function flyTo(lon, lat, zoom) { target.lon = view.lon + wrap(lon - view.lon); target.lat = Math.max(-70, Math.min(70, lat)); if (zoom) target.zoom = zoom; flying = true; }
  function setActive(key, animate = true) {
    arcs.forEach((a, k) => { if (k === key && animate) a.reveal = 0; });
    const a = arcs.get(key); if (!a) return;
    flyTo(a.mid[0], a.mid[1] * 0.85 + 6, a.ang > 0.9 ? 0.92 : a.ang > 0.45 ? 1.0 : 1.12);
  }

  /* ---- Sizing ---- */
  const FILL = 0.78;
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const T = Math.tan(camera.fov * RAD / 2) * Math.min(1, w / h);
    baseD = Math.sqrt(1 + 1 / (FILL * T) ** 2);
    radiusPx = FILL * Math.min(w, h) / 2;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  /* ---- Sun ---- */
  const updateSun = () => globeMat.uniforms.uSun.value.copy(toVec(GB.sunPosition(new Date())));
  updateSun(); setInterval(updateSun, 30000);

  /* ---- Interaction ---- */
  const pointers = new Map(); let pinch = 0, last = null;
  const touch = () => { lastInteraction = performance.now(); };
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last = { x: e.clientX, y: e.clientY, t: performance.now() }; flying = false; vel.lon = vel.lat = 0; touch();
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    stage.classList.add('dragging');
  });
  canvas.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]; const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch > 0) target.zoom = view.zoom = clampZoom(view.zoom * dist / pinch); pinch = dist;
    } else if (last) {
      const now = performance.now(), dt = Math.max(1, now - last.t);
      const k = 57.2958 / (radiusPx * view.zoom);
      const dLon = -(e.clientX - last.x) * k, dLat = (e.clientY - last.y) * k;
      view.lon += dLon; view.lat = Math.max(-70, Math.min(70, view.lat + dLat));
      target.lon = view.lon; target.lat = view.lat;
      vel.lon = dLon / dt; vel.lat = dLat / dt;
      last = { x: e.clientX, y: e.clientY, t: now };
    }
    touch();
  });
  const end = e => {
    pointers.delete(e.pointerId); pinch = 0;
    if (pointers.size) { const p = [...pointers.values()][0]; last = { x: p.x, y: p.y, t: performance.now() }; }
    else { last = null; stage.classList.remove('dragging'); }
    touch();
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(n => canvas.addEventListener(n, end));
  canvas.addEventListener('wheel', e => {
    if (!e.ctrlKey && !e.metaKey) return; // never hijack page scroll; trackpad pinch sends ctrlKey
    e.preventDefault(); target.zoom = clampZoom(target.zoom * Math.exp(-e.deltaY * 0.0025)); touch();
  }, { passive: false });
  canvas.addEventListener('keydown', e => {
    const step = 8;
    const actions = {
      ArrowLeft: () => flyTo(target.lon - step, target.lat), ArrowRight: () => flyTo(target.lon + step, target.lat),
      ArrowUp: () => flyTo(target.lon, target.lat + step), ArrowDown: () => flyTo(target.lon, target.lat - step),
      '+': () => zoomBy(1.12), '=': () => zoomBy(1.12), '-': () => zoomBy(1 / 1.12), Home: reset, '0': reset
    };
    if (actions[e.key]) { e.preventDefault(); actions[e.key](); touch(); }
  });
  const clampZoom = z => Math.max(0.75, Math.min(1.9, z));
  const zoomBy = f => { target.zoom = clampZoom(target.zoom * f); };
  function reset() { flyTo(HOME.lon, HOME.lat, HOME.zoom); touch(); }

  const pauseBtn = document.getElementById('globe-pause');
  const syncPause = () => { pauseBtn.textContent = paused ? '▶' : 'Ⅱ'; pauseBtn.setAttribute('aria-pressed', String(paused)); pauseBtn.setAttribute('aria-label', GB.t(paused ? 'resume' : 'pause')); };
  pauseBtn.addEventListener('click', () => { paused = !paused; syncPause(); });
  document.getElementById('globe-reset').addEventListener('click', reset);
  document.getElementById('globe-zoom-in').addEventListener('click', () => { zoomBy(1.15); touch(); });
  document.getElementById('globe-zoom-out').addEventListener('click', () => { zoomBy(1 / 1.15); touch(); });
  GB.events.addEventListener('lang', syncPause);
  GB.events.addEventListener('region', e => { setActive(e.detail); touch(); });
  syncPause();

  /* ---- Readouts ---- */
  const rLat = document.getElementById('readout-lat'), rLon = document.getElementById('readout-lon'), rZoom = document.getElementById('readout-zoom');
  let readoutAt = 0;
  const fmtLat = v => `${Math.abs(v).toFixed(1)}° ${v >= 0 ? 'N' : 'S'}`, fmtLon = v => `${Math.abs(v).toFixed(1)}° ${v >= 0 ? 'E' : 'W'}`;

  /* ---- Render loop ---- */
  let visible = true, frame = 0, lastTime = 0;
  const tmp = new THREE.Vector3(), camDir = new THREE.Vector3();
  function render(time) {
    frame = 0; if (!visible) return;
    const dt = lastTime ? Math.min(time - lastTime, 60) : 16; lastTime = time;
    const idle = time - lastInteraction;

    // Motion: inertia → fly-to easing → idle auto-rotation
    if (!pointers.size && (Math.abs(vel.lon) > 1e-4 || Math.abs(vel.lat) > 1e-4) && !flying) {
      view.lon += vel.lon * dt; view.lat = Math.max(-70, Math.min(70, view.lat + vel.lat * dt));
      const decay = Math.exp(-dt / 320); vel.lon *= decay; vel.lat *= decay; target.lon = view.lon; target.lat = view.lat;
    }
    const ease = 1 - Math.exp(-dt / (reduced ? 60 : 420));
    if (flying) {
      view.lon += (target.lon - view.lon) * ease; view.lat += (target.lat - view.lat) * ease;
      if (Math.abs(target.lon - view.lon) < 0.02 && Math.abs(target.lat - view.lat) < 0.02) flying = false;
    } else if (!paused && !pointers.size && idle > 3500) {
      view.lon += dt * 0.0042; target.lon = view.lon;
    }
    view.zoom += (target.zoom - view.zoom) * (1 - Math.exp(-dt / 220));

    globe.rotation.y = -view.lon * RAD; globe.rotation.x = view.lat * RAD;
    camera.position.set(0, 0, baseD / view.zoom); camera.lookAt(0, 0, 0);

    // Arcs
    const animT = reduced ? 0 : time;
    arcs.forEach((a, key) => {
      const isActive = key === GB.region ? 1 : 0;
      a.active += (isActive - a.active) * (1 - Math.exp(-dt / 250));
      a.reveal = Math.min(1, a.reveal + dt / (reduced ? 1 : 1100));
      const cycle = reduced ? 0.75 : ((animT * 0.00011 * (isActive ? 1.35 : 1)) + a.offset) % 1;
      const head = cycle * 1.3 - 0.05;
      a.mat.uniforms.uHead.value = Math.min(head, a.reveal);
      a.mat.uniforms.uActive.value = a.active;
      a.mat.uniforms.uReveal.value = a.reveal;
      const hv = Math.max(0, Math.min(1, Math.min(head, a.reveal)));
      a.curve.getPointAt(hv, a.head.position);
      a.head.material.opacity = (head >= 0 && head <= 1 ? 1 : 0) * (0.35 + 0.65 * a.active);
      a.head.scale.setScalar(0.035 + 0.04 * a.active);
    });

    // Markers & labels
    camDir.copy(camera.position).normalize();
    const w = stage.clientWidth, h = stage.clientHeight;
    markers.forEach(m => {
      const want = m.isOrigin || m.hub.key === GB.region ? 1 : 0;
      m.active += (want - m.active) * (1 - Math.exp(-dt / 250));
      const pulse = reduced ? 0.5 : (Math.sin(animT * 0.004 + m.phase) + 1) / 2;
      const s = 1 + pulse * (0.6 + 0.8 * m.active);
      m.ring.scale.setScalar(s); m.ring.material.opacity = (0.25 + 0.6 * m.active) * (1.15 - pulse * 0.8);
      m.beam.material.opacity = 0.15 + 0.85 * m.active; m.beam.scale.z = 0.4 + 0.6 * m.active;
      m.dot.material.opacity = 0.55 + 0.45 * m.active;

      m.group.getWorldPosition(tmp);
      const facing = tmp.dot(camDir) - 1 / camera.position.length();
      const opacity = Math.max(0, Math.min(1, facing * 7)) * (m.isOrigin ? 1 : 0.55 + 0.45 * m.active);
      tmp.multiplyScalar(1.04).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h;
      const on = m.isOrigin || m.active > 0.5;
      const lw = on ? m.wActive : m.wIdle;
      const flip = x + lw + 16 > w; // keep labels inside the stage near its right edge
      m.label.style.transform = `translate(${(flip ? x - lw - 20 : x).toFixed(1)}px, ${y.toFixed(1)}px)`;
      m.label.style.opacity = opacity.toFixed(2);
      m.label.classList.toggle('active', m.active > 0.5);
      m.label.classList.toggle('flip', flip);
    });

    if (!reduced) {
      dust.rotation.y += dt * 0.00002; dust.rotation.x += dt * 0.000006;
      orbitGroup.rotation.y += dt * 0.00008;
      satellite.position.set(Math.cos(time * 0.00035) * 1.32, 0, Math.sin(time * 0.00035) * 1.32);
    }

    if (time - readoutAt > 120) {
      readoutAt = time;
      rLat.textContent = fmtLat(view.lat); rLon.textContent = fmtLon(wrap(view.lon)); rZoom.textContent = view.zoom.toFixed(2) + '×';
    }

    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }

  /* ---- Labels ---- */
  const nf = () => new Intl.NumberFormat({ ru: 'ru-RU', en: 'en-GB', tr: 'tr-TR' }[GB.lang]);
  function renderLabels() {
    markers.forEach(m => {
      m.label.innerHTML = m.isOrigin
        ? `<i></i><b>IST</b><span>İSTANBUL</span>`
        : `<i></i><b>${m.hub.code}</b><span>${m.hub.city} · ≈${nf().format(m.hub.km)} km</span>`;
      // measure both states once, so the render loop never forces layout
      const had = m.label.classList.contains('active');
      m.label.classList.add('active'); m.wActive = m.label.offsetWidth;
      m.label.classList.remove('active'); m.wIdle = m.label.offsetWidth;
      m.label.classList.toggle('active', had);
    });
  }
  renderLabels(); GB.events.addEventListener('lang', renderLabels);

  /* ---- Lifecycle ---- */
  const start = () => { if (!frame && visible && !document.hidden) { lastTime = 0; frame = requestAnimationFrame(render); } };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; start(); }, { rootMargin: '80px' }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start(); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(frame); frame = 0; });
  canvas.addEventListener('webglcontextrestored', start);

  setActive(GB.region, false);
  target.zoom = HOME.zoom; // the intro flies in from a slightly zoomed-out, rotated view
  renderer.render(scene, camera);
  stage.classList.add('globe-ready');
  loadingEl?.classList.add('done');
  GB.globeReady = true;
  start();
}

main().catch(e => failGracefully(e && e.message));
