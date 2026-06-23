import { allHomeGridCards } from 'content-collections';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const cards = [...allHomeGridCards].sort(
		(a, b) => a.y - b.y || a.x - b.x || a.title.localeCompare(b.title)
	);

	return { cards };
};
