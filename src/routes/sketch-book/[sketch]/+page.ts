import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { dev } from '$app/environment';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		// Import markdown and component
		const markdown = await import(`../../../content/sketches/${params.sketch}/sketch.md`);
		const component = await import(`../../../content/sketches/${params.sketch}/sketch.svelte`);

    const rawCodeUrl = `https://raw.githubusercontent.com/stordahl/dotdev/refs/heads/main/src/content/sketches/${params.sketch}/sketch.svelte`;
    let rawCode = undefined;

    if (!dev) {

		  // Fetch the raw Svelte file from static directory
		  const response = await fetch(rawCodeUrl);
		  if (!response.ok) {
			  throw new Error('Failed to fetch sketch code');
		  }
		  rawCode = await response.text();
    }

		return {
			component: component.default,
			code: rawCode,
			content: markdown.default,
			metadata: markdown.metadata
		};
	} catch (e) {
		error(404, `Could not find ${params.sketch}. ${e}`);
	}
};
