import { redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const prerender = false;

export async function load(event) {
	const authenticated = await validateSession(event);

	if (!authenticated) {
		if (event.url.pathname !== '/admin') {
			throw redirect(302, '/admin');
		}
		return { authenticated: false };
	}

	return { authenticated: true };
}
