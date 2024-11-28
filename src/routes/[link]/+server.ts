import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const links: Map<string, string> = new Map([
  ["bluesky", "https://bsky.app/profile/stordahl.dev"],
  ["github", "https://github.com/stordahl"],
  ["twitter", "https://twitter.com/stordahldotdev"],
  ["x", "https://twitter.com/stordahldotdev"],
]);

export const GET: RequestHandler = ({ params: { link } }) => {
  return redirect(307, links.get(link) ?? "/404");
};

