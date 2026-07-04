<script lang="ts">
	import DetailList from '$lib/DetailList.svelte';
	import { allProjects } from 'content-collections';

	const sorted = [...allProjects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
</script>

<div>
	<DetailList items={sorted} title="Selected Work" startOpen={true} />
</div>

<style>
	div {
		max-width: 800px;
		margin: auto;
	}
</style>
