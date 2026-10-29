# Recall site

Landing and docs site for [Recall](https://github.com/edheltzel/Recall), planned at https://recall.edheltzel.codes. Built from the doskills-site pattern at `a5fcaf5`.

**noindex stays on everywhere** (robots meta on the landing and docs pages, plus `public/robots.txt`) until a separate captain go-live yes.

TODO before go-live: Recall accent color, final copy, recolor `public/og.png`, write the docs and install guide.

## Run locally

Needs Node 22.

```bash
npm ci
npm run dev
```

## Checks

```bash
npx astro check
npm run build
npm run contrast
npm run flash
npm run install-box
```
