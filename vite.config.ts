import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { comptime } from 'comptime/vite';
import Sonda from 'sonda/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    build: {
      target: 'baseline-widely-available',
      assetsInlineLimit: 0,
    },
    plugins: [
      comptime(),
      isBuild && Sonda({ open: false }),
      tailwindcss({ optimize: true }),
      sveltekit({
        preprocess: vitePreprocess(),
        compilerOptions: {
          runes: true,
          experimental: {
            async: true,
          },
        },
        csp: {
          mode: 'hash',
          directives: {
            'default-src': ['none'],
            'script-src': ['self'],
            'style-src': ['self', 'unsafe-inline'],
            'img-src': ['self'],
            'connect-src': ['self'],
          },
        },
        experimental: {
          remoteFunctions: true,
          forkPreloads: true,
          sendWarningsToBrowser: true,
        },
        adapter: adapter(),
      }),
    ],
    css: {
      transformer: 'lightningcss',
    },
    server: {
      port: 5174,
      forwardConsole: true,
    },
  };
});
