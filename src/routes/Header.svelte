<script lang="ts">
	import DiscordStatus from '$lib/DiscordStatus.svelte';
</script>

<header>
	<a href="/" aria-label="home page">
		<img src="/images/star-pair.svg" alt="a pair of star icons" />
	</a>

	<nav>
		<a href="/work">work</a>
		<a href="/writing">writing</a>
		<a href="/sketch-book">sketches</a>
		<DiscordStatus />
	</nav>
</header>

<style>
	header {
		padding: 20px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: var(--border);
	}

	nav {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	a {
		color: var(--white);
		font-size: 1.25rem;
	}

	a:has(img) {
		transform: scale(0.8);
		transition: transform 0.2s ease-in-out 0s;
		border: none;
		&:hover {
			transform: scale(0.9);
		}
		&:after {
			display: none;
		}
	}
</style>
