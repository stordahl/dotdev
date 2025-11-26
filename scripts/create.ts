import * as fs from 'fs';
import * as path from 'path';
import { intro, outro, text, confirm, isCancel, cancel } from '@clack/prompts';
import * as color from 'picocolors';

type ContentType = 'post' | 'sketch';

interface PostMetadata {
	title: string;
	slug: string;
	description: string;
	date: string;
	published: boolean;
}

interface SketchMetadata {
	title: string;
	date: string;
	published: boolean;
}

interface MarkdownFileOptions {
	directory: string;
	filename: string;
	metadata: PostMetadata | SketchMetadata;
	contentType: ContentType;
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'blog');
const SKETCHES_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'sketches');

function formatDate(date: Date): string {
	return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

function createMarkdownFile(options: MarkdownFileOptions): string {
	try {
		// Ensure directory exists
		if (!fs.existsSync(options.directory)) {
			fs.mkdirSync(options.directory, { recursive: true });
		}

		let fullPath: string;

		if (options.contentType === 'sketch') {
			// Create sketch directory structure
			const sketchDir = path.join(options.directory, options.filename);
			if (!fs.existsSync(sketchDir)) {
				fs.mkdirSync(sketchDir, { recursive: true });
			}

			// Create sketch.md
			const mdPath = path.join(sketchDir, 'sketch.md');
			let fileContent = '---\n';
			for (const [key, value] of Object.entries(options.metadata)) {
				fileContent += `${key}: ${value}\n`;
			}
			fileContent += '---\n\n';
			fs.writeFileSync(mdPath, fileContent);

			// Create sketch.svelte
			const sveltePath = path.join(sketchDir, 'sketch.svelte');
			const svelteContent = `<script lang="ts">
  // Add your sketch logic here
</script>

<div class="sketch">
  <!-- Add your sketch content here -->
</div>

<style>
  .sketch {
    /* Add your sketch styles here */
  }
</style>`;
			fs.writeFileSync(sveltePath, svelteContent);

			fullPath = sketchDir;
		} else {
			// Create blog post file
			const filepath = path.join(options.directory, options.filename);
			fullPath = filepath.endsWith('.md') ? filepath : `${filepath}.md`;

			// Generate markdown content with frontmatter
			let fileContent = '---\n';
			for (const [key, value] of Object.entries(options.metadata)) {
				fileContent += `${key}: ${value}\n`;
			}
			fileContent += '---\n\n';
			fileContent += `# ${(options.metadata as PostMetadata).title}\n\n${(options.metadata as PostMetadata).description}\n`;

			// Write the file
			fs.writeFileSync(fullPath, fileContent);
		}

		return fullPath;
	} catch (error) {
		console.error('Error creating content:', error);
		throw error;
	}
}

async function main() {
	const contentType = process.argv[2] as ContentType;

	if (!contentType || !['post', 'sketch'].includes(contentType)) {
		console.error('Please specify content type: "post" or "sketch"');
		process.exit(1);
	}

	const isPost = contentType === 'post';
	const directory = isPost ? BLOG_DIRECTORY : SKETCHES_DIRECTORY;

	intro(color.bgCyan(` Create New ${isPost ? 'Blog Post' : 'Sketch'} `));

	const title = await text({
		message: `Enter the ${isPost ? 'post' : 'sketch'} title:`,
		placeholder: isPost ? 'My Awesome Blog Post' : 'My Awesome Sketch',
		validate: (value) => {
			if (!value) return 'Please enter a title';
		}
	});

	if (isCancel(title)) {
		cancel('Operation cancelled');
		process.exit(0);
	}

	let slug: string | undefined;
	let description: string | undefined;

	if (isPost) {
		const suggestedSlug = (title as string)
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');

		slug = (await text({
			message: 'Enter the URL slug:',
			placeholder: suggestedSlug,
			defaultValue: suggestedSlug,
			validate: (value) => {
				if (!value) return 'Please enter a slug';
				if (fs.existsSync(path.join(directory, `${value}.md`))) {
					return 'A post with this slug already exists';
				}
			}
		})) as string;

		if (isCancel(slug)) {
			cancel('Operation cancelled');
			process.exit(0);
		}

		description = (await text({
			message: 'Enter a description:',
			validate: (value) => {
				if (!value) return 'Please enter a description';
			}
		})) as string;

		if (isCancel(description)) {
			cancel('Operation cancelled');
			process.exit(0);
		}
	} else {
		// For sketches, validate directory doesn't exist
		const suggestedSlug = (title as string)
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');

		slug = (await text({
			message: 'Enter the sketch directory name:',
			placeholder: suggestedSlug,
			defaultValue: suggestedSlug,
			validate: (value) => {
				if (!value) return 'Please enter a directory name';
				if (fs.existsSync(path.join(directory, value))) {
					return 'A sketch with this name already exists';
				}
			}
		})) as string;

		if (isCancel(slug)) {
			cancel('Operation cancelled');
			process.exit(0);
		}
	}

	const published = await confirm({
		message: `Should this ${isPost ? 'post' : 'sketch'} be published?`,
		initialValue: false
	});

	if (isCancel(published)) {
		cancel('Operation cancelled');
		process.exit(0);
	}

	const metadata = isPost
		? {
				title: title as string,
				slug: slug as string,
				description: description as string,
				date: formatDate(new Date()),
				published: published as boolean
			}
		: {
				title: title as string,
				date: formatDate(new Date()),
				published: published as boolean
			};

	const options: MarkdownFileOptions = {
		directory,
		filename: isPost ? `${slug}.md` : (slug as string),
		metadata,
		contentType
	};

	try {
		const filePath = createMarkdownFile(options);
		const url = isPost ? `/blog/${slug}` : `/sketch-book/${slug}`;
		const fileType = isPost ? 'Blog post' : 'Sketch';

		outro(
			color.green(`✓ ${fileType} created successfully!\n`) +
				color.dim(`Path: ${filePath}\n`) +
				color.dim(`URL: ${url}`)
		);
	} catch (error) {
		outro(color.red(`✗ Error: ${error}`));
		process.exit(1);
	}
}

main().catch((error) => {
	console.error('Error:', error);
	process.exit(1);
});
