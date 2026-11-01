// Deterministic lifecycle tests; browser/layout coverage lives in signal.mjs.
import { stripTypeScriptTypes } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = stripTypeScriptTypes(readFileSync('src/scripts/hero.ts', 'utf8')).replace('export {};', '');
function harness(reduced = false) {
  const events = {};
  const elements = {};
  let draws = 0, next = 0;
  const frames = new Map();
  const ctx = { clearRect() { draws++; }, fillText() {}, setTransform() {} };
  for (const key of ['#stage', '#field', '.signal-controls', '#signal-status', '#signal-pause', '#signal-send', '#signal-replay']) {
    elements[key] = { clientWidth: 1280, clientHeight: 720, textContent: '', disabled: false,
      getContext: () => ctx, setAttribute(key, value) { this[key] = value; },
      addEventListener(type, fn) { events[key + ':' + type] = fn; } };
  }
  const mq = { matches: reduced, addEventListener(_, fn) { events.media = fn; } };
  const document = { querySelector: key => elements[key], documentElement: {}, hidden: false,
    fonts: { ready: Promise.resolve() }, addEventListener(_, fn) { events.visibility = fn; } };
  const observer = name => class { constructor(fn) { events[name] = fn; } observe() {} };
  vm.runInNewContext(source, { document, matchMedia: () => mq, location: { search: '' },
    URLSearchParams, getComputedStyle: () => ({ getPropertyValue: () => '244,114,182' }),
    devicePixelRatio: 1, requestAnimationFrame: fn => { frames.set(++next, fn); return next; },
    cancelAnimationFrame: id => frames.delete(id), ResizeObserver: observer('resize'),
    IntersectionObserver: observer('intersection'), MutationObserver: observer('theme') });
  const click = id => events[id + ':click']();
  const tick = now => { const entry = frames.entries().next().value; if (entry) { frames.delete(entry[0]); entry[1](now); } };
  return { elements, events, mq, document, frames, click, tick, draws: () => draws };
}
const h = harness();
assert.equal(h.frames.size, 1);
for (let i = 0; i < 8; i++) h.click('#signal-replay');
assert.equal(h.frames.size, 1, 'replay must not duplicate loops');
h.tick(100); h.tick(200);
h.click('#signal-pause');
assert.equal(h.frames.size, 0);
assert.equal(h.elements['#signal-pause']['aria-pressed'], 'true');
h.click('#signal-send');
assert.equal(h.frames.size, 1);
assert.equal(h.elements['#signal-status'].textContent, 'Sending the signal outward');
h.events.intersection([{ isIntersecting: false }]);
assert.equal(h.frames.size, 0);
h.document.hidden = true; h.events.visibility();
h.events.intersection([{ isIntersecting: true }]);
assert.equal(h.frames.size, 0, 'offscreen resume must respect hidden document');
h.document.hidden = false; h.events.visibility();
assert.equal(h.frames.size, 1);
h.mq.matches = true; h.events.media();
assert.equal(h.frames.size, 0);
const before = h.draws();
h.click('#signal-send');
assert.equal(h.draws(), before, 'reduced-motion send must not animate');
h.click('#signal-replay');
assert.equal(h.frames.size, 0);
assert.equal(h.elements['#signal-pause'].disabled, true);
h.mq.matches = false; h.events.media();
assert.equal(h.frames.size, 1);
const initial = harness(true);
assert.equal(initial.frames.size, 0);
assert.equal(initial.elements['#signal-pause'].disabled, true);
console.log('PASS signal lifecycle: single loop, pause, repeated replay, send, visibility, intersection, initial/live reduced motion');
