<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BlueskyPost } from './types';

	interface Props {
		posts: BlueskyPost[];
	}

	let { posts }: Props = $props();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getPostUrl(uri: string): string {
		const match = uri.match(/at:\/\/([^/]+)\/app\.bsky\.feed\.post\/(.+)/);
		if (match) {
			return `https://bsky.app/profile/${match[1]}/post/${match[2]}`;
		}
		return 'https://bsky.app';
	}

	function formatText(text: string): string {
		return text
			.replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" rel="noopener">$&</a>')
			.replace(/@([a-zA-Z0-9.-]+\.bsky\.social)/g, '<a href="https://bsky.app/profile/$1">@$1</a>');
	}
</script>

<div class="bsky-posts">
	<h2>Recent Posts</h2>

	{#if posts.length === 0}
		<div class="placeholder">No posts yet</div>
	{:else}
		<div class="post-list">
			{#each posts as post}
				<a class="post" href={getPostUrl(post.uri)} target="_blank" rel="noopener">
					<div class="content">
						<p class="text">{@html formatText(post.record.text)}</p>
						<span class="date">{formatDate(post.record.createdAt)}</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.bsky-posts {
		margin: auto;
		margin-top: 2rem;
		max-width: 800px;
	}

	.bsky-posts h2 {
		margin-bottom: 1rem;
		color: var(--white);
		font-size: clamp(1.75rem, calc(1.75rem + 2vw), 2.5rem);
	}

	.placeholder {
		color: var(--grey);
		font-size: 0.9rem;
		padding: 1rem 0;
	}

	.post-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.post {
		display: block;
		padding: 0.8rem;
		transition: padding 0.2s ease;
		text-decoration: none;
		color: inherit;
	}

	.post:hover {
		background-color: rgba(255, 255, 255, 0.03);
	}

	.text {
		color: var(--white);
		font-size: 1.2rem;
		line-height: 1.5;
		margin: 0;
		margin-bottom: 0.5rem;
	}

	.date {
		color: color-mix(in srgb, var(--orange) 70%, var(--light-grey));
		font-size: 0.85rem;
	}

	.post:hover::after {
		display: none;
		width: 0;
	}
</style>
