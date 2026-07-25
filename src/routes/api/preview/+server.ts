import { json } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { compileMarkdown } from '@content-collections/markdown';
import remarkGfm from 'remark-gfm';
import rehypeShiki from '@shikijs/rehype';

export async function POST(event) {
	if (!await validateSession(event)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { markdown } = await event.request.json();
	if (!markdown) return json({ error: 'markdown is required' }, { status: 400 });

	try {
		const cacheMap = new Map<string, unknown>();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const cacheFn: any = async (input: unknown, compute: (input: unknown) => unknown) => {
			const key = JSON.stringify(input);
			if (!cacheMap.has(key)) cacheMap.set(key, await compute(input));
			return cacheMap.get(key);
		};
		const html = await compileMarkdown(
			{ cache: cacheFn },
			{ _meta: { directory: '', filePath: '', fileName: '', path: '', extension: '' }, content: markdown },
			{
				remarkPlugins: [remarkGfm],
				rehypePlugins: [[rehypeShiki, {
					themes: {
						light: 'github-light',
						dark: 'github-dark'
					}
				}]]
			}
		);
		return json({ html });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Compilation failed';
		return json({ error: message }, { status: 500 });
	}
}
