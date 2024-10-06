import type { Post } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('api/posts');
	const posts: Post[] = await response.json();
	return { posts };
};
