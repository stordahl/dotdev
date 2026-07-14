<script lang="ts">
	import './style.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Scripts from '$lib/Scripts.svelte';
	import { theme, themes } from '$lib/stores/theme.svelte';

	let { children } = $props();

	$effect(() => {
		if (typeof document === 'undefined') return;
		const t = themes[theme.current];
		document.documentElement.style.setProperty('--theme-secondary', t.color);
		document.documentElement.style.setProperty('--banner-light', `url('/images/${t.image}-light.jpg')`);

		const mode = theme.mode;
		if (mode === 'system') {
			document.documentElement.removeAttribute('data-mode');
		} else {
			document.documentElement.setAttribute('data-mode', mode);
		}
	});
</script>

<a href="#main-content" class="skip-link">Skip to content</a>

<div>
	<Header />
	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>
	<Footer />
</div>

<Scripts />

<style>
	div {
		max-width: 525px;
		margin: auto;
	}
</style>
