import type { PageServerLoad } from './$types';
import type { BlueskyPost, Contributions } from '../lib/types';

const BLUESKY_DID = 'did:plc:6ghbu76mogjyfcvx446mep5o';
const GITHUB_USERNAME = 'stordahl';

interface GitHubDay {
	contributionCount: number;
	date: string;
}

interface GitHubWeek {
	contributionDays: GitHubDay[];
}

interface GitHubResponse {
	data?: {
		user?: {
			contributionsCollection?: {
				contributionCalendar?: {
					totalContributions: number;
					weeks: GitHubWeek[];
				};
			};
		};
	};
}

export const load: PageServerLoad = async (event) => {
	const [posts, contributions] = await Promise.all([
		fetchBluesky(),
		fetchGithub(event.platform?.env.GITHUB_TOKEN ?? '')
	]);
	return { posts, contributions };
};

async function fetchBluesky(): Promise<BlueskyPost[]> {
	try {
		const response = await fetch(
			`https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(BLUESKY_DID)}&filter=posts_no_replies&limit=30`,
			{ headers: { Accept: 'application/json' } }
		);

		if (!response.ok) throw new Error(`Bluesky API responded with ${response.status}`);

		const data = await response.json();
		if (!data.feed || !Array.isArray(data.feed)) throw new Error('Invalid response from Bluesky API');

		const textOnlyPosts: BlueskyPost[] = data.feed
			.filter((item: { post: { record: { text?: string; embed?: unknown } }; reason?: unknown }) => {
				const record = item.post?.record;
				if (!record?.text) return false;
				if (record.embed) return false;
				if (item.reason) return false;
				return true;
			})
			.slice(0, 5)
			.map((item: { post: BlueskyPost & { likeCount?: number } }) => ({
				uri: item.post.uri,
				cid: item.post.cid,
				author: item.post.author,
				record: { text: item.post.record.text, createdAt: item.post.record.createdAt },
				likeCount: item.post.likeCount ?? 0,
				indexedAt: item.post.indexedAt
			}));

		return textOnlyPosts;
	} catch (error) {
		console.error('Error fetching Bluesky posts:', error);
		return [];
	}
}

async function fetchGithub(token: string): Promise<Contributions | null> {
	if (!token) {
		console.warn('GITHUB_TOKEN not set — skipping contribution graph');
		return null;
	}

	const year = new Date().getFullYear();
	const from = `${year}-01-01T00:00:00Z`;
	const to = `${year}-12-31T23:59:59Z`;

	const query = `
		query($username: String!, $from: DateTime!, $to: DateTime) {
			user(login: $username) {
				contributionsCollection(from: $from, to: $to) {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
							}
						}
					}
				}
			}
		}
	`;

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query, variables: { username: GITHUB_USERNAME, from, to } })
		});

		if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);

		const json: GitHubResponse = await response.json();
		const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;

		if (!calendar) throw new Error('Invalid GitHub API response');

		return {
			total: calendar.totalContributions,
			weeks: calendar.weeks.map((w) => ({
				days: w.contributionDays.map((d) => ({ count: d.contributionCount, date: d.date }))
			}))
		};
	} catch (error) {
		console.error('Error fetching GitHub contributions:', error);
		return null;
	}
}
