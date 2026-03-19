import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		widget: 'src/widget.ts',
	},
	format: ['cjs', 'esm'],
	dts: true,
	clean: true,
	external: ['tailwindcss'],
	sourcemap: true,
	treeshake: true,
	minify: false,
	// Suppress the "named + default" CJS warning — our index re-exports both.
	esbuildOptions(options) {
		options.ignoreAnnotations = true
	},
