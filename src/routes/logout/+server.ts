import { redirect } from '@sveltejs/kit';
import { destroySession } from '$lib/server/auth';

export async function GET(event) {
	await destroySession(event);
	throw redirect(302, '/');
}
