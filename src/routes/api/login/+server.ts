import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { verifyPassword, createSession } from '$lib/server/auth';

export async function POST(event) {
	const { password } = await event.request.json();

	if (!verifyPassword(password)) {
		return json({ error: 'Invalid password' }, { status: 401 });
	}

	const token = await createSession(event);

	event.cookies.set('admin_token', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24
	});

	return json({ success: true });
}
