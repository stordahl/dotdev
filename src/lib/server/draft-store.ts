import { dev } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';
import type { Draft } from '$lib/draft-markdown';

class InMemoryDraftStore {
	private drafts = new Map<string, Draft>();

	async list(): Promise<Draft[]> {
		return Array.from(this.drafts.values())
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
	}

	async get(slug: string): Promise<Draft | null> {
		return this.drafts.get(slug) ?? null;
	}

	async put(slug: string, draft: Draft): Promise<void> {
		this.drafts.set(slug, draft);
	}

	async delete(slug: string): Promise<void> {
		this.drafts.delete(slug);
	}
}

class KVDraftStore {
	private kv: { get: (key: string) => Promise<string | null>; put: (key: string, value: string) => Promise<void>; delete: (key: string) => Promise<void>; list: (opts: { prefix: string }) => Promise<{ keys: { name: string }[] }> };

	constructor(kv: typeof KVDraftStore.prototype.kv) {
		this.kv = kv;
	}

	private key(slug: string): string {
		return `draft:${slug}`;
	}

	async list(): Promise<Draft[]> {
		const list = await this.kv.list({ prefix: 'draft:' });
		const drafts: Draft[] = [];
		for (const key of list.keys) {
			const val = await this.kv.get(key.name);
			if (val) drafts.push(JSON.parse(val));
		}
		return drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
	}

	async get(slug: string): Promise<Draft | null> {
		const val = await this.kv.get(this.key(slug));
		return val ? JSON.parse(val) : null;
	}

	async put(slug: string, draft: Draft): Promise<void> {
		await this.kv.put(this.key(slug), JSON.stringify(draft));
	}

	async delete(slug: string): Promise<void> {
		await this.kv.delete(this.key(slug));
	}
}

let devStore: InMemoryDraftStore | null = null;

export function getDraftStore(event: RequestEvent): InMemoryDraftStore | KVDraftStore {
	const platform = event.platform as { env?: { DRAFTS?: { get: (key: string) => Promise<string | null>; put: (key: string, value: string) => Promise<void>; delete: (key: string) => Promise<void>; list: (opts: { prefix: string }) => Promise<{ keys: { name: string }[] }> } } } | undefined;
	const kv = platform?.env?.DRAFTS;
	if (kv) return new KVDraftStore(kv);

	if (!dev) {
		throw new Error('DRAFTS KV binding is not available in production. Check your Cloudflare Pages project settings to ensure the KV namespace is bound.');
	}

	console.warn('DRAFTS KV binding not found, falling back to in-memory store. Drafts will be lost on server restart.');
	if (!devStore) devStore = new InMemoryDraftStore();
	return devStore;
}

export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

