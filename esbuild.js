import { build } from 'esbuild';

build({
  entryPoints: ['src/ui.js'],
  outdir: 'dist',
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeShaking: true,
  format: 'esm',  // Output format is ESM
  target: ['esnext'],
  external: ['@base-framework/base', '@base-framework/atoms', '@base-framework/organisms']
})
.catch(() => process.exit(1));