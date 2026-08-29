<script lang="ts">
	import { getPostUrl } from './utils';
	import type { BlueskyPost } from './types';
	import { Slider } from './Slider/index.js';
	import Heart from './icons/Heart.svelte';

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

	function formatText(text: string): string {
		return text
			.replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" rel="noopener">$&</a>')
			.replace(/@([a-zA-Z0-9.-]+\.bsky\.social)/g, '<a href="https://bsky.app/profile/$1">@$1</a>');
	}
</script>

{#if posts.length}
	<div class="bsky-posts">
		<h2>Posts</h2>
		<Slider.Root>
			{#each posts as post}
				<Slider.Card href={getPostUrl(post.uri)} blank>
					{#snippet content()}
						<div class="text">{@html formatText(post.record.text)}</div>
					{/snippet}
					{#snippet footer()}
						<div class="meta">
							<span class="date">{formatDate(post.record.createdAt)}</span>
							<span class="likes">
								<Heart />
								{post.likeCount}
							</span>
						</div>
					{/snippet}
				</Slider.Card>
			{/each}
		</Slider.Root>
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
		font-size: var(--font-sm);
	}

	.text {
		font-size: var(--font-xs);
		line-height: 1.3;
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

	.date {
		color: color-mix(in srgb, var(--secondary) 70%, var(--light-grey));
		font-size: var(--font-xs);
	}
</style>
