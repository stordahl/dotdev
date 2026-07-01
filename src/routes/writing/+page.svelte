<script lang="ts">
	import LinkList from '$lib/LinkList.svelte';
	import Seo from '$lib/Seo.svelte';
	import type { allPosts } from 'content-collections';

	type Props = {
		data: {
			posts: typeof allPosts;
		};
	};
	const { data }: Props = $props();
</script>

<Seo
	title="Writing | Jacob Stordahl"
	description="A collection of my writing"
	ogImage="/images/og/writing.jpg"
/>

<LinkList basePath="writing" items={data.posts} title="Writing" />
