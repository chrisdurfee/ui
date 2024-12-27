import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	// Turn on "library mode"
	build: {
		lib: {
			// The main entry file of your library
			entry: path.resolve(__dirname, 'src/ui.js'),

			// The global name of your library (for UMD/IIFE builds),
			// can be anything or omitted if you only want ESM/CJS
			name: 'BaseFrameworkUI',

			// The output file name without extension;
			// final bundle will be something like:
			// dist/my-library.es.js and dist/my-library.umd.js
			fileName: 'ui',

			// Which formats to generate
			// You can do ['es', 'cjs', 'umd', 'iife'] etc.
			formats: ['es', 'cjs']
		},

		// Mark external libraries that you don't want to bundle
		// (they will be imported at runtime).
		rollupOptions: {
			external: [
				'@base-framework/base',
				'@base-framework/atoms',
				'@base-framework/organisms'
			]
		}
	}
});
