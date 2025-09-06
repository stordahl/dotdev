<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, scroll } from 'motion';

	let isLoaded = false;

	onMount(() => {
		isLoaded = true;
	});

	export function generateTransforms(
		threshold: number,
		position: number,
		totalWords: number
	): { x: number; y: number } {
		const isLeftHalf = position < totalWords / 2;
		const x = isLeftHalf
			? -Math.random() * threshold // Move left
			: Math.random() * threshold; // Move right
		const y = -Math.random() * threshold * 4; // Move upwards

		return { x, y };
	}

	function textScatter(node: HTMLElement) {
		if (typeof node?.textContent !== 'string') {
			console.error('no text content in node');
			return;
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		node.ariaLabel = node.innerText;
		const words = node.querySelectorAll('span');

		const transitions = [
			{ x: -150, y: -250, rotate: -10 }, // dont
			{ x: 0, y: -310, rotate: 6 }, // be
			{ x: 150, y: -250, rotate: 3 }, // careful
			{ x: -150, y: -270, rotate: -12 }, // you'll
			{ x: -50, y: -320, rotate: -15 }, // live
			{ x: 50, y: -320, rotate: 10 }, // too
			{ x: 150, y: -250, rotate: 15 } // long
		];

		words.forEach((word, index) => {
			const { x, y, rotate } = transitions[index];
			const spacing = randomIntFromInterval(15, 35);
			const animation = animate(word, {
				x: [0, x],
				y: [0, y],
				rotate,
				'--letter-spacing': ['0px', `${spacing}px`]
			});
			scroll(animation, { offset: ['start start', 'center center'] });
		});
	}

	function randomIntFromInterval(min: number, max: number) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
</script>

<section class:loaded={isLoaded}>
	<h1 use:textScatter>
		<span>Don't </span>
		<span>be </span>
		<span>careful, </span><br />
		<span>you'll </span>
		<span>live</span>
		<span>too</span>
		<span id="long">long</span>
	</h1>
	<div class="cloud">
		<img src="/images/cloud.jpg" aria-hidden={true} alt="" />
	</div>
</section>

<style>
	section {
		padding-top: 90px;
		margin-bottom: 480px;
		h1,
		img {
			filter: blur(15px);
			transition: filter 1.2s ease-out;
			will-change: filter;
		}
	}

	section.loaded {
		h1,
		img {
			filter: blur(0);
		}
	}

	h1 {
		text-align: center;
		font-size: clamp(2rem, calc(2rem + 5vw), 6rem);
		z-index: 2;
		margin-bottom: 80px;
		position: relative;
	}

	span {
		position: relative;
		display: inline-block;
		letter-spacing: var(--letter-spacing);
	}

	span:has(#live) {
		position: relative;
	}

	#long:after {
		content: '';
		background-image: url('/images/star.svg');
		background-size: cover;
		width: clamp(75px, calc(75px + 4vw), 150px);
		height: clamp(75px, calc(75px + 4vw), 150px);
		position: absolute;
		bottom: 0;
		right: 0;
		transform: translate(65%, 80%);
		z-index: 1;
	}

	.cloud {
		height: 400px;
		width: 100%;
		position: absolute;
		left: 0;
		z-index: 0;
		overflow-x: hidden;
	}

	.cloud img {
		width: auto;
		height: 100%;
		min-width: 100%;
		object-fit: cover;
	}
</style>
