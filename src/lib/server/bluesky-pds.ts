import { env } from '$env/dynamic/private';

const BLUESKY_PDS = env.BLUESKY_PDS_URL ?? 'https://bsky.social';
const NOW_PDS = env.PDS_NOW_URL ?? 'https://now.stordahl.dev';

interface SessionResponse {
	accessJwt: string;
	refreshJwt: string;
	handle: string;
	did: string;
}

interface CreateRecordResponse {
	uri: string;
	cid: string;
}

export interface ScrobbleRecord {
	trackName: string;
	duration?: number;
	artistNames?: string[];
	artists?: { artistName: string; artistMbId?: string }[];
	releaseName?: string;
	releaseMbId?: string;
	isrc?: string;
	originUrl?: string;
	musicServiceBaseDomain?: string;
	submissionClientAgent?: string;
	playedTime?: string;
	trackDiscriminant?: string;
	releaseDiscriminant?: string;
}

async function createPdsSession(
	identifier: string,
	password: string,
	pdsUrl: string
): Promise<SessionResponse> {
	const res = await fetch(`${pdsUrl}/xrpc/com.atproto.server.createSession`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`PDS session error ${res.status}: ${body}`);
	}

	return (await res.json()) as SessionResponse;
}

export async function getBlueskySession(): Promise<SessionResponse> {
	const handle = env.BLUESKY_HANDLE;
	const password = env.BLUESKY_APP_PASSWORD;
	if (!handle || !password) throw new Error('BLUESKY_HANDLE and BLUESKY_APP_PASSWORD must be set');
	return createPdsSession(handle, password, BLUESKY_PDS);
}

export async function getNowSession(): Promise<SessionResponse> {
	const handle = env.PDS_NOW_HANDLE;
	const password = env.PDS_NOW_APP_PASSWORD;
	if (!handle || !password) throw new Error('PDS_NOW_HANDLE and PDS_NOW_APP_PASSWORD must be set');
	return createPdsSession(handle, password, NOW_PDS);
}

export async function createPost(
	accessJwt: string,
	did: string,
	text: string,
	pdsUrl: string
): Promise<CreateRecordResponse> {
	const record = {
		$type: 'app.bsky.feed.post',
		text,
		createdAt: new Date().toISOString()
	};

	const res = await fetch(`${pdsUrl}/xrpc/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessJwt}`
		},
		body: JSON.stringify({
			repo: did,
			collection: 'app.bsky.feed.post',
			record
		})
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`PDS createRecord error ${res.status}: ${body}`);
	}

	return (await res.json()) as CreateRecordResponse;
}

export async function createScrobble(
	accessJwt: string,
	did: string,
	scrobble: ScrobbleRecord,
	pdsUrl: string
): Promise<CreateRecordResponse> {
	const now = new Date().toISOString();
	const record: Record<string, unknown> = {
		$type: 'fm.teal.alpha.feed.play',
		trackName: scrobble.trackName,
		playedTime: scrobble.playedTime ?? now
	};

	if (scrobble.duration) record.duration = scrobble.duration;
	if (scrobble.artists?.length) record.artists = scrobble.artists;
	if (scrobble.artistNames?.length) record.artistNames = scrobble.artistNames;
	if (scrobble.releaseName) record.releaseName = scrobble.releaseName;
	if (scrobble.releaseMbId) record.releaseMbId = scrobble.releaseMbId;
	if (scrobble.isrc) record.isrc = scrobble.isrc;
	if (scrobble.originUrl) record.originUrl = scrobble.originUrl;
	if (scrobble.musicServiceBaseDomain)
		record.musicServiceBaseDomain = scrobble.musicServiceBaseDomain;
	if (scrobble.submissionClientAgent) record.submissionClientAgent = scrobble.submissionClientAgent;
	if (scrobble.trackDiscriminant) record.trackDiscriminant = scrobble.trackDiscriminant;
	if (scrobble.releaseDiscriminant) record.releaseDiscriminant = scrobble.releaseDiscriminant;

	const res = await fetch(`${pdsUrl}/xrpc/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessJwt}`
		},
		body: JSON.stringify({
			repo: did,
			collection: 'fm.teal.alpha.feed.play',
			record
		})
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`PDS createRecord error ${res.status}: ${body}`);
	}

	return (await res.json()) as CreateRecordResponse;
}
