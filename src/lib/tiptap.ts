import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';

export function createEditor(options: {
	element: HTMLElement;
	content: string;
	onUpdate: (markdown: string) => void;
}) {
	const { element, content, onUpdate } = options;

	const editor = new Editor({
		element,
		extensions: [
			StarterKit.configure({
				codeBlock: {
					HTMLAttributes: {
						class: 'code-block'
					}
				}
			}),
			Image.configure({
				allowBase64: false,
				HTMLAttributes: {
					class: 'editor-image'
				}
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https'
			}),
			Placeholder.configure({
				placeholder: 'Write your markdown here...'
			}),
			Markdown.configure({
				html: false,
				transformPastedText: true,
				transformCopiedText: true
			})
		],
		content,
		onUpdate: ({ editor }) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const markdown = (editor.storage as any).markdown.getMarkdown();
			onUpdate(markdown);
		}
	});

	return editor;
}
