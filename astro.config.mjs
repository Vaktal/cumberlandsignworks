import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://cumberlandsignworks.com',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    // sitemap() — temporarily disabled: @astrojs/sitemap has a bug where
    // `astro:routes:resolved` does not fire before `astro:build:done` in this
    // Astro 4 scaffold, leaving `_routes` undefined. Re-enable once routes are
    // in place or the package is patched. See: github.com/withastro/astro/issues
    // sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    domains: ['cumberlandsignworks.com'],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
