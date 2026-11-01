// Serves dist and checks the landing install box at a 390px viewport.
// Every install command wraps at its slashes and is never clipped. The Copy
// button sits inside its box and does not cover the command.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('dist');
const chrome = process.env.CHROME_PATH || '/usr/bin/google-chrome';

function serve(dir) {
  return http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(dir, url);
    if (url.endsWith('/')) file = path.join(file, 'index.html');
    else if (!path.extname(file)) {
      if (fs.existsSync(file + '.html')) file += '.html';
      else if (fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('not found');
        return;
      }
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
        '.xml': 'application/xml',
      };
      res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    });
  });
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('dist/index.html is missing. Run npm run build first.');
  process.exit(1);
}

const server = serve(root);
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
try {
  for (const width of [320, 390, 860, 1280]) {
    for (const colorScheme of ['dark', 'light']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/`);
      await page.locator('#signal-pause').click();
      assert(await page.locator('#signal-pause').getAttribute('aria-pressed') === 'true', 'pause state');
      const snapshot = () => page.locator('#field').evaluate(canvas => canvas.toDataURL());
      const paused = await snapshot();
      await page.waitForTimeout(120);
      assert(paused === await snapshot(), 'paused canvas changed');
      await page.locator('#signal-send').click();
      assert(await page.locator('#signal-status').textContent() === 'Sending the signal outward', 'send status');
      await page.locator('#signal-replay').click();
      assert(await page.locator('#signal-status').textContent() === 'Gathering the signal', 'replay status');
      for (let i = 0; i < 3; i++) await page.locator('#signal-replay').click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(80);
      assert(await page.locator('#signal-pause').isDisabled(), 'reduced motion pause disabled');
      const still = await snapshot();
      await page.waitForTimeout(120);
      assert(still === await snapshot(), 'reduced motion animated');
      await page.locator('#signal-send').click();
      assert(still === await snapshot(), 'reduced motion send animated');
      await page.locator('#signal-replay').click();
      assert(still === await snapshot(), 'reduced motion replay animated');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
      const layout = await page.evaluate(() => ({
        copy: document.querySelector('.copy').getBoundingClientRect().bottom,
        controls: document.querySelector('.signal-controls').getBoundingClientRect().top,
      }));
      assert(layout.controls > layout.copy, 'controls overlap content');
      assert(await page.locator('.cta .btn').getAttribute('href') === 'https://github.com/edheltzel/Echo/blob/master/docs/install-human.md', 'install CTA changed');
      assert(errors.length === 0, errors.join('\n'));
      if (width === 390 || width === 1280) await page.screenshot({ path: `/tmp/echo-signal-${width}-${colorScheme}.png`, fullPage: true });
      await context.close();
      console.log(`PASS signal ${width}px ${colorScheme}: pause/send/replay/reduced-motion/layout`);
    }
  }
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  assert(await page.locator('#signal-pause').isDisabled(), 'initial reduced motion');
  await context.close();
} finally {
  await browser.close(); server.close();
}
