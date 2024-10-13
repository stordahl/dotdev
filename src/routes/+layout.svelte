<script lang="ts">
	import './style.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Scripts from '$lib/Scripts.svelte';

	let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />

<Scripts />
