import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

let cachedKey: CryptoKey | null = null;
let cachedSecret: string | null = null;

async function getSigningKey(secret: string): Promise<CryptoKey> {
	if (cachedKey && cachedSecret === secret) return cachedKey;
	const encoder = new TextEncoder();
	cachedKey = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
	cachedSecret = secret;
	return cachedKey;
}

function getSessionSecret(): string {
	// Prefer a dedicated secret, but fall back to admin password so
	// existing deploys don't break immediately. Set SESSION_SECRET in
	// production for proper isolation.
	const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD;
	if (!secret) throw new Error('SESSION_SECRET or ADMIN_PASSWORD must be set');
	return secret;
}

async function signSession(token: string, createdAt: number): Promise<string> {
	const secret = getSessionSecret();
	const key = await getSigningKey(secret);
	const payload = `${token}:${createdAt}`;
	const encoder = new TextEncoder();
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
	const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
	return `${payload}:${sigB64}`;
}

async function verifySession(value: string): Promise<boolean> {
	const parts = value.split(':');
	if (parts.length !== 3) return false;

	const [token, createdAtStr, sigB64] = parts;
	const createdAt = Number(createdAtStr);
	if (!token || !Number.isFinite(createdAt)) return false;
	if (Date.now() - createdAt > SESSION_EXPIRY_MS) return false;

	const secret = getSessionSecret();
	const key = await getSigningKey(secret);
	const payload = `${token}:${createdAt}`;
	const encoder = new TextEncoder();
	const signature = new Uint8Array(
		atob(sigB64)
			.split('')
			.map((c) => c.charCodeAt(0))
	);
	return crypto.subtle.verify('HMAC', key, signature, encoder.encode(payload));
}

export function verifyPassword(password: string): boolean {
	const pw = env.ADMIN_PASSWORD;
	if (!pw) return false;
	return password === pw;
}

export async function createSession(_event: RequestEvent): Promise<string> {
	const token = crypto.randomUUID();
	const createdAt = Date.now();
	return signSession(token, createdAt);
}

export async function validateSession(event: RequestEvent): Promise<boolean> {
	const value = event.cookies.get('admin_token');
	if (!value) return false;
	return verifySession(value);
}

export async function destroySession(event: RequestEvent): Promise<void> {
	event.cookies.delete('admin_token', { path: '/' });
}
