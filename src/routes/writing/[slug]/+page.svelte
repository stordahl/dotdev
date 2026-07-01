<script lang="ts">
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';
	import Seo from '$lib/Seo.svelte';

	const { data }: { data: PageData } = $props();
	const post = $derived(data.post);
</script>

<svelte:head>
	<link rel="site.standard.document" href={post.atUri} />
</svelte:head>

<Seo
	title={`${post.title} | Jacob Stordahl`}
	description={post.description}
	ogImage="/images/og/writing.jpg"
	author="Jacob Stordahl"
/>

<div class="header">
	<h1>{post.title}</h1>
	<p class="date">Published {formatDate(post.date)}</p>
</div>
<article>
	<div class="content">
		{@html post.content}
	</div>
</article>

<style>
	.header {
		padding: 2rem 0 1.25rem;
		border-bottom: 1px solid var(--secondary);
	}

	.date {
		margin: 0;
	}

	article {
		max-width: 100%;
		position: relative;
		padding-top: 1rem;
	}
</style>
