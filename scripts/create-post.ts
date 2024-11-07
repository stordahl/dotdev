import * as fs from 'fs';
import * as path from 'path';
import { intro, outro, text, confirm, isCancel, cancel } from '@clack/prompts';
import color from 'picocolors';

interface MarkdownFileOptions {
    directory: string;
    filename: string;
    metadata: {
        title: string;
        slug: string;
        description: string;
        date: string;
        published: boolean;
    };
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'blog');

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

function createMarkdownFile(options: MarkdownFileOptions): string {
    try {
        // Ensure blog directory exists
        if (!fs.existsSync(BLOG_DIRECTORY)) {
            fs.mkdirSync(BLOG_DIRECTORY, { recursive: true });
        }

        // Create full filepath
        const filepath = path.join(BLOG_DIRECTORY, options.filename);
        
        // Add .md extension if not present
        const fullPath = filepath.endsWith('.md') ? filepath : `${filepath}.md`;

        // Generate markdown content with frontmatter
        let fileContent = '---\n';
        for (const [key, value] of Object.entries(options.metadata)) {
            fileContent += `${key}: ${value}\n`;
        }
        fileContent += '---\n\n';
        fileContent += `# ${options.metadata.title}\n\n${options.metadata.description}\n`;

        // Write the file
        fs.writeFileSync(fullPath, fileContent);
        return fullPath;

    } catch (error) {
        console.error('Error creating markdown file:', error);
        throw error;
    }
}

async function main() {
    intro(color.bgCyan(' Create New Blog Post '));

    const title = await text({
        message: 'Enter the post title:',
        placeholder: 'My Awesome Blog Post',
        validate: (value) => {
            if (!value) return 'Please enter a title';
        }
    });

    if (isCancel(title)) {
        cancel('Operation cancelled');
        process.exit(0);
    }

    const suggestedSlug = (title as string)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const slug = await text({
        message: 'Enter the URL slug:',
        placeholder: suggestedSlug,
        defaultValue: suggestedSlug,
        validate: (value) => {
            if (!value) return 'Please enter a slug';
            if (fs.existsSync(path.join(BLOG_DIRECTORY, `${value}.md`))) {
                return 'A post with this slug already exists';
            }
        }
    });

    if (isCancel(slug)) {
        cancel('Operation cancelled');
        process.exit(0);
    }

    const description = await text({
        message: 'Enter a description:',
        validate: (value) => {
            if (!value) return 'Please enter a description';
        }
    });

    if (isCancel(description)) {
        cancel('Operation cancelled');
        process.exit(0);
    }

    const published = await confirm({
        message: 'Should this post be published?',
        initialValue: false,
    });

    if (isCancel(published)) {
        cancel('Operation cancelled');
        process.exit(0);
    }

    const options: MarkdownFileOptions = {
        directory: BLOG_DIRECTORY,
        filename: `${slug}.md`,
        metadata: {
            title: title as string,
            slug: slug as string,
            description: description as string,
            date: formatDate(new Date()),
            published: published as boolean
        }
    };

    try {
        const filePath = createMarkdownFile(options);
        outro(
            color.green(`✓ Blog post created successfully!\n`) +
            color.dim(`Path: ${filePath}\n`) +
            color.dim(`URL: /blog/${slug}`)
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
