<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Editor } from '@tiptap/core';
	import { createEditor } from '$lib/tiptap';
	import EditorToolbar from '$lib/EditorToolbar.svelte';

	let {
		content,
		onChange
	}: {
		content: string;
		onChange: (markdown: string) => void;
	} = $props();

	let editorElement: HTMLDivElement;
	let editor = $state<Editor | null>(null);

	onMount(() => {
		const instance = createEditor({
			element: editorElement,
			content,
			onUpdate: (markdown) => {
				onChange(markdown);
			}
		});
		editor = instance;
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div class="tiptap-editor">
	<EditorToolbar {editor} />
	<div bind:this={editorElement} class="editor-content"></div>
</div>

<style>
	.tiptap-editor {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.editor-content {
		flex: 1;
		min-height: 0;
		padding: 0.75rem;
		overflow-y: auto;
		font-size: 16px;
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		.tiptap-editor {
			flex: none;
			min-height: auto;
			overflow: visible;
		}

		.editor-content {
			flex: none;
			min-height: auto;
			overflow-y: visible;
		}
	}

	.editor-content :global(.ProseMirror) {
		outline: none;
		min-height: 100%;
	}

	.editor-content :global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: var(--light-grey);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	.editor-content :global(.ProseMirror img) {
		max-width: 100%;
		border-radius: 4px;
	}

	.editor-content :global(.ProseMirror blockquote) {
		border-left: 3px solid var(--secondary);
		padding-left: 1rem;
		margin: 0;
		font-style: italic;
	}

	.editor-content :global(.ProseMirror pre) {
		background: var(--light-grey);
		padding: 0.75rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	.editor-content :global(.ProseMirror pre code) {
		background: none;
		padding: 0;
		font-family: monospace;
		font-size: 0.85rem;
	}

	.editor-content :global(.ProseMirror code:not(pre code)) {
		background: var(--light-grey);
		padding: 0.15rem 0.35rem;
		border-radius: 3px;
		font-family: monospace;
		font-size: 0.85em;
	}

	.editor-content :global(.ProseMirror ul) {
		padding-left: 1.5rem;
	}

	.editor-content :global(.ProseMirror ol) {
		padding-left: 1.5rem;
	}

	.editor-content :global(.ProseMirror h2) {
		font-size: 1.3rem;
		font-weight: 700;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
</style>
