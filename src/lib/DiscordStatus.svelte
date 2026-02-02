<script lang="ts">
	import { onMount } from 'svelte';

	let status: 'online' | 'offline' | 'idle' | 'dnd' = 'offline';
	let loading = true;

	async function fetchStatus() {
		try {
			const response = await fetch('/api/discord-status');
			const data = await response.json();
			status = data.status;
		} catch {
			status = 'offline';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchStatus();
		const interval = setInterval(fetchStatus, 30000);
		return () => clearInterval(interval);
	});

	function getColor(status: string): string {
		switch (status) {
			case 'online':
				return '#23a55a';
			case 'offline':
				return '#80848e';
			case 'idle':
				return '#efb132';
			case 'dnd':
				return '#f23f43';
			default:
				return '#80848e';
		}
	}
</script>

<div class="status-indicator" class:loading aria-label="Discord status: {status}">
	<span class="dot" style="background-color: {getColor(status)}"></span>
	<span class="tooltip">{status}</span>
</div>

<style>
	.status-indicator {
		position: relative;
		display: flex;
		align-items: center;
		font-size: 0.85rem;
		color: var(--white);
		text-transform: lowercase;
		padding: 8px 12px;
		cursor: default;
	}

	.status-indicator.loading {
		opacity: 0.5;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		transition: background-color 0.3s ease;
	}

	.tooltip {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(4px);
		background-color: var(--black, #1a1a1a);
		color: var(--white, #fff);
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.75rem;
		white-space: nowrap;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.2s ease,
			visibility 0.2s ease;
		pointer-events: none;
		z-index: 100;
		border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
	}

	.status-indicator:hover .tooltip {
		opacity: 1;
		visibility: visible;
	}
</style>
