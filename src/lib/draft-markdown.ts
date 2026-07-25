export interface Draft {
	slug: string;
	title: string;
	description: string;
	body: string;
	published: boolean;
	createdAt: string;
	updatedAt: string;
}

export function toMarkdown(draft: Draft): string {
	const frontmatter: Record<string, string | boolean> = {
		title: draft.title,
		date: draft.createdAt.split('T')[0],
		description: draft.description,
		published: false
	};

	let md = '---\n';
	for (const [key, value] of Object.entries(frontmatter)) {
		md += `${key}: ${typeof value === 'string' && value.includes(':') ? `'${value}'` : value}\n`;
	}
	md += '---\n\n';
	md += draft.body;
	return md;
}
