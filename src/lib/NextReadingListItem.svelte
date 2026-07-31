<script lang="ts">
	import type { SembleCard } from './types';

	interface Props {
		item: SembleCard | null;
	}

	let { item }: Props = $props();
</script>

{#if item}
	<a href={item.url} target="_blank" rel="noopener noreferrer">
		<span class="label">next on my reading list: </span>
		<span class="title">{item.title}</span>
		{#if item.author || item.siteName}
			<span class="attribution">&mdash; {item.author || item.siteName}</span>
		{/if}
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

	.label {
		opacity: 0.6;
	}

	.title {
		font-weight: 500;
	}

	.attribution {
		opacity: 0.5;
		font-size: var(--font-xs);
	}
</style>
