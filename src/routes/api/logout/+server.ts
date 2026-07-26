import { json } from '@sveltejs/kit';
import { destroySession } from '$lib/server/auth';

export async function POST(event) {
	await destroySession(event);
	return json({ success: true });
}
