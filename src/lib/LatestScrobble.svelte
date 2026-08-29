<script lang="ts">
	import type { ScrobbleCard } from './types';
	import { Slider } from './Slider/index.js';

	interface Props {
		scrobble: ScrobbleCard | null;
	}

	let { scrobble }: Props = $props();

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

		if (diffDays === 0) return `today at ${timeStr}`;
		if (diffDays === 1) return `yesterday at ${timeStr}`;
		if (diffDays > 1 && diffDays <= 7) {
			const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
			return `${dayName} at ${timeStr}`;
		}

		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	const artistStr = $derived(
		scrobble?.artists?.length
			? scrobble.artists.map((a) => a.artistName).join(', ')
			: scrobble?.artistNames?.join(', ')
	);
</script>

{#if scrobble}
	<Slider.Card href={scrobble.originUrl} blank>
		{#snippet header()}
			listening
		{/snippet}
		{#snippet content()}
			<span>{scrobble.trackName}</span>
			{#if artistStr}
				<span>&mdash; {artistStr}</span>
			{/if}
		{/snippet}
		{#snippet footer()}
			<span>{formatDate(scrobble.playedTime)}</span>
		{/snippet}
	</Slider.Card>
{/if}
