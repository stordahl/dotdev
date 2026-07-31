<script lang="ts">
	import Work from './Work.svelte';
	import Seo from '$lib/Seo.svelte';
	import BskyPosts from '$lib/BskyPosts.svelte';
	import GithubContributions from '$lib/GithubContributions.svelte';
	import NowStatus from '$lib/NowStatus.svelte';
	import NextReadingListItem from '$lib/NextReadingListItem.svelte';
	let { data } = $props();
</script>

<Seo />

<section>
	<div class="banner"></div>
	<h1>Hi, I'm Jacob.</h1>
	<p>
		I'm a Software Engineer, Web Developer, and recovering artist. I've been building stuff on the
		web for a decade, and still love crafting exceptional user experiences. Currently, I'm a
		Software Engineer at <a href="https://stylitics.com">Stylitics</a>. I'm also a maintainer of a
		number of open source projects, including the
		<a href="https://counterscale.dev">Counterscale</a> analytics project.
	</p>
</section>
<section>
	{#if data.status}
		<NowStatus post={data.status} />
	{/if}
	{#if data.contributions}
		<GithubContributions contributions={data.contributions} />
	{/if}
	{#if data.posts}
		<BskyPosts posts={data.posts} />
	{/if}
</section>
<Work />
{#if data.readingListItem}
	<NextReadingListItem item={data.readingListItem} />
{/if}

<style>
	.banner {
		height: 150px;
		width: 100%;
		border-radius: var(--radius);
		background-image: var(--banner-image);
		background-size: cover;
		margin-bottom: 30px;
	}

	h1 {
		font-size: var(--font-lg);
		line-height: 1;
		margin-bottom: 10px;
	}

	p {
		font-size: var(--font-lg);
	}
</style>
