<script lang="ts">
	import { goto } from '$app/navigation';
	import Tabs from '$lib/Tabs.svelte';
	import AlertDialog from '$lib/AlertDialog.svelte';
	import { toMarkdown } from '$lib/draft-markdown';

	type Props = {
		data: {
			draft: {
				slug: string;
				title: string;
				description: string;
				body: string;
				createdAt: string;
				updatedAt: string;
			};
		};
	};
	let { data }: Props = $props();

	let draftInit = $state((() => data.draft)());
	let title = $state(draftInit.title);
	let description = $state(draftInit.description);
	let body = $state(draftInit.body);
	let status = $state('');
	let publishing = $state(false);
	let previewHtml = $state('');
	let visibleTab: 'editor' | 'preview' = $state('editor');

	let autoSaveTimer: ReturnType<typeof setTimeout> | undefined;
	let lastSaved = $state(draftInit.updatedAt);
	let deleteDialogOpen = $state(false);

	async function save() {
		status = 'Saving...';
		try {
			const res = await fetch(`/api/drafts/${draftInit.slug}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description, body })
			});
			if (res.ok) {
				lastSaved = new Date().toISOString();
				status = 'Saved';
				draftInit.title = title;
				draftInit.description = description;
				draftInit.body = body;
			} else {
				throw new Error('Save failed');
			}
		} catch (err) {
			status = 'Save failed';
			throw err;
		}
	}

	function onInput() {
		status = 'Unsaved changes';
		if (autoSaveTimer) clearTimeout(autoSaveTimer);
		const hasUserInput = title !== draftInit.title || description !== draftInit.description || body !== draftInit.body;
		if (hasUserInput) {
			autoSaveTimer = setTimeout(save, 2000);
		}
	}

	async function publish() {
		publishing = true;
		status = 'Publishing...';
		try {
			await save();
			const res = await fetch('/api/publish', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ slug: draftInit.slug })
			});
			if (res.ok) {
				const { prUrl } = await res.json();
				status = 'PR created!';
				window.open(prUrl, '_blank');
			} else {
				const err = await res.json();
				status = `Error: ${err.error}`;
			}
		} catch {
			status = 'Publish failed';
		} finally {
			publishing = false;
		}
	}

	function deleteDraft() {
		deleteDialogOpen = true;
	}

	async function confirmDelete() {
		try {
			const res = await fetch(`/api/drafts/${draftInit.slug}`, { method: 'DELETE' });
			if (res.ok) {
				await goto('/admin');
			} else {
				status = 'Delete failed';
			}
		} catch {
			status = 'Delete failed';
		}
	}

	async function preview() {
		const fullMarkdown = toMarkdown({ ...draftInit, published: false });
		const res = await fetch('/api/preview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ markdown: fullMarkdown })
		});
		if (res.ok) {
			const data = await res.json();
			previewHtml = data.html;
		}
	}
</script>

<svelte:head>
	<title>Edit {draftInit.slug} | Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="editor">
	<div class="toolbar">
		<a href="/admin" class="back">&larr; Back</a>
		<span class="status">{status}</span>
		<span class="saved">Last saved: {new Date(lastSaved).toLocaleString()}</span>
		<button onclick={save}>Save</button>
		<button onclick={deleteDraft} data-variant="danger">Delete</button>
		<button onclick={publish} disabled={publishing} data-variant="success">
			{publishing ? 'Publishing...' : 'Publish'}
		</button>
	</div>

	<div class="fields">
		<input bind:value={title} placeholder="Post title" class="title-input" oninput={onInput} />
		<input
			bind:value={description}
			placeholder="Description / excerpt"
			class="desc-input"
			oninput={onInput}
		/>
	</div>

	<Tabs
		tabs={[
			{ id: 'editor', label: 'Editor' },
			{ id: 'preview', label: 'Preview' }
		]}
		bind:active={visibleTab}
		onchange={(id) => {
			if (id === 'preview') preview();
		}}
	>
		{#snippet children(active)}
			<div class="tabs-content">
				{#if active === 'editor'}
					<textarea
						bind:value={body}
						placeholder="Write your markdown here..."
						oninput={onInput}
						class="editor-pane"></textarea>
				{:else}
					<div class="preview-pane">
						{#if previewHtml}
							<div class="rendered">{@html previewHtml}</div>
						{:else}
							<p class="preview-placeholder">Loading preview...</p>
						{/if}
					</div>
				{/if}
			</div>
		{/snippet}
	</Tabs>
</div>

<AlertDialog
	bind:open={deleteDialogOpen}
	title="Delete this draft?"
	description="This action cannot be undone."
	confirmLabel="Delete"
	cancelLabel="Cancel"
	danger
	onconfirm={confirmDelete}
/>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 120px);
		padding: 1rem 0;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--secondary);
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
	}

	.status {
		font-size: 0.85rem;
		opacity: 0.6;
		flex: 1;
	}

	.saved {
		font-size: 0.8rem;
		opacity: 0.4;
	}

	.fields {
		display: flex;
		flex-direction: column;
		margin-bottom: 0.75rem;
	}
	.fields *:focus,
	textarea:focus {
		outline: none;
	}

	.title-input {
		font-size: 1.5rem;
		font-weight: 700;
		padding: 0.5rem;
		border: none;
		background: transparent;
		color: inherit;
	}

	.desc-input {
		padding: 0.5rem;
		border: none;
		background: transparent;
		color: inherit;
	}

	.tabs-content {
		flex: 1;
		min-height: 0;
		padding: 1rem 0;
	}

	.editor-pane {
		width: 100%;
		height: 100%;
		padding: 0.75rem;
		border: none;
		border-radius: 4px;
		background: transparent;
		color: inherit;
		font-family: monospace;
		font-size: 0.9rem;
		line-height: 1.6;
		resize: none;
	}

	.preview-pane {
		padding: 0.75rem;
		border: 1px solid var(--secondary);
		border-radius: 4px;
		overflow-y: auto;
		height: 100%;
	}

	.preview-placeholder {
		opacity: 0.4;
		font-style: italic;
	}

	.rendered {
		line-height: 1.6;
	}

	.rendered :global(img) {
		max-width: 100%;
	}
</style>
