<script lang="ts">
	import { onMount } from 'svelte';

	let rectangle: HTMLDivElement;
	let content: string = '';
	let rows: number = 30;
	let cols: number = 80;
	let fontSize: number = 12;
	let asciiChars: string[] =
		'`~!@#$%^&*()_+-={}[]|\\:;"\'<>,.?/1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
			''
		);
	let animationFrameId: number;
	let noiseMap: number[] = [];
	let width: number;
	let prefersReducedMotion: boolean = false;

	function generateNoise(): void {
		noiseMap = Array(rows * cols)
			.fill(0)
			.map(() => Math.random());
	}

	function generatePattern(): string {
		let pattern: string = '';
		for (let i: number = 0; i < rows; i++) {
			for (let j: number = 0; j < cols; j++) {
				pattern += asciiChars[Math.floor(Math.random() * asciiChars.length)];
			}
			pattern += '\n';
		}
		return pattern;
	}

	function animatePattern(): void {
		if (prefersReducedMotion) return;

		cancelAnimationFrame(animationFrameId);

		animationFrameId = requestAnimationFrame(() => {
			let newPattern: string = '';
			const timeOffset: number = Date.now() / 1000;
			for (let i: number = 0; i < rows; i++) {
				for (let j: number = 0; j < cols; j++) {
					const noiseValue: number = noiseMap[i * cols + j];
					const index: number = Math.floor((noiseValue * 10 + timeOffset) * 5) % asciiChars.length;
					newPattern += asciiChars[index];
				}
				newPattern += '\n';
			}
			content = newPattern;
			animatePattern();
		});
	}

	function handleResize(): void {
		const tempElement: HTMLSpanElement = document.createElement('span');
		tempElement.style.font = `${fontSize}px monospace`;
		tempElement.style.visibility = 'hidden';
		tempElement.textContent = 'X';
		document.body.appendChild(tempElement);
		const charWidth: number = tempElement.offsetWidth;
		document.body.removeChild(tempElement);

		cols = Math.floor(width / charWidth);
		fontSize = Math.max(15, Math.min(30, Math.floor(width / cols)));

		generateNoise();
		content = generatePattern();
		if (!prefersReducedMotion) {
			animatePattern();
		}
	}

	function checkReducedMotion(): void {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			cancelAnimationFrame(animationFrameId);
		} else {
			animatePattern();
		}
	}

	onMount(() => {
		checkReducedMotion();
		generateNoise();
		content = generatePattern();

		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotionQuery.addEventListener('change', checkReducedMotion);

		if (!prefersReducedMotion) {
			animatePattern();
		}
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
			reducedMotionQuery.removeEventListener('change', checkReducedMotion);
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<div class="ascii-container" bind:clientWidth={width}>
	<div
		bind:this={rectangle}
		class="ascii-rectangle"
		style="font-size: {fontSize}px;"
		aria-hidden="true"
	>
		<pre>{content}</pre>
	</div>
</div>

<style>
	.ascii-container {
		--foreground: #fff;
		width: 100%;
		box-sizing: border-box;
	}

	.ascii-rectangle {
		width: 100%;
		overflow: hidden;
		white-space: pre;
		line-height: 1;
		box-sizing: border-box;
		cursor: default;
		color: #fff;
		position: relative;
	}

	pre {
		padding: 0;
		margin: 0;
		color: color-mix(in srgb, var(--foreground), transparent 90%);
		margin-bottom: -1rem;
		overflow: hidden;
	}
</style>
