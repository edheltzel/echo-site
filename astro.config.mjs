import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { ogImage, siteDescription, siteName } from './src/site.js';

/** Public origin. Override with SITE_URL. The site is served at /, so there is no base. */
const site = process.env.SITE_URL || 'https://recall.edheltzel.codes';

/** Absolute so crawlers can fetch it; same URL the landing page uses (src/layouts/Base.astro). */
const ogImageUrl = new URL(ogImage.path, site).href;

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    starlight({
      title: siteName,
      description: siteDescription,
      disable404Route: true,
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/edheltzel/Recall' }],
      head: [
        // noindex until a separate captain go-live yes.
        { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } },
        { tag: 'meta', attrs: { property: 'og:image', content: ogImageUrl } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: String(ogImage.width) } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: String(ogImage.height) } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: ogImage.alt } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: ogImageUrl } },
        { tag: 'meta', attrs: { name: 'twitter:image:alt', content: ogImage.alt } },
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' } },
      ],
      customCss: ['./src/styles/tokens.css', './src/styles/base.css', './src/styles/docs.css'],
      components: {
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        SocialIcons: './src/components/SocialIcons.astro',
      },
      routeMiddleware: './src/starlight-route.ts',
      sidebar: [
        {
          label: 'Docs',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'Install guide', slug: 'docs/install' },
          ],
        },
      ],
    }),
  ],
});
