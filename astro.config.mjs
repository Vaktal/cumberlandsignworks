import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
export default defineConfig({
  site: 'https://cumberlandsignworks.com',
  trailingSlash: 'ignore',

  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    // sitemap() re-enable after all routes are in place:
    // import sitemap from '@astrojs/sitemap'; then add sitemap() here
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

  output: "hybrid",
  adapter: cloudflare()
});