<script lang="ts">
	import type { BlueskyPost } from './types';

	interface Props {
		post: BlueskyPost | null;
	}

	let { post }: Props = $props();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function getPostUrl(uri: string): string {
		const match = uri.match(/at:\/\/([^/]+)\/app\.bsky\.feed\.post\/(.+)/);
		if (match) {
			return `https://bsky.app/profile/${match[1]}/post/${match[2]}`;
		}
		return 'https://bsky.app';
	}
</script>

{#if post}
	<div class="now-status">
		<span class="label">status: </span>
		<a href={getPostUrl(post.uri)} target="_blank" rel="noopener" class="text">
			{post.record.text}
		</a>
		<span class="time">{formatDate(post.record.createdAt)}</span>
	</div>
{/if}

<style>
	.now-status {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		border: 1px solid color-mix(in srgb, var(--white) 20%, transparent);
		background-color: color-mix(in srgb, var(--secondary) 2%, transparent);
	}

	.label {
		font-size: var(--font-xs);
		opacity: 0.6;
		font-weight: 600;
	}

	.text {
		color: inherit;
		text-decoration: none;
		font-size: var(--font-sm);
	}

	.text:hover {
		text-decoration: underline;
		text-decoration-style: wavy;
	}

	.time {
		font-size: var(--font-xs);
		opacity: 0.5;
		margin-left: auto;
	}
</style>
