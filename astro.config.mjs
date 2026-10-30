import { defineConfig } from 'astro/config';

/** Public origin. Override with SITE_URL. The site is served at /, so there is no base. */
const site = process.env.SITE_URL || 'https://echo.edheltzel.codes';

export default defineConfig({
  site,
  output: 'static',
});
