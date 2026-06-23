<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import type { PageData } from './$types';
	import HomeGrid from './HomeGrid.svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<Seo />
<HomeGrid cards={data.cards} />
