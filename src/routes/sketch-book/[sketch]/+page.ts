import { error } from '@sveltejs/kit';
import { codeToHtml } from 'shiki/bundle/web';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		// Import markdown and component
		const markdown = await import(`../../../content/sketches/${params.sketch}/sketch.md`);
		const component = await import(`../../../content/sketches/${params.sketch}/sketch.svelte`);

		// Fetch the raw Svelte file from static directory
		const response = await fetch(`/sketches/${params.sketch}.svelte`);
		if (!response.ok) {
			throw new Error('Failed to fetch sketch code');
		}
		const rawCode = await response.text();

		const code = await codeToHtml(rawCode, {
			lang: 'svelte',
			theme: 'everforest-dark'
		});

		return {
			component: component.default,
			code,
			content: markdown.default,
			metadata: markdown.metadata
		};
	} catch {
		error(404, `Could not find ${params.sketch}`);
	}
};
