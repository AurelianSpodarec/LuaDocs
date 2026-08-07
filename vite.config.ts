import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';
import { CONTENT_TREE, contentTreeUrls } from './src/content-tree/manifest';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
      },

      pages: [
        { path: '/docs' },
        // Individual posts are reached from here by `crawlLinks`.
        { path: '/blog' },
        { path: '/api/search' },
        { path: 'llms-full.txt' },
        { path: 'llms.txt' },
        ...contentTreeUrls(CONTENT_TREE).map((path) => ({ path })),
      ],
    }),
    react(),
    // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
    nitro(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: 'tslib/tslib.es6.js',
    },
  },
  optimizeDeps: {
    // `@base-ui/utils` is ESM but imports these CommonJS shims by named export,
    // which only works once Vite pre-bundles them. Without this the dev client
    // entry throws on load and the app never hydrates (blank page).
    include: ['use-sync-external-store/shim', 'use-sync-external-store/shim/with-selector'],
  },
});
