import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { siteDescription, siteName } from './src/site.js';

/** Public origin. Override with SITE_URL. The site is served at /, so there is no base. */
const site = process.env.SITE_URL || 'https://echo.edheltzel.codes';

const gh = (path) => `https://github.com/edheltzel/Echo/blob/master/${path}`;

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    starlight({
      title: siteName,
      description: siteDescription,
      disable404Route: true,
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/edheltzel/Echo' }],
      // RingPost is the intended primary external docs link once its URL is known; GitHub until then.
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'Install', slug: 'docs/install' },
          ],
        },
        {
          label: 'Features',
          items: [
            { label: 'Notifications (text-to-speech)', slug: 'docs/notifications' },
            { label: 'Voice ask (speech-to-text)', slug: 'docs/speech-to-text' },
            { label: 'Mute, snooze, and the dashboard', slug: 'docs/mute-dashboard' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Configuration and data', slug: 'docs/configuration' },
            { label: 'Hosts', link: gh('docs/adapters.md'), attrs: { target: '_blank' } },
            { label: 'HTTP API', link: gh('docs/http-api.md'), attrs: { target: '_blank' } },
            { label: 'Operations', link: gh('docs/operations.md'), attrs: { target: '_blank' } },
          ],
        },
      ],
    }),
  ],
});
