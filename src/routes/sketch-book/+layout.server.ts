import type { Sketch } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/sketches');
	const sketches: Sketch[] = await response.json();
	return { sketches };
};

