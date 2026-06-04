import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss()
	],
	base: '/',
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, 'src/components'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		}
	},
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
		},

		// Keep readable output so consumer bundlers can tree-shake; final apps minify themselves.
		minify: false,

		// Avoid inlining shared modules into a few large chunks. Emitting one file per
		// source module lets consumer bundlers (with "sideEffects": false) drop everything
		// an app doesn't actually import, producing much smaller app bundles.
		rollupOptions: {
			external: [
				'@base-framework/base',
				'@base-framework/atoms',
				'@base-framework/organisms'
			],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				entryFileNames: '[name].js'
			},
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false
			}
		}
	}
});