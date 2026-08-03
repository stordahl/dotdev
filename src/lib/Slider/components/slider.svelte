<script lang="ts">
	import type { SliderRootProps } from '../types.js';

	let { class: className = '', children }: SliderRootProps = $props();
</script>

<div class={`slider ${className}`.trim()}>
	{@render children?.()}
</div>

<style>
	.slider {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.5rem;
	}

	.slider::-webkit-scrollbar {
		height: 6px;
	}

	.slider::-webkit-scrollbar-track {
		background: transparent;
	}

	.slider::-webkit-scrollbar-thumb {
		background: var(--light-grey);
		border-radius: 3px;
	}
</style>
