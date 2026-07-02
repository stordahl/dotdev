<script lang="ts">
	import { theme, themes, setTheme, setMode } from '$lib/stores/theme.svelte';
	import type { ThemeMode } from '$lib/stores/theme.svelte';

	let open = $state(false);

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		open = !open;
	}

	function selectColor(e: MouseEvent, name: string) {
		e.stopPropagation();
		setTheme(name);
	}

	function selectMode(e: MouseEvent, mode: ThemeMode) {
		e.stopPropagation();
		setMode(mode);
	}

	function closeOnOutside() {
		open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
		}
	}

	const modes: { value: ThemeMode; label: string }[] = [
		{ value: 'system', label: 'System' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];
</script>

<svelte:window onclick={closeOnOutside} onkeydown={handleKeydown} />

<div class="theme-picker">
	<button
		class="trigger"
		onclick={toggle}
		aria-label="Select theme"
		aria-haspopup="true"
		aria-expanded={open}
	></button>

	{#if open}
		<div class="dropdown" role="menu">
			<div class="section">
				<span class="label">Accent</span>
				<div class="accent-row">
					{#each Object.entries(themes) as [name, t]}
						<button
							class="dot"
							class:active={name === theme.current}
							style="background-color: {t.color}"
							onclick={(e) => selectColor(e, name)}
							aria-label={t.label}
							role="menuitemradio"
							aria-checked={name === theme.current}
						></button>
					{/each}
				</div>
			</div>

			<div class="divider" role="separator"></div>

			<div class="section">
				<span class="label">Mode</span>
				<div class="mode-row">
					{#each modes as m}
						<button
							class="mode-btn"
							class:active={m.value === theme.mode}
							onclick={(e) => selectMode(e, m.value)}
							role="menuitemradio"
							aria-checked={m.value === theme.mode}
						>
							{m.label}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.theme-picker {
		position: relative;
		display: flex;
		align-items: center;
	}

	.trigger {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s ease;
		background-color: var(--secondary);
	}

	.trigger:hover {
		transform: scale(1.3);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 8px;
		min-width: 140px;
		background: var(--background);
		border: 1px solid var(--light-grey);
		border-radius: var(--radius);
		z-index: 100;
		padding: 6px;
	}

	.section {
		padding: 6px 8px;
	}

	.label {
		display: block;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--light-grey);
		margin-bottom: 6px;
	}

	.accent-row {
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s ease;
	}

	.dot:hover {
		transform: scale(1.3);
	}

	.dot.active {
		border-color: light-dark(var(--black), var(--white));
	}

	.divider {
		height: 1px;
		background: light-dark(var(--light-grey), var(--light-grey));
		opacity: 0.3;
		margin: 2px 8px;
	}

	.mode-row {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.mode-btn {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		border-radius: 4px;
		padding: 4px 8px;
		cursor: pointer;
		font-size: 0.8rem;
		color: var(--foreground);
		transition: background 0.15s ease;
	}

	.mode-btn:hover {
		background: light-dark(
			color-mix(in srgb, var(--white) 90%, var(--black)),
			color-mix(in srgb, #2c2c2c 90%, var(--white))
		);
	}

	.mode-btn.active {
		background: color-mix(in srgb, var(--secondary) 8%, transparent);
	}

	/* Disable accent dots when rendering in dark mode */
	@media (prefers-color-scheme: dark) {
		.accent-row {
			opacity: 0.35;
			pointer-events: none;
		}
	}

	:global(html[data-mode='light']) .accent-row {
		opacity: 1;
		pointer-events: auto;
	}

	:global(html[data-mode='dark']) .accent-row {
		opacity: 0.35;
		pointer-events: none;
	}
</style>
