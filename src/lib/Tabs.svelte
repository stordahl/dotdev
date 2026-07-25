<script lang="ts">
	let {
		tabs,
		active = $bindable(tabs[0]?.id),
		onchange,
		children
	}: {
		tabs: { id: string; label: string }[];
		active?: string;
		onchange?: (id: string) => void;
		children: (active: string) => void;
	} = $props();

	let current = $state(active);

	$effect(() => {
		active = current;
	});

	$effect(() => {
		current = active;
	});

	function setActive(id: string) {
		current = id;
		onchange?.(id);
	}
</script>

<div class="tabs">
	{#each tabs as tab (tab.id)}
		<button class:active={current === tab.id} onclick={() => setActive(tab.id)}>
			{tab.label}
		</button>
	{/each}
</div>
{@render children(current)}

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
