import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    outDir: 'dist',
    target: 'esnext',
  },
  {
    entry: { index: 'src/iffe.ts' },
    format: ['iife'],
    dts: false,
    splitting: false,
    outDir: 'dist',
    target: 'esnext',
    esbuildOptions(options, { format }) {
      if (format === 'iife') {
        options.outExtension = { '.js': '.min.js' }
        options.minify = true
      }
    },
  }
]);
