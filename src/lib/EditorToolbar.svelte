<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import {
		Bold,
		Italic,
		Link,
		Heading2,
		Quote,
		Code,
		List,
		ListOrdered,
		Image
	} from '@lucide/svelte';

	let { editor }: { editor: Editor | null } = $props();

	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleHeading() {
		editor?.chain().focus().toggleHeading({ level: 2 }).run();
	}

	function toggleBlockquote() {
		editor?.chain().focus().toggleBlockquote().run();
	}

	function toggleCodeBlock() {
		editor?.chain().focus().toggleCodeBlock().run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function setLink() {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);
		if (url === null) return;
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function insertImage() {
		if (!editor) return;
		const url = window.prompt('Image URL');
		if (!url) return;
		const alt = window.prompt('Alt text') || '';
		editor.chain().focus().setImage({ src: url, alt }).run();
	}

	function isActive(name: string, attrs: Record<string, unknown> | undefined = undefined) {
		if (!editor) return false;
		return attrs ? editor.isActive(name, attrs) : editor.isActive(name);
	}
</script>

<div class="toolbar">
	<button
		onclick={toggleBold}
		class:active={isActive('bold')}
		type="button"
		aria-label="Bold"
		title="Bold (Ctrl+B)"
	>
		<Bold size={16} />
	</button>
	<button
		onclick={toggleItalic}
		class:active={isActive('italic')}
		type="button"
		aria-label="Italic"
		title="Italic (Ctrl+I)"
	>
		<Italic size={16} />
	</button>
	<button
		onclick={setLink}
		class:active={isActive('link')}
		type="button"
		aria-label="Link"
		title="Link"
	>
		<Link size={16} />
	</button>
	<span class="divider"></span>
	<button
		onclick={toggleHeading}
		class:active={isActive('heading', { level: 2 })}
		type="button"
		aria-label="Heading"
		title="Heading (Ctrl+Alt+2)"
	>
		<Heading2 size={16} />
	</button>
	<button
		onclick={toggleBlockquote}
		class:active={isActive('blockquote')}
		type="button"
		aria-label="Blockquote"
		title="Blockquote"
	>
		<Quote size={16} />
	</button>
	<button
		onclick={toggleCodeBlock}
		class:active={isActive('codeBlock')}
		type="button"
		aria-label="Code block"
		title="Code block"
	>
		<Code size={16} />
	</button>
	<button
		onclick={toggleBulletList}
		class:active={isActive('bulletList')}
		type="button"
		aria-label="Bullet list"
		title="Bullet list"
	>
		<List size={16} />
	</button>
	<button
		onclick={toggleOrderedList}
		class:active={isActive('orderedList')}
		type="button"
		aria-label="Ordered list"
		title="Ordered list"
	>
		<ListOrdered size={16} />
	</button>
	<span class="divider"></span>
	<button
		onclick={insertImage}
		type="button"
		aria-label="Insert image"
		title="Insert image"
	>
		<Image size={16} />
	</button>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem;
		border-bottom: 1px solid var(--secondary);
		flex-wrap: wrap;
	}

	.toolbar button {
		background: none;
		border: 1px solid transparent;
		border-radius: var(--radius);
		color: var(--foreground);
		padding: 0.25rem 0.5rem;
		font-size: 0.85rem;
		cursor: pointer;
		min-width: 2rem;
		transition: background 0.15s, border-color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toolbar button:hover {
		background: var(--light-grey);
	}

	.toolbar button.active {
		background: var(--secondary);
		color: var(--background);
		border-color: var(--secondary);
	}

	.divider {
		width: 1px;
		height: 1.25rem;
		background: var(--light-grey);
		margin: 0 0.25rem;
	}
</style>
