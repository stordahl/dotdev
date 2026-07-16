<script lang="ts">
	let audio: HTMLAudioElement;
	let playing = $state(false);
	let volume = $state(0.3);

	function togglePlay() {
		if (playing) {
			audio.pause();
		} else {
			audio.play();
		}
		playing = !playing;
	}

	function handleVolume(e: Event) {
		const target = e.target as HTMLInputElement;
		volume = parseFloat(target.value);
		if (audio) audio.volume = volume;
	}
</script>

<audio
	bind:this={audio}
	src="/audio/background-cut.mp3"
	loop
	onpause={() => (playing = false)}
	onplay={() => (playing = true)}
></audio>

<div class="player">
	<div class="player-inner">
		<div class="play-btn-wrap">
			<button
				class="play-btn"
				onclick={togglePlay}
				aria-label={playing ? 'Pause background audio' : 'Play background audio'}
			>
				{#if playing}
					<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
						<rect x="1" y="0" width="3" height="10" rx="0.5" />
						<rect x="6" y="0" width="3" height="10" rx="0.5" />
					</svg>
				{:else}
					<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
						<polygon points="1,0 10,5 1,10" />
					</svg>
				{/if}
			</button>
			<span>Lake Superior, July 7th, 2026</span>
		</div>

		<div class="volume-wrap">
			<svg class="vol-icon" width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
				<polygon points="0.5,4 3.5,4 6.5,1 6.5,11 3.5,8 0.5,8" />
				<path d="M8.5 4.5a2.5 2.5 0 0 1 0 3" stroke="currentColor" fill="none" stroke-width="1" />
				<path d="M10 3a5 5 0 0 1 0 6" stroke="currentColor" fill="none" stroke-width="1" />
			</svg>
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={volume}
				oninput={handleVolume}
				class="vol-slider"
				aria-label="Volume"
			/>
		</div>
	</div>
</div>

<style>
	.player {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 4px 16px;
		height: 26px;
		background: var(--background);
		border-bottom: 1px solid color-mix(in srgb, var(--foreground) 12%, transparent);
		-webkit-backdrop-filter: blur(4px);
		backdrop-filter: blur(4px);
	}

	.player-inner {
		display: flex;
		width: 100%;
		max-width: 525px;
		justify-content: space-between;
	}

	.play-btn-wrap {
		display: flex;
		span {
			font-size: calc(var(--font-xs) * 0.9);
			font-style: italic;
			display: block;
			line-height: 1.8;
		}
	}

	.play-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--secondary);
		width: 20px;
		height: 20px;
		transition: opacity 0.15s;
	}

	.play-btn:hover {
		opacity: 0.6;
	}

	.volume-wrap {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.vol-icon {
		color: var(--secondary);
		flex-shrink: 0;
		opacity: 0.6;
	}

	.vol-slider {
		-webkit-appearance: none;
		appearance: none;
		width: 60px;
		height: 3px;
		background: color-mix(in srgb, var(--foreground) 20%, transparent);
		border-radius: 2px;
		outline: none;
		cursor: pointer;
	}

	.vol-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--secondary);
		cursor: pointer;
		transition: transform 0.15s;
	}

	.vol-slider::-webkit-slider-thumb:hover {
		transform: scale(1.4);
	}

	.vol-slider::-moz-range-thumb {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--secondary);
		border: none;
		cursor: pointer;
	}
</style>
