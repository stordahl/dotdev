export interface TrackInfo {
	trackName: string;
	artistNames: string[];
	duration?: number;
	releaseName?: string;
	originUrl: string;
	musicServiceBaseDomain: string;
}

function parseUrl(url: string): URL | null {
	try {
		return new URL(url);
	} catch {
		return null;
	}
}

function getServiceDomain(url: string): string | null {
	const parsed = parseUrl(url);
	if (!parsed) return null;
	const host = parsed.hostname.toLowerCase();

	if (host === 'www.youtube.com' || host === 'youtube.com' || host === 'm.youtube.com')
		return 'youtube.com';
	if (host === 'music.youtube.com') return 'music.youtube.com';
	if (host === 'music.apple.com') return 'music.apple.com';
	if (host === 'open.spotify.com') return 'spotify.com';
	if (host === 'tidal.com' || host === 'listen.tidal.com') return 'tidal.com';
	if (host === 'soundcloud.com' || host === 'www.soundcloud.com') return 'soundcloud.com';

	return null;
}

function parseArtistTitle(title: string): { trackName: string; artistNames: string[] } {
	const dashIdx = title.indexOf(' - ');

	let trackName = title;
	let artistNames: string[] = [];

	if (dashIdx > 0) {
		artistNames = [title.slice(0, dashIdx).trim()];
		trackName = title.slice(dashIdx + 3).trim();
	}

	const paren = trackName.match(/^(.*?)\s*[\(\[]/);
	if (paren) trackName = paren[1].trim();

	return { trackName, artistNames };
}

async function resolveYouTube(url: string): Promise<TrackInfo | null> {
	const encoded = encodeURIComponent(url);
	const oembedUrl = `https://www.youtube.com/oembed?url=${encoded}&format=json`;

	try {
		const res = await fetch(oembedUrl);
		if (!res.ok) return null;
		const data = (await res.json()) as { title?: string };

		if (!data.title) return null;

		const { trackName, artistNames } = parseArtistTitle(data.title);
		return { trackName, artistNames, originUrl: url, musicServiceBaseDomain: 'youtube.com' };
	} catch {
		return null;
	}
}

async function resolveSoundCloud(url: string): Promise<TrackInfo | null> {
	const encoded = encodeURIComponent(url);
	const oembedUrl = `https://soundcloud.com/oembed?url=${encoded}&format=json`;

	try {
		const res = await fetch(oembedUrl);
		if (!res.ok) return null;
		const data = (await res.json()) as { title?: string };

		if (!data.title) return null;

		const { trackName, artistNames } = parseArtistTitle(data.title);
		return { trackName, artistNames, originUrl: url, musicServiceBaseDomain: 'soundcloud.com' };
	} catch {
		return null;
	}
}

async function resolveAppleMusic(url: string): Promise<TrackInfo | null> {
	const parsed = parseUrl(url);
	if (!parsed) return null;

	let trackName = '';
	let artistNames: string[] = [];
	let releaseName: string | undefined;

	const pathSegments = parsed.pathname.split('/').filter(Boolean);

	if (pathSegments.length >= 4 && pathSegments[1] === 'album') {
		const albumSlug = pathSegments[2].replace(/-/g, ' ');
		const songSlug = pathSegments[3].replace(/-/g, ' ');

		trackName = toTitleCase(songSlug);
		releaseName = toTitleCase(albumSlug);
	} else if (pathSegments.length >= 2 && pathSegments[1] === 'song') {
		const songSlug = pathSegments[2].replace(/-/g, ' ');
		trackName = toTitleCase(songSlug);
	}

	const searchTerm = trackName ? trackName.split(/[\(\[]/)[0].trim() : '';
	if (searchTerm) {
		try {
			const query = encodeURIComponent(searchTerm);
			const itunesRes = await fetch(
				`https://itunes.apple.com/search?term=${query}&entity=song&limit=3`
			);
			if (itunesRes.ok) {
				const data = (await itunesRes.json()) as {
					results?: {
						trackName?: string;
						artistName?: string;
						collectionName?: string;
						trackTimeMillis?: number;
					}[];
				};
				if (data.results?.length) {
					const match =
						data.results.find((r) => r.trackName?.toLowerCase() === searchTerm.toLowerCase()) ??
						data.results[0];
					trackName = match.trackName ?? trackName;
					if (match.artistName) artistNames = [match.artistName];
					releaseName = match.collectionName ?? releaseName;
				}
			}
		} catch {
			// fall through with slug-parsed data
		}
	}

	if (!trackName) return null;

	return {
		trackName,
		artistNames,
		releaseName,
		originUrl: url,
		musicServiceBaseDomain: 'music.apple.com'
	};
}

function toTitleCase(s: string): string {
	return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function resolveTrack(url: string): Promise<TrackInfo | null> {
	const domain = getServiceDomain(url);
	if (!domain) return null;

	if (domain === 'youtube.com' || domain === 'music.youtube.com') {
		return resolveYouTube(url);
	}

	if (domain === 'music.apple.com') {
		return resolveAppleMusic(url);
	}

	if (domain === 'soundcloud.com') {
		return resolveSoundCloud(url);
	}

	return null;
}
