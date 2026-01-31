import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import rehypeShiki from '@shikijs/rehype';
import * as v from 'valibot';

const posts = defineCollection({
	name: 'posts',
	directory: 'src/content/blog',
	include: '**/*.md',
	schema: v.object({
		title: v.string(),
		date: v.string(),
		description: v.string(),
		published: v.boolean(),
		content: v.string(),
		atUri: v.string()
	}),
	transform: async (doc, context) => {
		if (!doc.published) {
			return context.skip('document is a draft');
		}
		const content = await compileMarkdown(context, doc, {
			rehypePlugins: [[rehypeShiki, { theme: 'everforest-dark' }]]
		});
		return {
			...doc,
			slug: doc._meta.filePath.toLowerCase().replace('.md', '').replace(/ /g, '-'),
			content
		};
	}
});

const sketches = defineCollection({
	name: 'sketches',
	directory: 'src/content/sketches',
	include: '**/*.md',
	schema: v.object({
		title: v.string(),
		date: v.string(),
		published: v.boolean(),
		content: v.string()
	}),
	transform: async (doc, context) => {
		if (!doc.published) {
			return context.skip('document is a draft');
		}
		const content = await compileMarkdown(context, doc);

		return {
			...doc,
			slug: doc._meta.filePath.toLowerCase().replace('/sketch.md', '').replace(/ /g, '-'),
			content
		};
	}
});

const projects = defineCollection({
	name: 'projects',
	directory: 'src/content/projects',
	include: '**/*.json',
	parser: 'json',
	schema: v.object({
		title: v.string(),
		service: v.union([
			v.literal('Design'),
			v.literal('Development'),
			v.literal('Design & Development')
		]),
		link: v.string(),
		linkText: v.string(),
		description: v.string(),
		type: v.union([v.literal('work'), v.literal('open-source')])
	}),
	transform: async (doc) => {
		return {
			...doc,
			slug: doc._meta.filePath.toLowerCase().replace('.json', '').replace(/ /g, '-')
		};
	}
});

export default defineConfig({
	collections: [posts, sketches, projects]
});
