import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
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
        compilerOptions: {
          runes: true,
          experimental: {
            async: true,
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
