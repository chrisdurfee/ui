import path from 'path';
import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration.
 *
 * This file takes precedence over vite.config.js, so the Tailwind plugin
 * and library build settings are not loaded for tests.
 *
 * The components are browser UI, so every suite runs against a jsdom
 * document. Module-level singletons in the framework probe for
 * `window`/`document` when they are first imported, so the DOM has to
 * exist before any framework module is loaded.
 */
export default defineConfig({
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, 'src/components'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		}
	},
	test: {
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				url: 'http://localhost/'
			}
		},
		include: ['tests/**/*.test.js'],
		setupFiles: ['./tests/setup.js'],
		restoreMocks: true,

		/**
		 * Standing up a jsdom document costs a few seconds per file. Running
		 * the files sequentially in one forked process keeps that cost from
		 * being paid by several workers at once on Windows. Module isolation
		 * per file is still on, so module singletons start clean for every
		 * suite.
		 */
		pool: 'forks',
		maxWorkers: 1,
		fileParallelism: false,
		testTimeout: 30000,
		hookTimeout: 30000
	}
});
