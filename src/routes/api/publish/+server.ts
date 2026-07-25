import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getDraftStore } from '$lib/server/draft-store';
import { toMarkdown } from '$lib/draft-markdown';
import { createPostPR } from '$lib/server/github';

export async function POST(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { slug } = await event.request.json();
	if (!slug) return json({ error: 'Slug is required' }, { status: 400 });

	const store = getDraftStore(event);
	const draft = await store.get(slug);
	if (!draft) return json({ error: 'Draft not found' }, { status: 404 });

	const markdown = toMarkdown(draft);

	try {
		const result = await createPostPR(slug, markdown);
		return json(result);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
}
