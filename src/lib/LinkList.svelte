<script lang="ts">
	import { formatDateToMonthYear } from './utils';
	import type { Snippet } from 'svelte';

	const {
		basePath,
		items,
		title = undefined,
		header = undefined
	}: {
		basePath: string;
		items: { slug: string; title: string; date: Date | string }[];
		title?: string;
		header?: Snippet;
	} = $props();
</script>

{#if header}
	{@render header()}
{:else if title}
	<h1>{title}</h1>
{/if}

<section>
	<ul class="items">
		{#each items as item}
			{@const date = formatDateToMonthYear(item.date, true)}
			<li class="post">
				<a href="/{basePath}/{item.slug}" class="title">
					<span class="title">{item.title}</span>
					<span class="date">{date}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	h1 {
		margin-bottom: 15px;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	li {
		font-size: var(--font-md);
		a {
			width: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			border: none;
			.title {
				max-width: 75%;
			}
			.date {
				text-align: right;
			}
		}
	}
</style>
