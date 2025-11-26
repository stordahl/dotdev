import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const sourceDir = join(process.cwd(), 'src/content/sketches');
const targetDir = join(process.cwd(), 'static/sketches');

// Create target directory if it doesn't exist
mkdirSync(targetDir, { recursive: true });

// Get all sketch directories
const sketchDirs = readdirSync(sourceDir, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name);

console.log('Copying sketch files to static...');

// Copy each sketch.svelte file to static/sketches/
for (const sketchName of sketchDirs) {
	const sourceFile = join(sourceDir, sketchName, 'sketch.svelte');
	const targetFile = join(targetDir, `${sketchName}.svelte`);

	try {
		copyFileSync(sourceFile, targetFile);
		console.log(`Copied ${sketchName}/sketch.svelte -> static/sketches/${sketchName}.svelte`);
	} catch (error) {
		console.error(`Failed to copy ${sketchName}:`, error);
	}
}

console.log('Done!');
