<script lang="ts">
	import { page } from '$app/stores';
	import './style.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Scripts from '$lib/Scripts.svelte';

	let { children } = $props();
	let isHome = $derived($page.url.pathname === '/');
</script>

{#if isHome}
	{@render children()}
{:else}
	<div class="page-shell">
		<Header />
		{@render children()}
		<Footer />
	</div>
{/if}

<Scripts />
