import { env } from '$env/dynamic/private';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'stordahl';
const REPO = 'dotdev';
const BLOG_DIR = 'src/content/blog';

interface GitHubUser {
	login: string;
}

async function api(path: string, method: string = 'GET', body?: unknown) {
	const token = env.GITHUB_TOKEN;
	if (!token) throw new Error('GITHUB_TOKEN not set');

	const res = await fetch(`${GITHUB_API}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'User-Agent': 'dotdev-cms'
		},
		...body ? { body: JSON.stringify(body) } : {}
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`GitHub API ${res.status}: ${err}`);
	}

	return method === 'DELETE' ? null : res.json();
}

async function getDefaultBranchSha(): Promise<string> {
	const ref = await api(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
	return ref.object.sha;
}

async function createBranch(branch: string, sha: string): Promise<void> {
	await api(`/repos/${OWNER}/${REPO}/git/refs`, 'POST', {
		ref: `refs/heads/${branch}`,
		sha
	});
}

async function createBlob(content: string): Promise<string> {
	const blob = await api(`/repos/${OWNER}/${REPO}/git/blobs`, 'POST', {
		content: btoa([...new TextEncoder().encode(content)].map(b => String.fromCharCode(b)).join('')),
		encoding: 'base64'
	});
	return blob.sha;
}

async function createTree(baseSha: string, files: { path: string; blobSha: string }[]): Promise<string> {
	const tree = await api(`/repos/${OWNER}/${REPO}/git/trees`, 'POST', {
		base_tree: baseSha,
		tree: files.map((f) => ({
			path: f.path,
			mode: '100644',
			type: 'blob',
			sha: f.blobSha
		}))
	});
	return tree.sha;
}

async function createCommit(treeSha: string, parentSha: string, message: string): Promise<string> {
	const commit = await api(`/repos/${OWNER}/${REPO}/git/commits`, 'POST', {
		message,
		tree: treeSha,
		parents: [parentSha]
	});
	return commit.sha;
}

async function updateBranch(branch: string, commitSha: string): Promise<void> {
	await api(`/repos/${OWNER}/${REPO}/git/refs/heads/${branch}`, 'PATCH', {
		sha: commitSha
	});
}

interface CreatePROptions {
	title: string;
	body: string;
	head: string;
	base?: string;
}

async function createPR(options: CreatePROptions): Promise<{ html_url: string; number: number }> {
	const pr = await api(`/repos/${OWNER}/${REPO}/pulls`, 'POST', {
		title: options.title,
		body: options.body,
		head: options.head,
		base: options.base || 'main'
	});
	return { html_url: pr.html_url, number: pr.number };
}

export async function createPostPR(slug: string, markdown: string): Promise<{ prUrl: string; prNumber: number }> {
	const branch = `cms/${slug}`;
	const sha = await getDefaultBranchSha();
	await createBranch(branch, sha);

	const filename = `${BLOG_DIR}/${slug}.md`;
	const blobSha = await createBlob(markdown);
	const treeSha = await createTree(sha, [{ path: filename, blobSha }]);
	const commitSha = await createCommit(treeSha, sha, `feat: new blog post "${slug}"`);
	await updateBranch(branch, commitSha);

	const pr = await createPR({
		title: `New post: ${slug}`,
		body: `This PR was created from the CMS.\n\nPost: ${filename}`,
		head: branch
	});

	return { prUrl: pr.html_url, prNumber: pr.number };
}
