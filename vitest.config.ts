import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['**/*.d.ts', '**/node_modules/**', '**/dist/**', '**/coverage/**', '**/public/**', 'src/main.tsx'],
      },
      include: ['./src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
); 