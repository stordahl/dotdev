<script lang="ts">
	import type { Sketch } from "$lib/types";
  import { page } from '$app/stores';
	import { browser } from "$app/environment";
	import Seo from "$lib/Seo.svelte";
	import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  const { code, component: Component, sketches } = $derived(data);
  const sketch = $derived(sketches.find((s: Sketch) => s.slug === $page.params.sketch))

  let visibleTab: "code" | "preview" = $state("preview");

/* eslint-disable svelte/no-at-html-tags */
</script>

<Seo
	title="{sketch?.title} | Jacob Stordahl"
	description="from my sketchbook"
	ogImage="/images/og/sketches.jpg"
/>

<article>
  <a href="/sketch-book" class="back">&larr; Back</a>
  <h1>{sketch?.title}</h1>

  <div class="tabs">
    <button 
      class:active={visibleTab === "preview"}
      onclick={() => visibleTab = "preview"}
    >Preview</button>
    <button 
      class:active={visibleTab === "code"}
      onclick={() => visibleTab = "code"}
    >Code</button>
  </div>
  <div class="tabs-content">
  {#if visibleTab === "preview"}
    {#if browser}
      <Component />
    {/if}
  {:else}
    <div class="code">
    {@html code?.toString()}
    </div>
  {/if}
  </div>
</article>

<style>
  article {
    max-width: 700px;
    margin: 2rem auto;
  }

  .back {
    display: block;
    margin-bottom: 10px;
    width: max-content;
  }

  .tabs {
    border-bottom: 1px solid var(--grey);
  }

  .tabs button {
   background: none; 
   border: none;
   color: var(--light-grey);
   padding: 5px 10px;
  }

  .tabs button:hover {
    cursor: pointer;
  }

  .tabs button.active {
    color: var(--orange);
  }

  .tabs-content {
    max-width: 700px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
  }

  .code {
    width: 100%;
    height: 100%;
    overflow: scroll;
    border-radius: 8px;
  }
</style>
