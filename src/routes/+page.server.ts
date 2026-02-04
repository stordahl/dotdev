import type { PageServerLoad } from './$types';
import type { BlueskyPost } from '../lib/types';

const BLUESKY_DID = 'did:plc:6ghbu76mogjyfcvx446mep5o';

export const load: PageServerLoad = async () => {
	try {
		const response = await fetch(
			`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(BLUESKY_DID)}&filter=posts_no_replies&limit=10`,
			{
				headers: {
					Accept: 'application/json'
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Bluesky API responded with ${response.status}`);
		}

		const data = await response.json();

		if (!data.feed || !Array.isArray(data.feed)) {
			throw new Error('Invalid response from Bluesky API');
		}

		interface FeedItem {
			post: { record: { text?: string; embed?: unknown } };
			reason?: unknown;
		}

		const textOnlyPosts: BlueskyPost[] = data.feed
			.filter((item: FeedItem) => {
				const record = item.post?.record;
				if (!record?.text) return false;
				if (record.embed) return false;
				if (item.reason) return false;
				return true;
			})
			.slice(0, 3)
			.map((item: { post: BlueskyPost }) => ({
				uri: item.post.uri,
				cid: item.post.cid,
				author: item.post.author,
				record: {
					text: item.post.record.text,
					createdAt: item.post.record.createdAt
				},
				indexedAt: item.post.indexedAt
			}));

		return { posts: textOnlyPosts };
	} catch (error) {
		console.error('Error fetching Bluesky posts:', error);
		return { posts: [] };
	}
};
