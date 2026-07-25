import type { PageServerLoad } from './$types';
import type { BlueskyPost, Contributions } from '../lib/types';
import { env } from '$env/dynamic/private';

const BLUESKY_DID = 'did:plc:6ghbu76mogjyfcvx446mep5o';
const BLUESKY_STATUS_HANDLE = 'now.stordahl.dev';
const BLUESKY_STATUS_DID = 'did:plc:aztiyk6whivsi4q7tqji6fz4';
const BLUESKY_PDS_URL = env.BLUESKY_PDS_URL ?? 'https://now.stordahl.dev';
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

export const load: PageServerLoad = async () => {
  const [posts, contributions, status] = await Promise.all([
    fetchBluesky(),
    fetchGithub(),
    fetchLatestStatus()
  ]);
  return { posts, contributions, status };
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

async function fetchLatestStatus(): Promise<BlueskyPost | null> {
  try {
    // Fetch records in reverse chronological order directly from the PDS.
    // `reverse=true` returns newest first; we grab the first one.
    const listRes = await fetch(
      `${BLUESKY_PDS_URL}/xrpc/com.atproto.repo.listRecords?repo=${encodeURIComponent(BLUESKY_STATUS_DID)}&collection=app.bsky.feed.post&reverse=true`,
      { headers: { Accept: 'application/json' } }
    );
    if (!listRes.ok) throw new Error(`listRecords ${listRes.status}`);

    const listData = (await listRes.json()) as {
      records?: { uri: string; cid: string; value: { text?: string; createdAt?: string } }[];
    };
    console.log(listRes)
    const record = listData.records?.[0];
    if (!record?.value?.text || !record.value.createdAt) return null;

    return {
      uri: record.uri,
      cid: record.cid,
      author: { did: BLUESKY_STATUS_DID, handle: BLUESKY_STATUS_HANDLE },
      record: { text: record.value.text, createdAt: record.value.createdAt },
      likeCount: 0,
      indexedAt: record.value.createdAt
    };
  } catch (error) {
    console.error('Error fetching latest status:', error);
    return null;
  }
}

async function fetchGithub(): Promise<Contributions | null> {
  const token = env.GITHUB_TOKEN;
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
        'Content-Type': 'application/json',
        'User-Agent': 'dotdev'
      },
      body: JSON.stringify({ query, variables: { username: GITHUB_USERNAME, from, to } })
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`GitHub API ${response.status}: ${body}`);
      throw new Error(`GitHub API responded with ${response.status}: ${body.slice(0, 200)}`);
    }

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
