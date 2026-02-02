import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		alias: {
			'content-collections': './.content-collections/generated'
		}
	}
};

export default config;
