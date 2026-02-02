<script lang="ts">
	import Detail from '../lib/Detail.svelte';

	type ListItem = {
		title: string;
		service: 'Design' | 'Development' | 'Design & Development' | string;
		link: string;
		linkText: string;
		description: string;
	};

	type Props = {
		items: ListItem[];
		title: string;
	};

	const { items, title }: Props = $props();
</script>

<h2>{title}</h2>

{#each items as item, index}
	<Detail
		title={item.title}
		service={item.service}
		index={index + 1}
		link={item.link}
		linkText={item.linkText}
	>
		<p>{item.description}</p>
	</Detail>
{/each}

<style>
	h2 {
		font-family: 'Basheq', serif;
		font-size: clamp(2rem, calc(2rem + 5vw), 6rem);
		font-weight: 300;
		text-align: center;
		margin-top: 3rem;
		margin-bottom: 2rem;
	}
</style>
