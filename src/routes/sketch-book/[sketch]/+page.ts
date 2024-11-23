import { error } from '@sveltejs/kit';
import { codeToHtml } from 'shiki/bundle/web';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		return await loadComponent(params.sketch);
	} catch (e) {
		error(404, `Could not find ${params.sketch}`);
	}
};

async function loadComponent(dir: string) {
    const path = `../../../content/sketches/${dir}/sketch.svelte`;
    const component = (await import(path)).default; 
    const rawCode = (await import(`${path}?raw`)).default;
    const code = await codeToHtml(rawCode, {
      lang: 'svelte',
      theme: 'everforest-dark',
    });

    return { component, code };
  }

