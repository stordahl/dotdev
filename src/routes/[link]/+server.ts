import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const links: Map<string, string> = new Map([
	['bluesky', 'https://bsky.app/profile/stordahl.dev'],
	['github', 'https://github.com/stordahl']
]);

export const GET: RequestHandler = ({ params: { link } }) => {
	return redirect(307, links.get(link) ?? '/404');
};
