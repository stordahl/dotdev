<script lang="ts">
	import LinkList from '$lib/LinkList.svelte';
	import Seo from '$lib/Seo.svelte';
	import { allProjects } from 'content-collections';

	const tools = allProjects
		.filter((p) => p.type === 'tools')
		.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
</script>

<Seo title="tools | Jacob Stordahl" description="Open source tools and libraries" />

<LinkList basePath="tools" items={tools} title="tools" />
