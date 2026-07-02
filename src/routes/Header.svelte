<script lang="ts">
	import ThemePicker from '$lib/ThemePicker.svelte';
</script>

<header>
	<a href="/" aria-label="home">stordahl.dev</a>

	<nav>
		<a href="/writing">writing</a>
		<a href="/sketch-book">sketches</a>
		<ThemePicker />
	</nav>
</header>

<style>
	header {
		padding: 20px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 800px;
		margin: auto;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	a {
		color: var(--foreground);
		font-size: var(--font-sm);
	}
</style>
