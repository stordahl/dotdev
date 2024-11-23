import { error } from '@sveltejs/kit';
import { codeToHtml } from 'shiki/bundle/web';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
    const component = await import(`../../../content/sketches/${params.sketch}/sketch.svelte`); 
    const rawCode = await import(`../../../content/sketches/${params.sketch}/sketch.svelte?raw`);

    const code = await codeToHtml(rawCode.default, {
      lang: 'svelte',
      theme: 'everforest-dark',
    });

    return { component: component.default, code };
	} catch (e) {
		error(404, `Could not find ${params.sketch}`);
	}
};

