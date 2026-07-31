<script lang="ts">
	import type { Draft } from '$lib/draft-markdown';
	import LinkList from '$lib/LinkList.svelte';

	type Props = {
		data: {
			authenticated: boolean;
			drafts: Draft[];
			readingListItem: {
				id: string;
				url: string;
				title: string;
				author?: string;
				siteName?: string;
				description?: string;
			} | null;
			hasLikedCollection: boolean;
		};
		form?: {
			error?: string;
		};
	};

	let { data, form }: Props = $props();

	const draftItems = $derived(
		data.drafts.map((d) => ({ slug: d.slug, title: d.title, date: d.updatedAt }))
	);

	let statusText = $state('');
	let statusSubmitting = $state(false);
	let statusResult = $state<{ uri: string; cid: string } | null>(null);
	let statusError = $state('');

	async function submitStatus() {
		if (!statusText.trim()) return;
		statusSubmitting = true;
		statusError = '';
		statusResult = null;
		try {
			const res = await fetch('/api/status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: statusText.trim() })
			});
			if (res.ok) {
				statusResult = await res.json();
				statusText = '';
			} else {
				const err = await res.json();
				statusError = err.error || 'Failed to post status';
			}
		} catch {
			statusError = 'Network error';
		} finally {
			statusSubmitting = false;
		}
	}

	function statusPostUrl(uri: string): string {
		const rkey = uri.split('/').pop() ?? '';
		return `https://bsky.app/profile/now.stordahl.dev/post/${rkey}`;
	}
</script>

<svelte:head>
	<title>Admin | Jacob Stordahl</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="admin">
	{#if data.authenticated}
		<div class="drafts">
			<LinkList basePath="admin/drafts" items={draftItems}>
				{#snippet header()}
					<div class="drafts-header">
						<h2>drafts</h2>
						<a href="/admin/drafts/new">+ Create Draft</a>
					</div>
				{/snippet}
			</LinkList>
			{#if data.drafts.length === 0}
				<p class="empty">No drafts yet.</p>
			{/if}
		</div>
		<div class="status-composer">
			<h2>reading list</h2>
			{#if data.readingListItem}
				<div class="reading-card">
					<a href={data.readingListItem.url} target="_blank" rel="noopener noreferrer" class="reading-link">
						<span class="reading-title">{data.readingListItem.title}</span>
						<span class="reading-attribution">
							{data.readingListItem.author || data.readingListItem.siteName || ''}
						</span>
					</a>
					{#if data.readingListItem.description}
						<p class="reading-desc">{data.readingListItem.description}</p>
					{/if}
					<div class="reading-actions">
						<form method="POST" action="?/remove">
							<input type="hidden" name="cardId" value={data.readingListItem.id} />
							<button type="submit" class="remove">Remove</button>
						</form>
						{#if data.hasLikedCollection}
							<form method="POST" action="?/like">
								<input type="hidden" name="cardId" value={data.readingListItem.id} />
								<button type="submit" class="like">Liked</button>
							</form>
						{/if}
					</div>
				</div>
			{:else}
				<p class="empty">No articles in your reading list.</p>
			{/if}
		</div>
		<div class="status-composer">
			<h2>now</h2>
			<input
				type="text"
				bind:value={statusText}
				placeholder="What are you doing now?"
				maxlength="100"
			/>
			<div class="status-actions">
				<span class="char-count">{statusText.length}/300</span>
				<button onclick={submitStatus} disabled={statusSubmitting || !statusText.trim()}>
					{statusSubmitting ? 'Posting...' : 'Post'}
				</button>
			</div>
			{#if statusError}
				<p class="error">{statusError}</p>
			{/if}
			{#if statusResult}
				<p class="success">
					Posted!
					<a href={statusPostUrl(statusResult.uri)} target="_blank" rel="noopener"
						>View on Bluesky</a
					>
				</p>
			{/if}
		</div>
	{:else}
		<div class="login">
			<form method="POST" action="?/login">
				<input type="password" name="password" placeholder="Password" required />
				<button type="submit">Login</button>
			</form>
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.drafts {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.drafts-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.drafts-header a {
		font-size: 0.9rem;
		text-decoration: underline;
		opacity: 0.7;
	}

	.drafts-header a:hover {
		opacity: 1;
	}

	.empty {
		opacity: 0.5;
		font-style: italic;
	}

	.login {
		max-width: 320px;
		margin: 4rem auto;
		text-align: center;
	}

	.login form {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.75rem;
	}

	.error {
		color: #e74c3c;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.status-composer {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--secondary);
	}

	.status-composer h2 {
		margin-bottom: 0.75rem;
		font-size: var(--font-md);
	}

	.status-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.5rem;
	}

	.char-count {
		font-size: var(--font-xs);
		opacity: 0.5;
	}

	.success {
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.success a {
		text-decoration: underline;
	}

	@media screen and (max-width: 768px) {
		input {
			font-size: 16px;
		}
	}

	.reading-card {
		border: 1px solid var(--secondary);
		border-radius: var(--radius);
		padding: 1rem;
		margin-top: 0.75rem;
	}

	.reading-link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.reading-link:hover {
		text-decoration: none;
	}

	.reading-title {
		font-weight: 500;
		font-size: var(--font-md);
	}

	.reading-attribution {
		font-size: var(--font-xs);
		opacity: 0.6;
	}

	.reading-desc {
		font-size: var(--font-xs);
		opacity: 0.7;
		margin-top: 0.5rem;
		line-height: 1.4;
	}

	.reading-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.reading-actions button {
		font-size: var(--font-xs);
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius);
		cursor: pointer;
		border: 1px solid var(--secondary);
		background: none;
		color: var(--foreground);
	}

	.reading-actions button.like:hover {
		background: color-mix(in srgb, var(--secondary) 20%, transparent);
	}

	.reading-actions button.remove:hover {
		background: color-mix(in srgb, #e74c3c 30%, transparent);
		border-color: #e74c3c;
	}
</style>
