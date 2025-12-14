import { sortByDateProperty } from '$lib/utils';
import type { PageServerLoad } from './$types';
import { allPosts } from 'content-collections';

export const load: PageServerLoad = async () => {
	const posts = sortByDateProperty(allPosts);
	return { posts };
};
