import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			// Multiple entry points for subpath imports
			entry: {
				// The main entry for "@base-framework/ui"
				index: path.resolve(__dirname, 'src/ui.js'),
				atoms: path.resolve(__dirname, 'src/components/atoms/atoms.js'),
				icons: path.resolve(__dirname, 'src/components/icons/icons.js'),
				molecules: path.resolve(__dirname, 'src/components/molecules/molecules.js'),
				organisms: path.resolve(__dirname, 'src/components/organisms/organisms.js'),
				pages: path.resolve(__dirname, 'src/components/pages/pages.js'),
				templates: path.resolve(__dirname, 'src/components/pages/templates/templates.js'),
				utils: path.resolve(__dirname, 'src/utils/utils.js'),
			},

			// If you only want ES modules, specify just ["es"].
			formats: ["es"],

			// Customize filenames, e.g. "index.es.js", "atoms.es.js", etc.
			fileName: (format, entryName) => {
				return `${entryName}.es.js`;
			},
		},
		rollupOptions: {
			external: [
				'@base-framework/base',
				'@base-framework/atoms',
				'@base-framework/organisms'
			],
		}
	}
});