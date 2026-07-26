<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tabs,
		active = $bindable(tabs[0]?.id),
		onchange,
		children
	}: {
		tabs: { id: string; label: string }[];
		active?: string;
		onchange?: (id: string) => void;
		children: Snippet<[string]>;
	} = $props();

	function setActive(id: string) {
		active = id;
		onchange?.(id);
	}
</script>

<div class="tabs">
	{#each tabs as tab (tab.id)}
		<button class:active={active === tab.id} onclick={() => setActive(tab.id)}>
			{tab.label}
		</button>
	{/each}
</div>
{@render children(active)}

<style>
	.tabs {
		display: flex;
	}

	.tabs button {
		background: none;
		border: none;
		color: var(--light-grey);
		padding: 5px 10px;
	}

	.tabs button:hover {
		cursor: pointer;
	}

	.tabs button.active {
		color: var(--secondary);
		text-decoration: underline;
		text-decoration-style: wavy;
	}
</style>
