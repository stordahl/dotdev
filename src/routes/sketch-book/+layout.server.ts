import { allSketches } from 'content-collections';
import type { LayoutServerLoad } from './$types';
import { sortByDateProperty } from '$lib/utils';

export const load: LayoutServerLoad = async () => {
	const sketches = sortByDateProperty(allSketches);
	return { sketches };
};

