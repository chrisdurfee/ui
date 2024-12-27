import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [],
	base: '/',
	server: {
		open: true
	},
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, 'src/components')
		}
	}
});
