<script lang="ts">
	import Detail from '../lib/Detail.svelte';

	type ListItem = {
		title: string;
		service: 'Design' | 'Development' | 'Design & Development' | string;
		link: string;
		linkText: string;
		description: string;
		type?: 'work' | 'tools';
		slug?: string;
	};

	type Props = {
		items: ListItem[];
		title: string;
		startOpen?: boolean;
	};

	const { items, startOpen = false, title }: Props = $props();
</script>

<section>
	<h2>{title}</h2>
	<ul>
		{#each items as item, index}
			{@const isTool = item.type === 'tools'}
			<li>
				<Detail
					title={item.title}
					service={item.service}
					link={isTool ? `/tools/${item.slug}` : item.link}
					linkText={isTool ? 'docs' : item.linkText}
					defaultOpen={startOpen && index === 0}
				>
					<p>{item.description}</p>
				</Detail>
			</li>
		{/each}
	</ul>
</section>

<style>
	h2 {
		font-size: var(--font-md);
		margin-bottom: 7px;
		font-style: italic;
	}

	ul {
		margin-bottom: 20px;
		list-style: none;
		padding: 0;
	}
</style>
