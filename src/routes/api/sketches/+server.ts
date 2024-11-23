import { json } from '@sveltejs/kit';
import type { Sketch} from '$lib/types';

async function getSketches() {
	const sketches: Sketch[] = [];

	const paths = import.meta.glob('/src/content/sketches/*/sketch.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-2)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Sketch, 'slug'>;
			const sketch = { ...metadata, slug } satisfies Sketch;
			if (sketch.published) sketches.push(sketch);
		}
	}

	return sketches.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);
}

export async function GET() {
	const sketches = await getSketches();
	return json(sketches);
}
