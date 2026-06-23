<script lang="ts">
	import type { allHomeGridCards } from 'content-collections';

	type HomeGridCard = (typeof allHomeGridCards)[number];
	type Props = {
		cards: HomeGridCard[];
	};

	let { cards }: Props = $props();
	let selectedCard = $state<HomeGridCard | null>(null);

	const externalHref = (href: string | undefined) => Boolean(href && /^https?:\/\//.test(href));
	const cardStyle = (card: HomeGridCard) => `--card-index: ${card.x + card.y};`;

	function openCard(card: HomeGridCard) {
		selectedCard = card;
	}

	function closeCard() {
		selectedCard = null;
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && closeCard()} />

<main class="home-grid" aria-labelledby="home-grid-title">
	<header class="home-grid__bar" aria-label="Homepage navigation">
		<a class="home-grid__mark" href="/" aria-label="Jacob Stordahl homepage">
			<span>JS</span>
		</a>

		<nav class="home-grid__nav" aria-label="Primary">
			<a href="/work">Work</a>
			<a href="/writing">Writing</a>
			<a href="/sketch-book">Sketch Book</a>
		</nav>

		<div class="home-grid__search" aria-hidden="true">
			<span class="home-grid__collection">stordahl.dev</span>
			<span>Search...</span>
		</div>

		<div class="home-grid__actions">
			<a href="https://github.com/stordahl" target="_blank" rel="noopener noreferrer">GitHub</a>
			<a class="home-grid__contact" href="mailto:jacob@stordahl.dev">Contact</a>
		</div>
	</header>

	<section class="home-grid__intro" aria-label="Homepage introduction">
		<p>public archive / selected work</p>
		<h1 id="home-grid-title">
			Jacob Stordahl — design engineer, web developer, recovering artist.
		</h1>
	</section>

	<section class="home-grid__board" aria-label="Homepage image board">
		{#each cards as card (card.slug)}
			{#if card.interaction === 'link' && card.href}
				<a
					class={`home-card home-card--${card.size}`}
					style={cardStyle(card)}
					href={card.href}
					target={externalHref(card.href) ? '_blank' : undefined}
					rel={externalHref(card.href) ? 'noopener noreferrer' : undefined}
					aria-label={`${card.title}: ${card.label}`}
				>
					<img src={card.image} alt={card.alt} loading="lazy" />
					<span class="home-card__meta" aria-hidden="true">
						<span>{card.label}</span>
						<strong>{card.title}</strong>
					</span>
				</a>
			{:else}
				<button
					class={`home-card home-card--${card.size}`}
					style={cardStyle(card)}
					type="button"
					onclick={() => openCard(card)}
					aria-label={`Open ${card.title}: ${card.label}`}
				>
					<img src={card.image} alt={card.alt} loading="lazy" />
					<span class="home-card__meta" aria-hidden="true">
						<span>{card.label}</span>
						<strong>{card.title}</strong>
					</span>
				</button>
			{/if}
		{/each}
	</section>

	<button
		class="home-grid__info"
		type="button"
		onclick={() => openCard(cards.find((card) => card.label === 'About') ?? cards[0])}
		aria-label="About this page"
	>
		i
	</button>

	{#if selectedCard}
		<div class="home-grid__overlay" role="presentation">
			<button
				class="home-grid__backdrop"
				type="button"
				onclick={closeCard}
				aria-label="Close detail"
			></button>
			<div
				class="home-grid__modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="home-grid-modal-title"
				tabindex="-1"
			>
				<button class="home-grid__close" type="button" onclick={closeCard}>Close</button>
				<img src={selectedCard.image} alt={selectedCard.alt} />
				<div class="home-grid__detail">
					<p>{selectedCard.label}</p>
					<h2 id="home-grid-modal-title">{selectedCard.title}</h2>
					{#if selectedCard.revealText}
						<p>{selectedCard.revealText}</p>
					{/if}
					{#if selectedCard.href}
						<a
							href={selectedCard.href}
							target={externalHref(selectedCard.href) ? '_blank' : undefined}
							rel={externalHref(selectedCard.href) ? 'noopener noreferrer' : undefined}
						>
							Open link
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	:global(body:has(.home-grid)) {
		background: #f7f6f3;
		color: #0d0d0d;
	}

	.home-grid {
		--home-bg: #f7f6f3;
		--home-ink: #0d0d0d;
		--home-muted: #9a9791;
		--home-line: #dedbd4;
		--home-pill: rgba(255, 255, 255, 0.74);

		min-height: 100vh;
		padding: 0 0 6rem;
		overflow-x: auto;
		background: var(--home-bg);
		color: var(--home-ink);
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}

	.home-grid__bar {
		position: sticky;
		top: 0;
		z-index: 5;
		display: grid;
		grid-template-columns: auto auto minmax(18rem, 26rem) auto;
		align-items: center;
		gap: 0.6rem;
		width: max(100%, 74rem);
		padding: 1.55rem 2rem 1.35rem;
		background: linear-gradient(var(--home-bg) 72%, rgba(247, 246, 243, 0));
	}

	.home-grid__mark,
	.home-grid__nav,
	.home-grid__search,
	.home-grid__contact {
		border: 1px solid var(--home-line);
		background: var(--home-pill);
		backdrop-filter: blur(16px);
	}

	.home-grid__mark {
		display: grid;
		place-items: center;
		width: 3.35rem;
		height: 3.35rem;
		border-radius: 999px;
		color: var(--home-ink);
		font-weight: 750;
		font-size: 0.72rem;
		letter-spacing: -0.04em;
	}

	.home-grid__nav {
		display: flex;
		gap: 0.15rem;
		align-items: center;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
	}

	.home-grid__nav a,
	.home-grid__actions a {
		padding: 0.75rem 1rem;
		color: var(--home-ink);
		font-size: 0.95rem;
		font-weight: 650;
		line-height: 1;
		text-decoration: none;
		border: 0;
	}

	.home-grid__nav a::after,
	.home-grid__actions a::after,
	.home-grid__mark::after,
	.home-card::after,
	.home-grid__detail a::after {
		display: none;
	}

	.home-grid__search {
		display: flex;
		justify-self: center;
		align-items: center;
		gap: 0.9rem;
		width: min(100%, 26rem);
		min-height: 3.35rem;
		padding: 0 1.35rem;
		border-radius: 999px;
		color: var(--home-muted);
		font-weight: 600;
	}

	.home-grid__search::before {
		content: '';
		width: 0.72rem;
		height: 0.72rem;
		border: 2px solid #b8b5ae;
		border-radius: 999px;
		box-shadow: 0.38rem 0.38rem 0 -0.28rem #b8b5ae;
		transform: translateY(-1px) rotate(-8deg);
	}

	.home-grid__collection {
		color: #d0cdc6;
	}

	.home-grid__actions {
		display: flex;
		justify-self: end;
		align-items: center;
		gap: 0.55rem;
	}

	.home-grid__actions .home-grid__contact {
		padding: 1rem 1.25rem;
		border-radius: 999px;
		color: #fff;
		background: #0b0b0b;
	}

	.home-grid__intro {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.home-grid__board {
		column-width: 17.5rem;
		column-gap: 1.9rem;
		width: max(100vw, 92rem);
		min-height: calc(100vh - 6.5rem);
		padding: 0 2rem 4rem;
	}

	.home-card {
		position: relative;
		display: inline-block;
		width: 100%;
		margin: 0 0 1.9rem;
		padding: 0;
		break-inside: avoid;
		border: 0;
		border-radius: 0.2rem;
		appearance: none;
		background: #e8e3d6;
		color: var(--home-ink);
		cursor: pointer;
		overflow: hidden;
		transition:
			filter 140ms ease,
			opacity 140ms ease,
			transform 140ms ease;
	}

	.home-card:hover,
	.home-card:focus-visible {
		filter: saturate(1.04) contrast(1.02);
		opacity: 0.94;
		outline: none;
		transform: translateY(-2px);
	}

	.home-card:focus-visible {
		box-shadow: 0 0 0 3px #111;
	}

	.home-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.home-card--sm {
		aspect-ratio: 1.22;
	}

	.home-card--md {
		aspect-ratio: 1;
	}

	.home-card--lg {
		aspect-ratio: 0.86;
	}

	.home-card--wide {
		aspect-ratio: 1.55;
	}

	.home-card--tall {
		aspect-ratio: 0.68;
	}

	.home-card__meta {
		position: absolute;
		left: 0.55rem;
		right: 0.55rem;
		bottom: 0.55rem;
		display: grid;
		gap: 0.08rem;
		padding: 0.5rem 0.6rem;
		border-radius: 0.55rem;
		background: rgba(255, 255, 255, 0.84);
		box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.08);
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 140ms ease,
			transform 140ms ease;
	}

	.home-card:hover .home-card__meta,
	.home-card:focus-visible .home-card__meta {
		opacity: 1;
		transform: translateY(0);
	}

	.home-card__meta span {
		color: var(--home-muted);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1;
		text-transform: uppercase;
	}

	.home-card__meta strong {
		color: var(--home-ink);
		font-size: 0.86rem;
		line-height: 1.1;
	}

	.home-grid__info {
		position: fixed;
		right: 2rem;
		bottom: 2rem;
		z-index: 4;
		display: grid;
		place-items: center;
		width: 2.8rem;
		height: 2.8rem;
		border: 0;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.12);
		color: var(--home-ink);
		font-family: Georgia, serif;
		font-size: 1.1rem;
		font-style: italic;
		cursor: pointer;
	}

	.home-grid__overlay {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: 1rem;
	}

	.home-grid__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(247, 246, 243, 0.72);
		backdrop-filter: blur(18px);
		cursor: zoom-out;
	}

	.home-grid__modal {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.42fr);
		gap: 1.25rem;
		width: min(74rem, 94vw);
		max-height: min(48rem, 90vh);
		padding: 0.9rem;
		border: 1px solid var(--home-line);
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.16);
		overflow: auto;
	}

	.home-grid__modal img {
		width: 100%;
		max-height: 82vh;
		object-fit: contain;
		border-radius: 0.5rem;
		background: #eee8dc;
	}

	.home-grid__detail {
		align-self: end;
		padding: 1rem 0.5rem 0.5rem;
	}

	.home-grid__detail p:first-child {
		margin-bottom: 0.4rem;
		color: var(--home-muted);
		font-size: 0.72rem;
		font-weight: 750;
		letter-spacing: 0.1em;
		line-height: 1;
		text-transform: uppercase;
	}

	.home-grid__detail h2 {
		margin-bottom: 0.75rem;
		font-family: inherit;
		font-size: clamp(1.8rem, 3vw, 3.25rem);
		font-weight: 700;
		letter-spacing: -0.06em;
		line-height: 0.95;
	}

	.home-grid__detail p {
		font-size: 1rem;
		line-height: 1.45;
	}

	.home-grid__detail a {
		display: inline-flex;
		margin-top: 1rem;
		padding: 0.8rem 1rem;
		border-radius: 999px;
		color: #fff;
		background: #0b0b0b;
		font-weight: 700;
	}

	.home-grid__close {
		position: absolute;
		top: 1.2rem;
		right: 1.2rem;
		z-index: 1;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--home-line);
		border-radius: 999px;
		color: var(--home-ink);
		background: rgba(255, 255, 255, 0.86);
		cursor: pointer;
	}

	@media (max-width: 760px) {
		.home-grid {
			overflow-x: hidden;
		}

		.home-grid__bar {
			grid-template-columns: auto 1fr auto;
			width: 100%;
			padding: 1rem;
		}

		.home-grid__nav {
			display: none;
		}

		.home-grid__search {
			justify-self: stretch;
			min-width: 0;
		}

		.home-grid__collection {
			display: none;
		}

		.home-grid__actions a:first-child {
			display: none;
		}

		.home-grid__actions .home-grid__contact {
			padding: 0.9rem 1rem;
		}

		.home-grid__board {
			column-width: 10.5rem;
			column-gap: 1rem;
			width: 100%;
			padding: 0 1rem 5rem;
		}

		.home-card {
			margin-bottom: 1rem;
		}

		.home-card__meta {
			opacity: 1;
			transform: none;
		}

		.home-grid__modal {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.home-card,
		.home-card__meta {
			transition: none;
		}
	}
</style>
