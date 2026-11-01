export {};

// Keep the signal in the site's palette and layout; the controls are a visual
// demonstration only. Install and documentation links retain their real targets.
const stage = document.querySelector<HTMLElement>('#stage')!;
const canvas = document.querySelector<HTMLCanvasElement>('#field')!;
const ctx = canvas.getContext('2d');
const controls = document.querySelector<HTMLElement>('.signal-controls')!;
const status = document.querySelector<HTMLElement>('#signal-status')!;
const pause = document.querySelector<HTMLButtonElement>('#signal-pause')!;
const mq = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
const sample = Number(params.get('t'));
const frozen = params.has('t') && Number.isFinite(sample) ? Math.max(0, sample) : null;
const forcedStill = params.get('still') === '1' || frozen !== null;
let paused = mq.matches || forcedStill;
let time = frozen ?? (paused ? 10 : 0);
let width = 0, height = 0, last = 0, frame = 0, pulse = -100;
let offscreen = false;
let accent = '', highlight = '';
const points = Array.from({ length: 1150 }, (_, i) => {
  const y = 1 - i / 1149 * 2, radius = Math.sqrt(1 - y * y), angle = i * 2.3999632297;
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius, key: i };
});

function label(text: string) {
  if (status.textContent !== text) status.textContent = text;
}
function buttons() {
  pause.textContent = paused ? 'Resume motion' : 'Pause motion';
  pause.setAttribute('aria-pressed', String(paused));
  pause.disabled = mq.matches || forcedStill;
}
function theme() {
  const style = getComputedStyle(document.documentElement);
  accent = style.getPropertyValue('--acc-rgb').trim();
  highlight = style.getPropertyValue('--acc2-rgb').trim();
}
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  const narrow = width <= 860;
  const cx = width * (narrow ? .53 : .8);
  const cy = narrow ? height - 230 : height * .44;
  const radius = narrow ? Math.min(width * .28, 110) : Math.min(width * .18, height * .29);
  const intro = Math.min(time / 3.3, 1), turn = time * .055;
  const ct = Math.cos(turn), st = Math.sin(turn);
  ctx.font = '10px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let lane = 0; lane < 6; lane++) {
    for (let j = 0; j < 23; j++) {
      const u = (j / 23 + time * .045 + lane * .131) % 1;
      const x = cx - radius * 1.02 - (1 - u) * width * .3;
      const y = cy + Math.sin(lane * 1.71) * (1 - u) * radius * 1.5 + Math.sin(u * 4 + lane) * 13;
      ctx.fillStyle = `rgba(${accent},${.12 + .24 * u})`;
      ctx.fillText(j % 4 === 0 ? '1' : j % 3 === 0 ? ':' : '.', x, y);
    }
  }
  const projected = points.map(p => ({
    x: cx + (p.x * ct + p.z * st) * radius * (1 + (1 - intro) * 1.7) + (1 - intro) * Math.sin(p.key * 1.3) * radius * .8,
    y: cy + p.y * radius * (.91 + .06 * Math.sin(p.z * 3 + time * .12)),
    z: -p.x * st + p.z * ct,
  })).sort((a, b) => a.z - b.z);
  for (const p of projected) {
    const front = (p.z + 1) / 2, band = (Math.sin(p.y / radius * 8 + time * .23 + p.z * 2) + 1) / 2;
    ctx.fillStyle = `rgba(${front > .7 ? highlight : accent},${.12 + front * .58 + band * .14})`;
    ctx.fillText(' .:+*#'[Math.min(5, Math.floor(front * 3 + band * 2) + 1)], p.x, p.y);
  }
  const elapsed = pulse < 0 ? time - 3.7 : time - pulse;
  if (elapsed >= 0 && elapsed < 3.8) {
    for (let ring = 0; ring < 3; ring++) {
      const progress = (elapsed - ring * .34) / 3.1;
      if (progress < 0 || progress > 1) continue;
      ctx.fillStyle = `rgba(${accent},${(1 - progress) * .53})`;
      for (let a = 0; a < Math.PI * 2; a += .073) {
        const r = radius * (1 + progress * 1.95);
        ctx.fillText(a % 1 > .5 ? ':' : '.', cx + Math.cos(a) * r, cy + Math.sin(a) * r * .72);
      }
    }
  }
  label(mq.matches ? 'Still signal · reduced motion' : paused ? 'Motion paused' : elapsed >= 0 && elapsed < 3.8 ? 'Sending the signal outward' : time < 3.3 ? 'Gathering the signal' : 'Signal clear · quiet idle');
}
function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  last = 0;
}
function tick(now: number) {
  frame = 0;
  if (paused || document.hidden || offscreen) return;
  if (last) time += Math.min((now - last) / 1000, .05);
  last = now;
  draw();
  frame = requestAnimationFrame(tick);
}
function run() {
  if (!paused && !document.hidden && !offscreen && !frame) {
    last = 0;
    frame = requestAnimationFrame(tick);
  }
}
function size() {
  if (!ctx) return;
  width = stage.clientWidth; height = stage.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}
if (ctx) {
  controls.hidden = false;
  pause.addEventListener('click', () => {
    paused = !paused;
    stop(); buttons(); draw(); run();
  });
  document.querySelector('#signal-replay')!.addEventListener('click', () => {
    stop(); paused = mq.matches || forcedStill; time = frozen ?? (paused ? 10 : 0); pulse = -100;
    buttons(); draw(); run();
  });
  document.querySelector('#signal-send')!.addEventListener('click', () => {
    if (mq.matches || forcedStill) { label('Signal sent · motion reduced'); return; }
    time = Math.max(time, 4); pulse = time; paused = false;
    buttons(); draw(); run();
  });
  mq.addEventListener('change', () => {
    stop(); paused = mq.matches || forcedStill;
    if (paused) time = frozen ?? 10;
    buttons(); draw(); run();
  });
  document.addEventListener('visibilitychange', () => { stop(); run(); });
  new IntersectionObserver(entries => {
    offscreen = !entries[0]?.isIntersecting; stop(); run();
  }).observe(stage);
  new MutationObserver(() => { theme(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new ResizeObserver(size).observe(stage);
  theme(); buttons(); size(); run();
  document.fonts.ready.then(draw);
}
