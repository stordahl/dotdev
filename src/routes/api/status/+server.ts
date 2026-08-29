import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getNowSession, createPost } from '$lib/server/bluesky-pds';
import { env } from '$env/dynamic/private';

const NOW_PDS = env.PDS_NOW_URL ?? 'https://now.stordahl.dev';

export async function POST(event) {
	if (!(await validateSession(event))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { text } = await event.request.json();
	if (!text || typeof text !== 'string') {
		return json({ error: 'Text is required' }, { status: 400 });
	}

	try {
		const session = await getNowSession();
		const result = await createPost(session.accessJwt, session.did, text.trim(), NOW_PDS);
		return json(result, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
}
