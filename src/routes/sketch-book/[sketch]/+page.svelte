<script lang="ts">
	import { codeToHtml } from 'shiki/bundle/web';
	import { browser, dev } from '$app/environment';
	import Seo from '$lib/Seo.svelte';
	import Tabs from '$lib/Tabs.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	const { code = undefined, component: Component, markdown } = $derived(data);

	const parsedCodeFn = $derived.by(async () => {
		return code && !dev
			? await codeToHtml(code, {
					lang: 'svelte',
					theme: 'everforest-dark'
				})
			: undefined;
	});

	let visibleTab: 'code' | 'preview' = $state('preview');
</script>

<Seo title="{markdown?.title} | Jacob Stordahl" description="from my sketchbook" />

<article>
	<a href="/sketch-book" class="back">&larr; Back</a>
	<h1>{markdown?.title}</h1>
	{#if markdown?.content}
		<div>
			{@html markdown.content}
		</div>
	{/if}

	<Tabs
		tabs={[
			{ id: 'preview', label: 'Preview' },
			{ id: 'code', label: 'Code' }
		]}
		bind:active={visibleTab}
	>
		{#snippet children(active)}
			<div class="tabs-content">
				{#if active === 'preview'}
					{#if browser}
						<Component />
					{/if}
				{:else}
					<div class="code">
						{#if !dev}
							{#await parsedCodeFn()}
								<p>loading code...</p>
							{:then parsedCode}
								{@html parsedCode}
							{/await}
						{:else}
							<p>No code in dev</p>
						{/if}
					</div>
				{/if}
			</div>
		{/snippet}
	</Tabs>
</article>

<style>
	.back {
		display: block;
		margin-bottom: 10px;
		width: max-content;
	}

	.tabs-content {
		min-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 0;
	}

	.code {
		width: 100%;
		height: 100%;
		overflow: scroll;
	}
</style>
