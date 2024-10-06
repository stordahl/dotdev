<script lang="ts">
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';
  import { sidebar } from "./sidebar.svelte";

	const { data }: { data: PageData } = $props();

  let aside: HTMLElement | undefined = $state();
  let showAside = $state(true);
  let header: HTMLElement | undefined = $state();
  const headerHeight = $derived(header?.clientHeight ?? 0)
  const headerOffset = $derived(header?.getBoundingClientRect().bottom ?? 0);

  const handleScroll = function() {
    const windowScrollTop = window.scrollY;
    if (header && elementToHide) {
      const clipAmount = Math.max(0, windowScrollTop - headerOffset + headerHeight);
      elementToHide.style.clipPath = `inset(${clipAmount}px 0 0 0)`;
    }
  }

  let elementToHide: HTMLElement | undefined;

  const handleResize = function () {
    if (aside && window.innerWidth < 1065) showAside = false; 
    if (!aside && window.innerWidth >= 1065) showAside = true;
  }
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleResize}/>

<div class="header" bind:this={header}>
	<h1>{data.meta.title}</h1>
	<p class="date">Published {formatDate(data.meta.date)}</p>
</div>
<article bind:this={elementToHide}>
  <div class="content">
	  {@render data.content()}
  </div>
  {#if showAside}
    <aside use:sidebar={{ marginTop: headerHeight }} bind:this={aside} style:--header-height="{headerHeight}px"></aside>
  {/if}
</article>

<style>
	h1 {
		font-size: clamp(2rem, calc(2rem + 2vw), 3.5rem);
		text-align: center;
	}

	.header {
		padding: 2rem 0;
		border-bottom: 1px solid var(--orange);
    position: sticky;
    top: 0;
    background:inherit;
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
    max-height: calc(100vh - 6rem); /* Subtract header height and some padding */
    overflow-y: auto;
    align-self: start;
  }

	.date {
		text-align: center;
	}

  @media screen and (max-width: 1065px) {
    article {
      grid-template-columns: 1fr;
    }
    aside {
      display: none;
    }
  }
</style>
