import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getBlueskySession, createScrobble } from '$lib/server/bluesky-pds';
import { env } from '$env/dynamic/private';

const BLUESKY_PDS = env.BLUESKY_PDS_URL ?? 'https://bsky.social';

export async function POST(event) {
	if (!(await validateSession(event))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await event.request.json();
	const {
		trackName,
		artistNames,
		artists,
		duration,
		releaseName,
		originUrl,
		musicServiceBaseDomain,
		trackDiscriminant,
		releaseDiscriminant,
		playedTime
	} = body;

	if (!trackName || typeof trackName !== 'string') {
		return json({ error: 'trackName is required' }, { status: 400 });
	}

	try {
		const session = await getBlueskySession();

		const artistObjs = artists?.length
			? artists
			: artistNames?.map((n: string) => ({ artistName: n }));

		const result = await createScrobble(
			session.accessJwt,
			session.did,
			{
				trackName: trackName.trim(),
				artistNames: artistNames?.length ? artistNames : undefined,
				artists: artistObjs?.length ? artistObjs : undefined,
				...(duration != null && { duration: Number(duration) }),
				...(releaseName && { releaseName }),
				...(originUrl && { originUrl }),
				...(musicServiceBaseDomain && { musicServiceBaseDomain }),
				...(trackDiscriminant && { trackDiscriminant }),
				...(releaseDiscriminant && { releaseDiscriminant }),
				...(playedTime && { playedTime })
			},
			BLUESKY_PDS
		);

		return json(result, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
}
