import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getDraftStore, generateSlug } from '$lib/server/draft-store';

export async function GET(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const store = getDraftStore(event);
	const draft = await store.get(event.params.slug);
	if (!draft) return json({ error: 'Not found' }, { status: 404 });

	return json(draft);
}

export async function PUT(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const store = getDraftStore(event);
		const existing = await store.get(event.params.slug);
		if (!existing) return json({ error: 'Not found' }, { status: 404 });

		const { title, description, body, published, slug: newSlugRaw } = await event.request.json();

		let newSlug: string | undefined;
		if (newSlugRaw && newSlugRaw !== event.params.slug) {
			newSlug = generateSlug(newSlugRaw);
			if (newSlug !== event.params.slug) {
				const collision = await store.get(newSlug);
				if (collision) {
					return json({ error: 'Slug already in use' }, { status: 409 });
				}
				await store.put(newSlug, {
					...existing,
					slug: newSlug,
					title: title ?? existing.title,
					description: description ?? existing.description,
					body: body ?? existing.body,
					published: published ?? existing.published,
					updatedAt: new Date().toISOString()
				});
				await store.delete(event.params.slug);
				return json({ success: true, newSlug });
			}
		}

		await store.put(event.params.slug, {
			...existing,
			title: title ?? existing.title,
			description: description ?? existing.description,
			body: body ?? existing.body,
			published: published ?? existing.published,
			updatedAt: new Date().toISOString()
		});

		return json({ success: true });
	} catch (err) {
		console.error('Draft PUT error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function DELETE(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const store = getDraftStore(event);
	await store.delete(event.params.slug);
	return json({ success: true });
}
