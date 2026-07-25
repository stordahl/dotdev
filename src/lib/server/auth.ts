import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

interface Session {
	token: string;
	createdAt: number;
}

class InMemorySessionStore {
	private sessions = new Map<string, Session>();

	create(): string {
		const token = crypto.randomUUID();
		this.sessions.set(token, { token, createdAt: Date.now() });
		return token;
	}

	validate(token: string): boolean {
		const session = this.sessions.get(token);
		if (!session) return false;
		if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
			this.sessions.delete(token);
			return false;
		}
		return true;
	}

	delete(token: string): void {
		this.sessions.delete(token);
	}
}

let devStore = new InMemorySessionStore();

interface KVLike {
	get: (key: string) => Promise<string | null>;
	put: (key: string, value: string) => Promise<void>;
	delete: (key: string) => Promise<void>;
	list: (opts: { prefix: string }) => Promise<{ keys: { name: string }[] }>;
}

function getKV(event: RequestEvent): KVLike | null {
	const platform = event.platform as { env?: { DRAFTS?: KVLike } } | undefined;
	return platform?.env?.DRAFTS ?? null;
}

function getTokenFromCookie(cookie: string): string | undefined {
	let token: string | undefined;
	for (const part of cookie.split(';')) {
		const [name, ...rest] = part.trim().split('=');
		if (name === 'admin_token') {
			token = rest.join('=');
			break;
		}
	}
	return token;
}

export function verifyPassword(password: string): boolean {
	const pw = env.ADMIN_PASSWORD;
	if (!pw) return false;
	return password === pw;
}

export async function createSession(event: RequestEvent): Promise<string> {
	const kv = getKV(event);
	if (kv) {
		const token = crypto.randomUUID();
		await kv.put(`session:${token}`, JSON.stringify({ token, createdAt: Date.now() }));
		return token;
	}
	return devStore.create();
}

export async function validateSession(event: RequestEvent): Promise<boolean> {
	const cookie = event.request.headers.get('cookie');
	if (!cookie) return false;

	const token = getTokenFromCookie(cookie);
	if (!token) return false;

	const kv = getKV(event);
	if (kv) {
		const val = await kv.get(`session:${token}`);
		if (!val) return false;
		try {
			const session = JSON.parse(val) as Session;
			if (Date.now() - session.createdAt > SESSION_EXPIRY_MS) {
				await kv.delete(`session:${token}`);
				return false;
			}
			return true;
		} catch {
			return false;
		}
	}

	return devStore.validate(token);
}

export async function destroySession(event: RequestEvent): Promise<void> {
	const cookie = event.request.headers.get('cookie');
	if (!cookie) return;

	const token = getTokenFromCookie(cookie);
	if (!token) return;

	const kv = getKV(event);
	if (kv) {
		await kv.delete(`session:${token}`);
	} else {
		devStore.delete(token);
	}
}
