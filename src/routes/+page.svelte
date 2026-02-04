<script lang="ts">
	import Hero from './Hero.svelte';
	import Bio from './Bio.svelte';
	import Work from './Work.svelte';
	import Seo from '$lib/Seo.svelte';
	import BskyPosts from '$lib/BskyPosts.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
</script>

<Seo />

<Hero />
<Bio />
<BskyPosts posts={data.posts} />
<Work />
