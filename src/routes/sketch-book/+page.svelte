<script lang="ts">
	import LinkList from '$lib/LinkList.svelte';
	import Seo from '$lib/Seo.svelte';
	import type { allSketches } from 'content-collections';

	type Props = {
		data: {
			sketches: typeof allSketches;
		};
	};
	const { data }: Props = $props();

	let vw = $state(0);
</script>

<svelte:window bind:innerWidth={vw} />

<Seo title="Sketch Book | Jacob Stordahl" description="A collection of small UI ideas" />

<LinkList basePath="sketch-book" items={data.sketches} title="sketches" />
