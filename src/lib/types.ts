export interface ContributionDay {
	count: number;
	date: string;
}

export interface ContributionWeek {
	days: ContributionDay[];
}

export interface Contributions {
	total: number;
	weeks: ContributionWeek[];
}

export interface BlueskyPost {
	uri: string;
	cid: string;
	author: {
		did: string;
		handle: string;
		displayName?: string;
		avatar?: string;
	};
	record: {
		text: string;
		createdAt: string;
	};
	likeCount: number;
	indexedAt: string;
}

export interface SembleCard {
	url: string;
	title: string;
	author?: string;
	siteName?: string;
	imageUrl?: string;
	description?: string;
	createdAt: string;
}

export interface ScrobbleCard {
	trackName: string;
	artistNames?: string[];
	artists?: { artistName: string; artistMbId?: string }[];
	releaseName?: string;
	originUrl?: string;
	musicServiceBaseDomain?: string;
	playedTime: string;
}
