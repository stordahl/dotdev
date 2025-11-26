import { error } from '@sveltejs/kit';
import { codeToHtml } from 'shiki/bundle/web';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const markdown = await import(`../../../content/sketches/${params.sketch}/sketch.md`);
		const component = await import(`../../../content/sketches/${params.sketch}/sketch.svelte`);

		// Use glob import with ?raw query
		const sketchRawModules = import.meta.glob('../../../content/sketches/*/sketch.svelte', {
			query: '?raw'
		});
		const rawPath = `../../../content/sketches/${params.sketch}/sketch.svelte`;

		if (!(rawPath in sketchRawModules)) {
			throw new Error(`Raw module not found: ${rawPath}`);
		}

		const rawCodeModule = await sketchRawModules[rawPath]();

    // @ts-expect-error duh
		const code = await codeToHtml(rawCodeModule.default, {
			lang: 'svelte',
			theme: 'everforest-dark'
		});

		return {
			component: component.default,
			code,
			content: markdown.default,
			metadata: markdown.metadata
		};
	} catch (e) {
		console.error('Error loading sketch:', e);
		error(404, `Could not find ${params.sketch}`);
	}
};
