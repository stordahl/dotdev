<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		children: Snippet;
		service?: string | undefined;
		title: string;
		link: string | undefined;
		linkText: string | undefined;
		defaultOpen?: boolean;
	};
	let { children, defaultOpen = false, link, linkText, service, title }: Props = $props();

	// svelte-ignore state_referenced_locally
	let open = $state(defaultOpen);
	let detailsEl: HTMLDetailsElement;

	function handleSummaryClick(e: MouseEvent) {
		e.preventDefault();
		if (open) {
			open = false;
		} else {
			detailsEl.setAttribute('open', '');
			open = true;
		}
	}

	$effect(() => {
		if (open) {
			detailsEl?.setAttribute('open', '');
		}
	});
</script>

<details bind:this={detailsEl}>
	<summary onclick={handleSummaryClick}>
		<span class="title">
			<span class="title-text">{title}</span>
		</span>
		{#if Boolean(service)}
			<span class="service">[{service}]</span>
		{/if}
	</summary>
	{#if open}
		<div
			class="content"
			transition:slide
			onoutroend={() => {
				if (!open) detailsEl?.removeAttribute('open');
			}}
		>
			<div class="content-inner">
				{@render children()}
			</div>
			{#if link && linkText}
				<a href={link}>
					{linkText}
				</a>
			{/if}
		</div>
	{/if}
</details>

<style>
	details {
		padding-bottom: 0.6rem;
		transition: padding-bottom 0.1s ease-in-out 0s;
	}

	details:hover,
	details[open] {
		cursor: pointer;
	}

	summary {
		font-size: var(--detail-font-size, var(--font-md));
		font-weight: 500;
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		user-select: none;

		.title {
			position: relative;
			display: flex;
			align-items: center;
			align-self: flex-start;
			transition: color 0.2s ease-in-out 0s;
			&:hover {
				color: var(--secondary);
			}
		}

		.service {
			font-size: var(--font-sm);
		}
	}

	summary::before {
		content: '+';
		width: 12px;
		height: 12px;
		transition: transform 0.2s ease;
		line-height: 0.6;
	}

	details[open] summary:before {
		transform: rotate(45deg);
	}

	details .content {
		:global(p) {
			font-size: var(--font-sm);
			font-weight: 500;

			margin: 0;
		}

		display: flex;
		flex-direction: column;
		gap: 5px;
		padding-top: 5px;

		.content-inner {
			padding-left: 20px;
		}

		a {
			font-size: var(--font-sm);
			font-weight: 500;
			text-align: right;
			border: none;
		}
	}

	details summary::-webkit-details-marker {
		display: none;
	}
</style>
