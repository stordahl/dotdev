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
		atUri: v.optional(v.string())
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

const homeGridCards = defineCollection({
	name: 'homeGridCard',
	directory: 'src/content/home-grid',
	include: '**/*.json',
	parser: 'json',
	schema: v.object({
		title: v.string(),
		label: v.string(),
		image: v.string(),
		alt: v.string(),
		interaction: v.union([v.literal('focus-image'), v.literal('link'), v.literal('flip-text')]),
		href: v.optional(v.string()),
		revealText: v.optional(v.string()),
		size: v.union([
			v.literal('sm'),
			v.literal('md'),
			v.literal('lg'),
			v.literal('wide'),
			v.literal('tall')
		]),
		x: v.number(),
		y: v.number()
	}),
	transform: async (doc) => {
		return {
			...doc,
			slug: doc._meta.filePath.toLowerCase().replace('.json', '').replace(/ /g, '-')
		};
	}
});

export default defineConfig({
	content: [posts, sketches, projects, homeGridCards]
});
