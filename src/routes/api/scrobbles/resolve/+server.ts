import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { resolveTrack } from '$lib/server/resolve-track';

export async function POST(event) {
	if (!(await validateSession(event))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { url } = await event.request.json();
	if (!url || typeof url !== 'string') {
		return json({ error: 'URL is required' }, { status: 400 });
	}

	try {
		const info = await resolveTrack(url.trim());
		if (!info) {
			return json({ error: 'Could not resolve track from URL' }, { status: 422 });
		}
		return json(info);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
}
