<script lang="ts">
	import type { Draft } from '$lib/draft-markdown';
	import LinkList from '$lib/LinkList.svelte';

	type Props = {
		data: {
			authenticated: boolean;
			drafts: Draft[];
		};
		form?: {
			error?: string;
		};
	};

	let { data, form }: Props = $props();

	const draftItems = $derived(
		data.drafts.map((d) => ({ slug: d.slug, title: d.title, date: d.updatedAt }))
	);
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
</style>
