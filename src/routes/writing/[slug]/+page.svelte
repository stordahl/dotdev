<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';
	import { sidebar } from './sidebar.svelte';
	import Seo from '$lib/Seo.svelte';

	const { data }: { data: PageData } = $props();

	let isMobile = $state(false);

	function checkIfMobile() {
		isMobile = window.innerWidth <= 768;
	}

	let aside: HTMLElement | undefined = $state();
	let showAside = $state(true);
	let header: HTMLElement | undefined = $state();
	const headerHeight = $derived(header?.clientHeight ?? 0);

	const handleScroll = function () {
		const scrollPosition = window.scrollY;

		if (header && elementToHide && !isMobile) {
			const clipAmount = Math.max(0, scrollPosition - header?.getBoundingClientRect().bottom + 58);
			elementToHide.style.clipPath = `inset(${clipAmount}px 0 0 0)`;
		} else if (elementToHide) {
			elementToHide.style.clipPath = 'none';
		}

		if (aside && header) {
			aside?.style.setProperty('--header-height', `${header.clientHeight}px`);
		}
	};

	let elementToHide: HTMLElement | undefined;

	const handleResize = function () {
		checkIfMobile();
		if (aside && window.innerWidth < 1065) showAside = false;
		if (!aside && window.innerWidth >= 1065) showAside = true;
	};

	onMount(() => {
		handleResize();
		checkIfMobile();
    handleScroll();
	});
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleResize} />

<Seo
	title={`${data.meta.title} | Jacob Stordahl`}
	description={data.meta.description}
	ogImage="/images/og/writing.jpg"
	author="Jacob Stordahl"
/>

<div class="header" class:is-mobile={isMobile} bind:this={header}>
	<h1>{data.meta.title}</h1>
	<p class="date">Published {formatDate(data.meta.date)}</p>
</div>
<article bind:this={elementToHide}>
	<div class="content">
		{@render data.content()}
	</div>
	{#if showAside}
		<aside
			use:sidebar={{ marginTop: headerHeight }}
			bind:this={aside}
			style:--header-height="{headerHeight}px"
		></aside>
	{/if}
</article>

<style>
	h1 {
		font-size: clamp(1.2rem, calc(1.2rem + 2vw), 2.25rem);
		text-align: center;
		height: 45px;
	}

	.header.is-mobile h1 {
		height: initial;
	}

	.header {
		padding: 2rem 0;
		border-bottom: 1px solid var(--orange);
		position: sticky;
		top: 0;
		background: inherit;
		&.is-mobile {
			z-index: 1;
			background-color: var(--black);
			background-image: url('/images/noise.svg');
		}
	}

	article {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 30px;
		max-width: 100%;
		position: relative;
		padding-top: 2rem;
	}

	article:has(aside) {
		grid-template-columns: minmax(0, 1fr) 150px;
	}

	.content {
		max-width: 100%;
	}

	aside {
		display: flex;
		flex-direction: column;
		gap: 10px;
		position: sticky;
		top: calc(var(--header-height) + 1rem);
		max-height: calc(100vh - var(--header-height));
		overflow-y: auto;
		align-self: start;
	}

	.date {
		text-align: center;
	}

	@media screen and (max-width: 1065px) {
		article {
			grid-template-columns: 100%;
		}
		aside {
			display: none;
		}
	}
</style>
