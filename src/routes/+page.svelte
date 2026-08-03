<script lang="ts">
	import Work from './Work.svelte';
	import Seo from '$lib/Seo.svelte';
	import BskyPosts from '$lib/BskyPosts.svelte';
	import GithubContributions from '$lib/GithubContributions.svelte';
	import NowStatus from '$lib/NowStatus.svelte';
	import NextReadingListItem from '$lib/NextReadingListItem.svelte';
	import LatestScrobble from '$lib/LatestScrobble.svelte';
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
	<div class="cards-row">
		<NowStatus post={data.status} />
		<NextReadingListItem item={data.readingListItem} />
		<LatestScrobble scrobble={data.latestScrobble} />
	</div>
</section>
<section>
	{#if data.contributions}
		<GithubContributions contributions={data.contributions} />
	{/if}
	{#if data.posts}
		<BskyPosts posts={data.posts} />
	{/if}
</section>
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

	.cards-row {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.5rem;
		margin-top: 1rem;
	}

	.cards-row::-webkit-scrollbar {
		height: 6px;
	}

	.cards-row::-webkit-scrollbar-track {
		background: transparent;
	}

	.cards-row::-webkit-scrollbar-thumb {
		background: var(--light-grey);
		border-radius: 3px;
	}

	@media screen and (min-width: 769px) {
		.cards-row {
			overflow-x: visible;
			scroll-snap-type: none;
			padding-bottom: 0;
		}
	}
</style>
