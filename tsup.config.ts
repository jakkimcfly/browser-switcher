import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  outDir: 'dist',
  target: 'es6',
  esbuildOptions(options, { format }) {
    if (format === 'iife') {
      options.outExtension = { '.js': '.min.js' }
      options.minify = true
      options.globalName = "BrowserSwitcher"
    }
  },
})
