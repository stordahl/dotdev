import type { PageServerLoad } from './$types';
import type { BlueskyPost, Contributions, SembleCard, ScrobbleCard } from '../lib/types';
import { env } from '$env/dynamic/private';

const BLUESKY_DID = 'did:plc:6ghbu76mogjyfcvx446mep5o';
const BLUESKY_HANDLE = 'stordahl.dev';
const BLUESKY_STATUS_HANDLE = 'now.stordahl.dev';
const BLUESKY_STATUS_DID = 'did:plc:aztiyk6whivsi4q7tqji6fz4';
const BLUESKY_PDS_URL = env.BLUESKY_PDS_URL ?? 'https://now.stordahl.dev';
const GITHUB_USERNAME = 'stordahl';
const SEMBLE_COLLECTION_ID = '3mrv5hzbfdz27';
const SEMBLE_HANDLE = 'stordahl.dev';

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
  const [posts, contributions, status, readingListItem, latestScrobble] = await Promise.all([
    fetchBluesky(),
    fetchGithub(),
    fetchLatestStatus(),
    fetchReadingListItem(),
    fetchLatestScrobble()
  ]);
  return { posts, contributions, status, readingListItem, latestScrobble };
};

async function fetchBluesky(): Promise<BlueskyPost[]> {
  try {
    const response = await fetch(
      `https://api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(BLUESKY_DID)}&filter=posts_no_replies&limit=30`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) throw new Error(`Bluesky API responded with ${response.status}`);

    const data = await response.json();
    if (!data.feed || !Array.isArray(data.feed))
      throw new Error('Invalid response from Bluesky API');

    const textOnlyPosts: BlueskyPost[] = data.feed
      .filter(
        (item: { post: { record: { text?: string; embed?: unknown } }; reason?: unknown }) => {
          const record = item.post?.record;
          if (!record?.text) return false;
          if (record.embed) return false;
          if (item.reason) return false;
          return true;
        }
      )
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
    // Fetch ALL records from the PDS using forward pagination.
    // reverse=true has a severe pagination bug on this PDS (drops newest
    // records with small limits; limit=1 returns posts from 2025). The
    // Bluesky AppView is also stale for this account. Forward pagination
    // (reverse=false) is the only reliable approach.
    const seen = new Set<string>();
    const records: { uri: string; cid: string; value: { text?: string; createdAt?: string } }[] =
      [];
    let cursor: string | undefined;

    do {
      const url = new URL(`${BLUESKY_PDS_URL}/xrpc/com.atproto.repo.listRecords`);
      url.searchParams.set('repo', BLUESKY_STATUS_DID);
      url.searchParams.set('collection', 'app.bsky.feed.post');
      url.searchParams.set('limit', '50');
      if (cursor) url.searchParams.set('cursor', cursor);

      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`listRecords ${res.status}`);

      const data = (await res.json()) as {
        records?: { uri: string; cid: string; value: { text?: string; createdAt?: string } }[];
        cursor?: string;
      };

      for (const r of data.records || []) {
        if (!seen.has(r.uri)) {
          seen.add(r.uri);
          records.push(r);
        }
      }
      cursor = data.cursor;
    } while (cursor);

    if (records.length === 0) return null;

    // Sort by createdAt descending and pick the latest.
    // createdAt is client-set, but for status posts it's accurate enough.
    const latest = records.sort(
      (a, b) =>
        new Date(b.value.createdAt || 0).getTime() - new Date(a.value.createdAt || 0).getTime()
    )[0];

    if (!latest.value?.text || !latest.value.createdAt) return null;

    return {
      uri: latest.uri,
      cid: latest.cid,
      author: { did: BLUESKY_STATUS_DID, handle: BLUESKY_STATUS_HANDLE },
      record: { text: latest.value.text, createdAt: latest.value.createdAt },
      likeCount: 0,
      indexedAt: latest.value.createdAt
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

async function fetchReadingListItem(): Promise<SembleCard | null> {
  const apiKey = env.SEMBLE_API_KEY;
  if (!apiKey) {
    console.warn('SEMBLE_API_KEY not set — skipping reading list');
    return null;
  }

  try {
    const url = new URL('https://api.semble.so/xrpc/network.cosmik.collection.getByAtUri');
    url.searchParams.set('handle', SEMBLE_HANDLE);
    url.searchParams.set('recordKey', SEMBLE_COLLECTION_ID);
    url.searchParams.set('sortBy', 'createdAt');
    url.searchParams.set('sortOrder', 'asc');
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'X-API-Key': apiKey
      }
    });

    if (!response.ok) throw new Error(`Semble API responded with ${response.status}`);

    const data = await response.json();

    if (!data.urlCards?.length) return null;

    const card = data.urlCards[0];
    const content = card.cardContent ?? {};

    return {
      url: content.url ?? card.url ?? '',
      title: content.title ?? '',
      author: content.author,
      siteName: content.siteName,
      imageUrl: content.imageUrl,
      description: content.description,
      createdAt: card.createdAt ?? ''
    };
  } catch (error) {
    console.error('Error fetching Semble reading list:', error);
    return null;
  }
}

async function fetchLatestScrobble(): Promise<ScrobbleCard | null> {
  try {
    console.log('[scrobble] resolving handle:', BLUESKY_HANDLE);
    const resolveUrl = `https://api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(BLUESKY_HANDLE)}`;
    const resolveRes = await fetch(resolveUrl, { headers: { Accept: 'application/json' } });
    console.log('[scrobble] resolveHandle status:', resolveRes.status);
    if (!resolveRes.ok) {
      const body = await resolveRes.text();
      console.error('[scrobble] resolveHandle error body:', body);
      throw new Error(`resolveHandle ${resolveRes.status}`);
    }
    const resolved = await resolveRes.json();
    const did = resolved.did as string;
    console.log('[scrobble] resolved DID:', did);

    const listUrl = new URL('https://bsky.social/xrpc/com.atproto.repo.listRecords');
    listUrl.searchParams.set('repo', did);
    listUrl.searchParams.set('collection', 'fm.teal.alpha.feed.play');
    listUrl.searchParams.set('limit', '1');
    listUrl.searchParams.set('reverse', 'false');
    console.log('[scrobble] listRecords URL:', listUrl.toString());

    const res = await fetch(listUrl.toString(), { headers: { Accept: 'application/json' } });
    console.log('[scrobble] listRecords status:', res.status);
    const body = await res.text();
    console.log('[scrobble] listRecords body:', body);

    if (!res.ok) throw new Error(`listRecords ${res.status}`);

    const data = JSON.parse(body) as {
      records?: { value: ScrobbleCard }[];
    };

    console.log('[scrobble] record count:', data.records?.length ?? 0);
    if (data.records?.length) {
      console.log('[scrobble] first record value:', JSON.stringify(data.records[0].value));
    }

    if (!data.records?.length) return null;

    const record = data.records[0].value;
    return record;
  } catch (error) {
    console.error('[scrobble] error:', error);
    return null;
  }
}
