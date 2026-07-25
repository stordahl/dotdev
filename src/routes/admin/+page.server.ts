import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { verifyPassword, createSession, validateSession } from '$lib/server/auth';
import { getDraftStore } from '$lib/server/draft-store';

export async function load(event) {
	const authenticated = await validateSession(event);

	if (!authenticated) {
		return { authenticated: false, drafts: [] };
	}

	const store = getDraftStore(event);
	const drafts = await store.list();
	return { authenticated: true, drafts };
}

export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const password = data.get('password');

		if (!password || !verifyPassword(String(password))) {
			return fail(401, { error: 'Invalid password' });
		}

		const token = await createSession(event);

		event.cookies.set('admin_token', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24
		});

		throw redirect(302, '/admin');
	}
};
