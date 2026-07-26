<script lang="ts">
	import { getPostUrl } from './utils';
	import type { BlueskyPost } from './types';

	interface Props {
		post: BlueskyPost | null;
	}

	let { post }: Props = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();

		const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		const diffTime = nowDay.getTime() - dateDay.getTime();
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

		const timeStr = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});

		if (diffDays === 0) {
			return `today at ${timeStr}`;
		} else if (diffDays === 1) {
			return `yesterday at ${timeStr}`;
		} else if (diffDays > 1 && diffDays <= 7) {
			return `last week at ${timeStr}`;
		}

		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

{#if post}
	<a href={getPostUrl(post.uri)} target="_blank">
		<span class="label">status: </span>
		{post.record.text}
		<span class="time">{formatDate(post.record.createdAt)}</span>
	</a>
{/if}

<style>
	a {
		display: flex;
		align-items: baseline;
		gap: 5px;
		flex-wrap: wrap;
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius);
		border: 1px solid color-mix(in srgb, var(--white) 20%, transparent);
		background-color: color-mix(in srgb, var(--secondary) 2%, transparent);
		font-size: var(--font-xs);
		color: var(--foreground);
		transition: border 0.1s ease-in-out 0s;
	}

	a:hover {
		text-decoration: none;
		border: 1px solid color-mix(in srgb, var(--secondary) 60%, transparent);
	}

	.label,
	.time {
		opacity: 0.6;
	}

	.time {
		margin-left: auto;
	}
</style>
