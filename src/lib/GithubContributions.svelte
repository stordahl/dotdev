<script lang="ts">
	import type { Contributions } from './types';

	interface Props {
		contributions: Contributions;
	}

	let { contributions }: Props = $props();

	const CELL = 12;
	const RADIUS = 3;
	const GAP = 3;
	const STEP = CELL + GAP;
	const PAD = 4;

	let width = $derived(PAD + contributions.weeks.length * STEP + GAP);
	let height = $derived(PAD + 7 * STEP + PAD);

	function level(count: number): number {
		if (count === 0) return 0;
		if (count <= 3) return 1;
		if (count <= 6) return 2;
		if (count <= 10) return 3;
		return 4;
	}
</script>

{#if contributions.weeks.length}
	<a class="graph" href="https://github.com/stordahl" target="_blank" rel="noopener">
		<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
			{#each contributions.weeks as week, w}
				{#each week.days as day, d}
					<rect
						x={PAD + w * STEP}
						y={PAD + d * STEP}
						width={CELL}
						height={CELL}
						rx={RADIUS}
						style="fill: var(--secondary); opacity: {0.08 + level(day.count) * 0.23}"
					/>
				{/each}
			{/each}
		</svg>
	</a>
{/if}

<style>
	.graph {
		display: block;
		margin: 30px auto;
		max-width: 800px;
	}

	.graph svg {
		width: 100%;
		height: auto;
	}
</style>
