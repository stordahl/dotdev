import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getDraftStore, generateSlug } from '$lib/server/draft-store';

export async function GET(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const store = getDraftStore(event);
	const drafts = await store.list();
	return json(drafts);
}

export async function POST(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { title, description, body } = await event.request.json();
	if (!title) return json({ error: 'Title is required' }, { status: 400 });

	const slug = `${generateSlug(title)}-${Date.now()}`;
	const now = new Date().toISOString();

	const store = getDraftStore(event);
	await store.put(slug, {
		slug,
		title,
		description: description || '',
		body: body || '',
		published: false,
		createdAt: now,
		updatedAt: now
	});

	return json({ slug }, { status: 201 });
}
