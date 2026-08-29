<script lang="ts">
	import type { SliderCardProps } from '../types.js';

	let {
		href,
		blank = false,
		class: className = '',
		header,
		content,
		footer
	}: SliderCardProps = $props();
</script>

{#if href}
	<a
		{href}
		{...blank ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
		class={`card ${className}`.trim()}
	>
		{#if header}
			<header class="card-header">{@render header()}</header>
		{/if}
		<div class="card-content">{@render content()}</div>
		{#if footer}
			<footer class="card-footer">{@render footer()}</footer>
		{/if}
	</a>
{:else}
	<div class={`card ${className}`.trim()}>
		{#if header}
			<header class="card-header">{@render header()}</header>
		{/if}
		<div class="card-content">{@render content()}</div>
		{#if footer}
			<footer class="card-footer">{@render footer()}</footer>
		{/if}
	</div>
{/if}

<style>
	.card {
		flex: 0 0 164px;
		aspect-ratio: 1;
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		padding: 0.75rem 1rem;
		border: 1px solid color-mix(in srgb, var(--white) 20%, transparent);
		border-radius: var(--radius);
		background-color: color-mix(in srgb, var(--secondary) 2%, transparent);
		color: var(--foreground);
		transition: border 0.1s ease-in-out 0s;
		overflow: hidden;
	}

	@media screen and (min-width: 565px) {
		.card {
			flex: 0 0 calc((100% - 2rem) / 3);
		}
	}

	a.card {
		text-decoration: none;
	}

	a.card:hover {
		text-decoration: none;
		border-color: var(--secondary);
	}

	.card-header,
	.card-header > :global(*) {
		letter-spacing: 0.05em;
		font-size: var(--font-xs);
		color: var(--secondary);
		flex-shrink: 0;
	}

	.card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		font-size: var(--font-sm);
	}

	.card-footer {
		justify-self: end;
	}

	.card-footer,
	.card-footer > :global(*) {
		flex-shrink: 0;
		font-size: var(--font-xs);
		color: var(--light-grey);
	}
</style>
