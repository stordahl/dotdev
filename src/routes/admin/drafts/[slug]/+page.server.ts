import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getDraftStore } from '$lib/server/draft-store';

export async function load(event) {
	const authenticated = await validateSession(event);

	if (!authenticated) {
		throw error(401, 'Unauthorized');
	}

	const store = getDraftStore(event);
	const draft = await store.get(event.params.slug);

	if (!draft) {
		throw error(404, 'Draft not found');
	}

	return { draft, authenticated };
}
