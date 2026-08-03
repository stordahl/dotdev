<script lang="ts">
	import type { SembleCard } from './types';
	import { Slider } from './Slider/index.js';

	interface Props {
		item: SembleCard | null;
	}

	let { item }: Props = $props();
</script>

{#if item}
	<Slider.Card href={item.url} blank>
		{#snippet header()}
			reading
		{/snippet}
		{#snippet content()}
			<span class="title">{item.title}</span>
		{/snippet}
		{#snippet footer()}
			{#if item.author || item.siteName}
				<span class="attribution">by {item.author || item.siteName}</span>
			{/if}
		{/snippet}
	</Slider.Card>
{/if}
