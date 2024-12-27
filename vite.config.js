import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			// Multiple entry points for subpath imports
			entry: {
				// The main entry for "@base-framework/ui"
				index: path.resolve(__dirname, 'src/ui.js'),
				// For "@base-framework/ui/atoms"
				atoms: path.resolve(__dirname, 'src/components/atoms/index.js'),
				// For "@base-framework/ui/molecules"
				molecules: path.resolve(__dirname, 'src/components/molecules/index.js'),
				// For "@base-framework/ui/organisms"
				organisms: path.resolve(__dirname, 'src/components/organisms/index.js'),
			},

			// If you only want ES modules, specify just ["es"].
			formats: ["es"],

			// Customize filenames, e.g. "index.es.js", "atoms.es.js", etc.
			fileName: (format, entryName) => {
				return `${entryName}.es.js`;
			},
		},
		rollupOptions: {
			// Mark external deps so they're not bundled
			external: [
				'@base-framework/base',
				'@base-framework/atoms',
				'@base-framework/organisms'
			],
		}
	}
});