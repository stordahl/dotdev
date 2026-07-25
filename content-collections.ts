import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMarkdown } from '@content-collections/markdown';
import remarkGfm from 'remark-gfm';
import rehypeShiki from '@shikijs/rehype';
import * as v from 'valibot';

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/blog',
  include: '**/*.md',
  schema: v.object({
    title: v.string(),
    date: v.pipe(
      v.string(),
      v.isoDate(),
      v.transform((input) => new Date(input))
    ),
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
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeShiki, {
        themes: {
          light: "github-light",
          dark: "github-dark",
        }
      }]]
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
    date: v.pipe(
      v.string(),
      v.isoDate(),
      v.transform((input) => new Date(input))
    ),
    published: v.boolean(),
    content: v.string()
  }),
  transform: async (doc, context) => {
    if (!doc.published) {
      return context.skip('document is a draft');
    }
    const content = await compileMarkdown(context, doc, {
      remarkPlugins: [remarkGfm],
    });

    return {
      ...doc,
      slug: doc._meta.filePath.toLowerCase().replace('/sketch.md', '').replace(/ /g, '-'),
      content
    };
  }
});

const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/;

const projects = defineCollection({
  name: 'projects',
  directory: 'src/content/projects',
  include: '**/*.json',
  parser: 'json',
  schema: v.variant('type', [
    v.object({
      title: v.string(),
      service: v.union([
        v.literal('design'),
        v.literal('dev'),
        v.literal('design & dev')
      ]),
      link: v.string(),
      linkText: v.string(),
      description: v.string(),
      type: v.literal('work'),
      order: v.optional(v.number())
    }),
    v.object({
      title: v.string(),
      service: v.union([
        v.literal('design'),
        v.literal('dev'),
        v.literal('design & dev')
      ]),
      link: v.pipe(
        v.string(),
        v.check((input) => GITHUB_REPO_REGEX.test(input), 'link must be a valid GitHub repo URL (https://github.com/{owner}/{repo})')
      ),
      linkText: v.string(),
      description: v.string(),
      type: v.literal('tools'),
      order: v.optional(v.number())
    })
  ]),
  transform: async (doc, context) => {
    const base = {
      ...doc,
      slug: doc._meta.filePath.toLowerCase().replace('.json', '').replace(/ /g, '-')
    };

    if (doc.type === 'tools') {
      const match = doc.link.match(GITHUB_REPO_REGEX);
      if (!match) {
        throw new Error(`Invalid GitHub repo URL for project "${doc.title}": ${doc.link}`);
      }
      const [, owner, repo] = match;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
      if (!response.ok) {
        throw new Error(`Failed to fetch README for ${doc.link}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json() as { content: string };
      const decodedReadme = Buffer.from(data.content, 'base64').toString('utf-8');
      const readme = await compileMarkdown(context, { content: decodedReadme, _meta: doc._meta }, {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypeShiki, {
          themes: {
            light: "github-light",
            dark: "github-dark",
          }
        }]]
      });
      return { ...base, readme };
    }

    return base;
  }
});

export default defineConfig({
  content: [posts, sketches, projects]
});
