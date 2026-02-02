import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { allPosts } from 'content-collections';

export const load: PageLoad = async ({ params }) => {
	const post = allPosts.find((post) => post.slug == params.slug);
	if (!post) {
		error(404, `Could not find ${params.slug}`);
	}

	return { post };
};
