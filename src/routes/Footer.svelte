<script>
	import Bluesky from '$lib/icons/Bluesky.svelte';
	import Github from '$lib/icons/Github.svelte';
	import Linkedin from '$lib/icons/Linkedin.svelte';

	let { authenticated } = $props();

</script>

<footer>
	<div class="footer-header">
		<div class="copyright">
			<span>© {new Date().getFullYear()} Jacob Stordahl</span>
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
	</div>
	<div class="footer-links">
		<ul>
			<li><a href="/">home</a></li>
			<li><a href="/writing">writing</a></li>
			<li><a href="/sketches">sketches</a></li>
			<li><a href="/ping">ping</a></li>
			{#if authenticated}
				<li>
					<a href="/admin">admin</a>
					<span class="separator">|</span>
					<a href="/logout">logout</a>
				</li>
			{:else}
				<li><a href="/admin">admin</a></li>
			{/if}
		</ul>
		<span class="tagline">don't be<br />careful, you'll<br />live too long</span>
	</div>
</footer>

<style>
	footer {
		font-size: var(--font-sm);
		margin: 30px auto;
	}

	.footer-header {
		display: flex;
		justify-content: space-between;
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

	.footer-links {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: 15px;
		ul {
			padding-left: 0px;
			list-style: none;
			font-size: var(--font-xs);
			color: var(--secondary);
			li *:not(:hover) {
				text-decoration: none;
			}
			li *:hover {
				color: var(--secondary);
			}
		}
		.tagline {
			text-align: right;
			font-family: 'Rock Salt', cursive;
			color: var(--secondary);
		}
	}

	.separator {
		margin: 0 3px;
	}
</style>
