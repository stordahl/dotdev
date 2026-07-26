<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/Seo.svelte';

	const { data }: { data: PageData } = $props();
	const project = $derived(data.project);
</script>

<Seo title={`${project.title} | Jacob Stordahl`} description={project.description} />

<div class="links">
	<a href="/tools" class="back">&larr; Back</a>
	<a href={project.link} target="_blank" rel="noopener noreferrer" class="repo-link">
		View on GitHub &rarr;
	</a>
</div>
<hr />
<article>
	<div class="readme">
		{@html project.readme}
	</div>
</article>

<style>
	.links {
		display: flex;
		justify-content: space-between;
	}

	.repo-link {
		display: inline-block;
		font-size: var(--font-sm);
		margin-bottom: 20px;
	}

	.readme {
		padding-top: 0.5rem;
	}
</style>
