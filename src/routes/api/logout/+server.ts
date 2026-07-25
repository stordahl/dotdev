import { json } from '@sveltejs/kit';
import { destroySession } from '$lib/server/auth';

export async function POST(event) {
	await destroySession(event);
	event.cookies.delete('admin_token', { path: '/' });
	return json({ success: true });
}
