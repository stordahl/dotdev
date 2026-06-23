<script lang="ts">
	import type { allHomeGridCards } from 'content-collections';

	type HomeGridCard = (typeof allHomeGridCards)[number];
	type Props = {
		cards: HomeGridCard[];
	};

	let { cards }: Props = $props();
	let selectedCard = $state<HomeGridCard | null>(null);

	const externalHref = (href: string | undefined) => Boolean(href && /^https?:\/\//.test(href));
	const cardStyle = (card: HomeGridCard) => `--x: ${card.x}; --y: ${card.y};`;

	function openCard(card: HomeGridCard) {
		selectedCard = card;
	}

	function closeCard() {
		selectedCard = null;
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && closeCard()} />

<main class="home-grid" aria-labelledby="home-grid-title">
	<div class="home-grid__intro" aria-label="Homepage introduction">
		<p class="home-grid__eyebrow">Jacob Stordahl</p>
		<h1 id="home-grid-title">Design engineer, web developer, recovering artist.</h1>
		<nav aria-label="Primary">
			<a href="/work">Work</a>
			<a href="/writing">Writing</a>
			<a href="/sketch-book">Sketch Book</a>
			<a href="mailto:jacob@stordahl.dev">Contact</a>
		</nav>
	</div>

	<section class="home-grid__plane" aria-label="Homepage image grid">
		{#each cards as card (card.slug)}
			{#if card.interaction === 'link' && card.href}
				<a
					class={`home-card home-card--${card.size}`}
					style={cardStyle(card)}
					href={card.href}
					target={externalHref(card.href) ? '_blank' : undefined}
					rel={externalHref(card.href) ? 'noopener noreferrer' : undefined}
				>
					<img src={card.image} alt={card.alt} loading="lazy" />
					<span class="home-card__caption">
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
					aria-label={`Open ${card.title}`}
				>
					<img src={card.image} alt={card.alt} loading="lazy" />
					<span class="home-card__caption">
						<span>{card.label}</span>
						<strong>{card.title}</strong>
					</span>
				</button>
			{/if}
		{/each}
	</section>

	{#if selectedCard}
		<div class="home-grid__overlay" role="presentation">
			<div
				class="home-grid__modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="home-grid-modal-title"
				tabindex="-1"
			>
				<button class="home-grid__close" type="button" onclick={closeCard}>Close</button>
				<img src={selectedCard.image} alt={selectedCard.alt} />
				<div>
					<p>{selectedCard.label}</p>
					<h2 id="home-grid-modal-title">{selectedCard.title}</h2>
					{#if selectedCard.revealText}
						<p>{selectedCard.revealText}</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.home-grid {
		min-height: 100vh;
		padding: clamp(1rem, 2vw, 2rem);
		position: relative;
		overflow: hidden;
		background:
			radial-gradient(circle at 20% 20%, rgba(235, 94, 40, 0.18), transparent 28rem),
			radial-gradient(circle at 80% 30%, rgba(255, 252, 242, 0.09), transparent 24rem), var(--black);
	}

	.home-grid__intro {
		position: fixed;
		top: clamp(1rem, 2vw, 2rem);
		left: clamp(1rem, 2vw, 2rem);
		z-index: 2;
		max-width: min(34rem, calc(100vw - 2rem));
		padding: 1rem;
		border: 1px solid rgba(255, 252, 242, 0.28);
		border-radius: 1.25rem;
		background: rgba(28, 28, 27, 0.72);
		backdrop-filter: blur(14px);
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.28);
	}

	.home-grid__eyebrow,
	.home-grid__intro p {
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--light-grey);
	}

	.home-grid__intro h1 {
		max-width: 11em;
		margin: 0.25rem 0 0.85rem;
		font-size: clamp(1.8rem, 4vw, 4.5rem);
		line-height: 0.95;
	}

	.home-grid__intro nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.85rem;
	}

	.home-grid__plane {
		position: relative;
		width: max(120rem, 180vw);
		height: max(130rem, 210vh);
		transform: translate(-8rem, -5rem) rotate(-2deg);
	}

	.home-card {
		position: absolute;
		left: calc(var(--x) * clamp(9rem, 11vw, 15rem));
		top: calc(var(--y) * clamp(7rem, 8vw, 11rem));
		width: clamp(10rem, 16vw, 18rem);
		height: clamp(8rem, 12vw, 14rem);
		padding: 0;
		border: 1px solid rgba(255, 252, 242, 0.22);
		border-radius: 1rem;
		overflow: hidden;
		color: var(--white);
		background: var(--grey);
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.36);
		cursor: pointer;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.home-card--sm {
		width: clamp(8rem, 12vw, 13rem);
		height: clamp(7rem, 10vw, 11rem);
	}

	.home-card--lg {
		width: clamp(14rem, 21vw, 24rem);
		height: clamp(13rem, 19vw, 22rem);
	}

	.home-card--wide {
		width: clamp(16rem, 26vw, 30rem);
		height: clamp(9rem, 14vw, 16rem);
	}

	.home-card--tall {
		width: clamp(10rem, 15vw, 17rem);
		height: clamp(16rem, 24vw, 27rem);
	}

	.home-card:hover,
	.home-card:focus-visible {
		z-index: 1;
		transform: translateY(-0.5rem) scale(1.04) rotate(2deg);
		border-color: var(--orange);
		box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.48);
		outline: none;
	}

	.home-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.home-card__caption {
		position: absolute;
		inset: auto 0 0;
		display: grid;
		gap: 0.1rem;
		padding: 2.5rem 0.85rem 0.85rem;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.82));
		text-align: left;
	}

	.home-card__caption span {
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--light-grey);
	}

	.home-card__caption strong {
		font-size: clamp(0.95rem, 1.2vw, 1.2rem);
		line-height: 1.05;
	}

	.home-grid__overlay {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.78);
	}

	.home-grid__modal {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(16rem, 0.8fr);
		gap: 1rem;
		width: min(70rem, 100%);
		max-height: min(48rem, 92vh);
		padding: 1rem;
		border: 1px solid rgba(255, 252, 242, 0.3);
		border-radius: 1.25rem;
		background: var(--black);
		overflow: auto;
	}

	.home-grid__modal img {
		width: 100%;
		max-height: 80vh;
		object-fit: contain;
		border-radius: 0.8rem;
	}

	.home-grid__modal div {
		align-self: end;
	}

	.home-grid__modal p:first-child {
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--orange);
	}

	.home-grid__close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1;
		padding: 0.45rem 0.7rem;
		border: 1px solid rgba(255, 252, 242, 0.35);
		border-radius: 999px;
		color: var(--white);
		background: rgba(28, 28, 27, 0.82);
		cursor: pointer;
	}

	@media (max-width: 700px) {
		.home-grid {
			overflow: visible;
		}

		.home-grid__intro {
			position: relative;
			top: auto;
			left: auto;
			margin-bottom: 1rem;
		}

		.home-grid__plane {
			display: grid;
			width: auto;
			height: auto;
			transform: none;
			gap: 1rem;
		}

		.home-card,
		.home-card--sm,
		.home-card--md,
		.home-card--lg,
		.home-card--wide,
		.home-card--tall {
			position: relative;
			left: auto;
			top: auto;
			width: 100%;
			height: 16rem;
		}

		.home-grid__modal {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.home-card {
			transition: none;
		}
	}
</style>
