<script>
	import Bluesky from '$lib/icons/Bluesky.svelte';
	import DiscordStatus from '$lib/DiscordStatus.svelte';
	import Github from '$lib/icons/Github.svelte';
	import Linkedin from '$lib/icons/Linkedin.svelte';
</script>

<footer>
	<div class="copyright">
		<span>© {new Date().getFullYear()} Jacob Stordahl</span>
		<DiscordStatus />
	</div>
	<div class="social-links">
		<a href="https://bsky.app/profile/stordahl.dev">
			<Bluesky />
		</a>
		<a href="https://github.com/stordahl">
			<Github />
		</a>
		<a href="https://linkedin.com/in/jacobstordahl">
			<Linkedin />
		</a>
	</div>
</footer>

<style>
	footer {
		display: flex;
		justify-content: space-between;
		font-size: var(--font-sm);
		margin: 30px auto;
	}

	.copyright {
		display: flex;
		align-items: center;
		span {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 7px;
		}
	}

	.social-links {
		display: flex;
		gap: 5px;
		:global(svg) {
			width: 20px;
			fill: var(--foreground);
		}
	}
</style>
