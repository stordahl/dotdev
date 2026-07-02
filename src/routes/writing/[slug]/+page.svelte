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

<a href="/writing" class="back">&larr; Back</a>
<article>
	<header>
		<h1>{post.title}</h1>
		<p class="date">Published {formatDate(post.date)}</p>
	</header>
	<hr />
	<div class="content">
		{@html post.content}
	</div>
</article>

<style>
	hr {
		margin: 15px 0;
	}

	article {
		padding-top: 1rem;
	}
</style>
