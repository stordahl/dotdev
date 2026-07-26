<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		danger?: boolean;
		onconfirm?: () => void;
		oncancel?: () => void;
	}

	let {
		title,
		description,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		danger = false,
		open = $bindable(false),
		onconfirm,
		oncancel
	}: Props & { open?: boolean } = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});

	function handleConfirm() {
		onconfirm?.();
		open = false;
	}

	function handleCancel() {
		oncancel?.();
		open = false;
	}

	function handleClick(e: MouseEvent) {
		if (e.target === dialog) {
			handleCancel();
		}
	}
</script>

<dialog
	bind:this={dialog}
	onclick={handleClick}
	aria-labelledby="alert-title"
	aria-describedby="alert-desc"
>
	<div class="dialog-content">
		<h3 id="alert-title">{title}</h3>
		{#if description}
			<p id="alert-desc">{description}</p>
		{/if}
		<div class="actions">
			<button onclick={handleCancel} type="button">{cancelLabel}</button>
			<button onclick={handleConfirm} type="button" data-variant={danger ? 'danger' : null}>{confirmLabel}</button>
		</div>
	</div>
</dialog>

<style>
	dialog {
		margin: auto;
		padding: 0;
		border: 1px solid var(--secondary);
		border-radius: var(--radius);
		background: var(--background);
		color: var(--foreground);
		max-width: 400px;
		width: 90vw;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	.dialog-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h3 {
		margin: 0;
		font-size: var(--font-lg);
		font-weight: 500;
	}

	p {
		margin: 0;
		font-size: var(--font-sm);
		opacity: 0.8;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
