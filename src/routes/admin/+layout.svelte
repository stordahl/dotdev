<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let { children, data } = $props();
	let authenticated = $derived(data.authenticated);

	$effect(() => {
		if (browser && !authenticated && $page.url.pathname !== '/admin') {
			location.href = '/admin';
		}
	});
</script>

{@render children()}
