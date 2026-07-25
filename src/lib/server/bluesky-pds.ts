import { env } from '$env/dynamic/private';

const PDS_URL = env.BLUESKY_PDS_URL ?? 'https://now.stordahl.dev';

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

export async function createPdsSession(identifier: string, password: string): Promise<SessionResponse> {
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
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

export async function createPost(
	accessJwt: string,
	did: string,
	text: string
): Promise<CreateRecordResponse> {
	const record = {
		$type: 'app.bsky.feed.post',
		text,
		createdAt: new Date().toISOString()
	};

	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.createRecord`, {
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
