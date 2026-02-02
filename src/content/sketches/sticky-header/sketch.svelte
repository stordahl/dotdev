<script lang="ts">
	let scrollTop = $state(0);

	function handleScroll(event: Event) {
		if (event.target instanceof Element) {
			const target = event.target as Element;
			requestAnimationFrame(() => {
				scrollTop = target.scrollTop * 0.01;
			});
		}
	}
</script>

<div class="window-wrapper">
	<div class="window" onscroll={handleScroll}>
		<header style:--progress={scrollTop}>
			<span>Acme Corp.</span>
			<nav>
				<a href="#product">Product</a>
				<a href="#company">Company</a>
				<a href="#faq">FAQ</a>
			</nav>
			<button> Login </button>
		</header>
		<div class="content">
			<p>Some web content</p>
		</div>
	</div>
</div>

<style>
	.window-wrapper {
		--radius: 15px;
		--padding: 10px;
		border: 1px solid var(--grey);
		border-radius: var(--radius);
		width: 100%;
		height: 500px;
		overflow: hidden;
	}
	.window {
		color: black;
		background: white;
		padding: var(--padding);
		width: 100%;
		height: 100%;
		overflow: scroll;
		position: relative;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		font-weight: 500;
	}

	header {
		--shift: min(calc(var(--progress) * 10px), 10px);
		display: grid;
		grid-template-areas: 'logo nav login';
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		position: sticky;
		top: 0.5rem;
		padding-inline: var(--padding) 0;
		height: 3rem;
		background: white;

		&:before {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			border-radius: var(--radius);
			box-shadow: 0 0 15px #0000001a;
			opacity: var(--progress);
		}

		span {
			grid-area: logo;
			margin-left: var(--shift);
			font-size: 1.2rem;
		}

		nav {
			grid-area: nav;
			display: flex;
			align-items: center;
			gap: 10px;
		}

		button {
			grid-area: login;
			justify-self: end;
			margin-right: min(var(--shift), 8px);
			width: min-content;
			border: none;
			border-radius: calc(var(--radius) / 2);
			background: var(--grey);
			color: var(--white);
			padding: calc(var(--padding) / 2) var(--padding);
		}
	}

	.content {
		width: 80%;
		height: 600px;
		border: 1px dashed var(--grey);
		border-radius: calc(var(--radius) - var(--padding));
		margin: auto;
		margin-top: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
