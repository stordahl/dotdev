<script lang="ts">
	import './style.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Scripts from '$lib/Scripts.svelte';

	let { children } = $props();
</script>

<div>
	<Header />
	{@render children()}
	<Footer />
</div>

<Scripts />

<style>
	div {
		max-width: 525px;
		margin: auto;
	}
</style>
