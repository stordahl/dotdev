import { redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getDraftStore, generateSlug } from '$lib/server/draft-store';

export async function load(event) {
	const authenticated = await validateSession(event);

	if (!authenticated) {
		throw redirect(302, '/admin');
	}

	const title = 'Untitled Draft';
	const slug = `${generateSlug(title)}-${Date.now()}`;
	const now = new Date().toISOString();

	const store = getDraftStore(event);
	await store.put(slug, {
		slug,
		title,
		description: '',
		body: '',
		published: false,
		createdAt: now,
		updatedAt: now
	});

	throw redirect(302, `/admin/drafts/${slug}`);
}
