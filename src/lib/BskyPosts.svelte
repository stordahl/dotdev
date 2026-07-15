<script lang="ts">
	import type { BlueskyPost } from './types';

	interface Props {
		posts: BlueskyPost[];
	}

	let { posts }: Props = $props();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
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

{#if posts.length}
	<div class="bsky-posts">
		<h2>Posts</h2>
		<div class="swiper">
			{#each posts as post}
				<a class="card" href={getPostUrl(post.uri)} target="_blank" rel="noopener">
					<div class="text">{@html formatText(post.record.text)}</div>
					<div class="meta">
						<span class="date">{formatDate(post.record.createdAt)}</span>
						<span class="likes">
							<svg
								class="heart"
								viewBox="0 0 24 24"
								width="12"
								height="12"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"
								/>
							</svg>
							{post.likeCount}
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	.bsky-posts {
		margin: auto;
		margin: 30px 0;
		max-width: 800px;
	}

	.bsky-posts h2 {
		margin-bottom: 1rem;
		color: var(--foreground);
		font-size: var(--font-md);
	}

	.swiper {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.5rem;
	}

	.swiper::-webkit-scrollbar {
		height: 6px;
	}

	.swiper::-webkit-scrollbar-track {
		background: transparent;
	}

	.swiper::-webkit-scrollbar-thumb {
		background: var(--light-grey);
		border-radius: 3px;
	}

	.card {
		flex: 0 0 200px;
		height: 200px;
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--white) 20%, transparent);
		border-radius: var(--radius);
		background-color: color-mix(in srgb, var(--secondary) 2%, transparent);
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s;
	}

	.card:hover {
		border-color: var(--secondary);
	}

	.text {
		font-size: var(--font-sm);
		line-height: 1.5;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 7;
		-webkit-box-orient: vertical;
		line-clamp: 7;
		word-break: break-word;
	}

	.text :global(a) {
		color: var(--secondary);
		text-decoration: underline;
		text-decoration-style: wavy;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		justify-content: space-between;
		flex-shrink: 0;
	}

	.likes {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		color: color-mix(in srgb, var(--secondary) 70%, var(--light-grey));
		font-size: var(--font-xs);
	}

	.heart {
		flex-shrink: 0;
	}

	.date {
		color: color-mix(in srgb, var(--secondary) 70%, var(--light-grey));
		font-size: var(--font-xs);
	}
</style>
