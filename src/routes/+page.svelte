<script lang="ts">
	import Work from './Work.svelte';
	import Seo from '$lib/Seo.svelte';
	import BskyPosts from '$lib/BskyPosts.svelte';
	import GithubContributions from '$lib/GithubContributions.svelte';
	import NowStatus from '$lib/NowStatus.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
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
	{#if data.status}
		<NowStatus post={data.status} />
	{/if}
</section>
{#if data.contributions}
	<GithubContributions contributions={data.contributions} />
{/if}
<BskyPosts posts={data.posts} />
<Work />

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
