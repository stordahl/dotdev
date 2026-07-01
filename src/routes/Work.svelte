<script lang="ts">
	import DetailList from '$lib/DetailList.svelte';
	import { allProjects } from 'content-collections';

	const workItems = allProjects.filter((project) => project.type === 'work');
	const openSourceItems = allProjects.filter((project) => project.type === 'tools');
</script>

<div>
	<DetailList items={workItems} title="Selected Work" />
	<DetailList items={openSourceItems} title="Tools" />
</div>

<style>
	div {
		max-width: 800px;
		margin: auto;
	}
</style>
