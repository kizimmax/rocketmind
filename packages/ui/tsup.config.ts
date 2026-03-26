import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'next-themes'],
  jsx: 'react-jsx',
  banner: {
    js: '"use client";',
  },
});
