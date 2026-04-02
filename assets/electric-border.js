/* ============================================================
   ElectricBorder — vanilla JS port of the ReactBits component
   Usage: ElectricBorder.init(element, options)
   ============================================================ */

const ElectricBorder = (() => {
  'use strict';

  /* ── Noise helpers ─────────────────────────────────────────── */
  function random(x) {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }

  function noise2D(x, y) {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
  }

  function octavedNoise(x, time, seed, chaos) {
    const octaves = 10, lacunarity = 1.6, gain = 0.7;
    const amplitude = chaos, frequency = 10;
    let y = 0, amp = amplitude, freq = frequency;
    for (let i = 0; i < octaves; i++) {
      y += amp * noise2D(freq * x + seed * 100, time * freq * 0.3);
      freq *= lacunarity;
      amp *= gain;
    }
    return y;
  }

  function getCornerPoint(cx, cy, r, startAngle, arcLength, progress) {
    const angle = startAngle + progress * arcLength;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function getRoundedRectPoint(t, left, top, width, height, radius) {
    const sw = width - 2*radius, sh = height - 2*radius;
    const arc = (Math.PI * radius) / 2;
    const total = 2*sw + 2*sh + 4*arc;
    const dist = t * total;
    let acc = 0;

    if (dist <= acc + sw) return { x: left+radius+(dist-acc)/sw*sw, y: top };
    acc += sw;
    if (dist <= acc + arc) return getCornerPoint(left+width-radius, top+radius, radius, -Math.PI/2, Math.PI/2, (dist-acc)/arc);
    acc += arc;
    if (dist <= acc + sh) return { x: left+width, y: top+radius+(dist-acc)/sh*sh };
    acc += sh;
    if (dist <= acc + arc) return getCornerPoint(left+width-radius, top+height-radius, radius, 0, Math.PI/2, (dist-acc)/arc);
    acc += arc;
    if (dist <= acc + sw) return { x: left+width-radius-(dist-acc)/sw*sw, y: top+height };
    acc += sw;
    if (dist <= acc + arc) return getCornerPoint(left+radius, top+height-radius, radius, Math.PI/2, Math.PI/2, (dist-acc)/arc);
    acc += arc;
    if (dist <= acc + sh) return { x: left, y: top+height-radius-(dist-acc)/sh*sh };
    acc += sh;
    return getCornerPoint(left+radius, top+radius, radius, Math.PI, Math.PI/2, (dist-acc)/arc);
  }

  /* ── Core init ─────────────────────────────────────────────── */
  function init(container, opts = {}) {
    const {
      color        = '#FF4655',
      speed        = 1,
      chaos        = 0.12,
      borderRadius = 16,
      onlyOnHover  = true
    } = opts;

    const OFFSET = 30;
    const DISPLACEMENT = 40;

    // Wrap if not already wrapped
    if (!container.classList.contains('eb-host')) {
      container.classList.add('eb-host');
    }

    // Canvas
    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'eb-canvas-container';
    const canvas = document.createElement('canvas');
    canvas.className = 'eb-canvas';
    canvasWrap.appendChild(canvas);

    // Glow layers
    const layers = document.createElement('div');
    layers.className = 'eb-layers';
    layers.innerHTML = '<div class="eb-glow-1"></div><div class="eb-glow-2"></div><div class="eb-background-glow"></div>';

    container.insertBefore(layers, container.firstChild);
    container.insertBefore(canvasWrap, container.firstChild);
    container.style.setProperty('--electric-border-color', color);

    const ctx = canvas.getContext('2d');
    let animId = null, time = 0, lastFrame = 0, running = false;

    function resize() {
      const rect = container.getBoundingClientRect();
      const w = rect.width + OFFSET * 2;
      const h = rect.height + OFFSET * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }

    function draw(now) {
      if (!running) return;
      const dt = (now - lastFrame) / 1000;
      time += dt * speed;
      lastFrame = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 22;

      const bw = w - 2*OFFSET, bh = h - 2*OFFSET;
      const maxR = Math.min(bw, bh) / 2;
      const r = Math.min(borderRadius, maxR);
      const perimeter = 2*(bw+bh) + 2*Math.PI*r;
      const samples = Math.floor(perimeter / 2);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = getRoundedRectPoint(p, OFFSET, OFFSET, bw, bh, r);
        const nx = octavedNoise(p*8, time, 0, chaos) * DISPLACEMENT;
        const ny = octavedNoise(p*8, time, 1, chaos) * DISPLACEMENT;
        i === 0 ? ctx.moveTo(pt.x+nx, pt.y+ny) : ctx.lineTo(pt.x+nx, pt.y+ny);
      }
      ctx.closePath();
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      layers.style.opacity = '1';
      animId = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      layers.style.opacity = '0';
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    if (onlyOnHover) {
      container.addEventListener('mouseenter', start);
      container.addEventListener('mouseleave', stop);
    } else {
      start();
    }

    return { start, stop, destroy: () => { stop(); ro.disconnect(); } };
  }

  /* ── Auto-init on DOMContentLoaded ─────────────────────────── */
  function autoInit() {
    document.querySelectorAll('[data-electric-border]').forEach(el => {
      const color   = el.dataset.electricColor   || '#FF4655';
      const chaos   = parseFloat(el.dataset.electricChaos  || '0.32');
      const speed   = parseFloat(el.dataset.electricSpeed  || '1.8');
      const radius  = parseFloat(el.dataset.electricRadius || '16');
      const hover   = el.dataset.electricHover !== 'false';
      init(el, { color, chaos, speed, borderRadius: radius, onlyOnHover: hover });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  return { init, autoInit };
})();
