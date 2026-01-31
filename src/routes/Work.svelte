<script lang="ts">
	import DetailList from '$lib/DetailList.svelte';
	import { allProjects } from 'content-collections';

	const workItems = allProjects.filter((project) => project.type === 'work');
	const openSourceItems = allProjects.filter((project) => project.type === 'open-source');
</script>

<DetailList items={workItems} title="Selected Work" />
<DetailList items={openSourceItems} title="Open Source" />
