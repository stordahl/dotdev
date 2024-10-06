<section>
	<h1>
		Don't be careful,<br />
		you'll
		<span><span id="live">live</span> <span id="squiggle"></span></span>
		too
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
	}

	span:has(#live) {
		position: relative;
	}

	#live {
		z-index: 1;
	}

	#squiggle {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/images/squiggle/9.svg');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		z-index: 0;
		opacity: 75%;
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
