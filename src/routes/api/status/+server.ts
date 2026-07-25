import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { createPdsSession, createPost } from '$lib/server/bluesky-pds';
import { env } from '$env/dynamic/private';

export async function POST(event) {
	if (!(await validateSession(event))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { text } = await event.request.json();
	if (!text || typeof text !== 'string') {
		return json({ error: 'Text is required' }, { status: 400 });
	}

	const handle = env.BLUESKY_STATUS_HANDLE;
	const password = env.BLUESKY_STATUS_APP_PASSWORD;
	if (!handle || !password) {
		return json({ error: 'Bluesky credentials not configured' }, { status: 500 });
	}

	try {
		const session = await createPdsSession(handle, password);
		const result = await createPost(session.accessJwt, session.did, text.trim());
		return json(result, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
}
