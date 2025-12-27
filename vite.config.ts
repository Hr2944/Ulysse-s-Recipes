import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { FontaineTransform } from 'fontaine';

export default defineConfig({
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit(),
		FontaineTransform.vite({
			fallbacks: [
				'BlinkMacSystemFont',
				'Segoe UI',
				'Helvetica Neue',
				'Arial',
				'Georgia',
				'Times New Roman'
			]
		}),
		devtoolsJson()
	]
});
