<script lang="ts">
	import Work from './Work.svelte';
	import Seo from '$lib/Seo.svelte';
</script>

<Seo />

<section>
	<div class="banner"></div>
	<h1>Hi, I'm Jacob</h1>
	<p>
		I'm a Software Engineer, Web Developer, and recovering musician. I’ve been building stuff on the
		web for a decade, and still love crafting exceptional user experiences. Currently, I’m a
		Software Engineer at <a href="https://stylitics.com">Stylitics</a>. I'm also a maintainer of a
		number of open source projects, including the
		<a href="https://counterscale.dev">Counterscale</a> analytics project.
	</p>
</section>
<Work />

<style>
	.banner {
		height: 150px;
		width: 100%;
		background-image: light-dark(url('/images/blue-sky.jpg'), url('/images/cloud.jpg'));
		background-size: cover;
		margin-bottom: 30px;
	}

	h1 {
		font-size: var(--font-lg);
		line-height: 1;
		margin-bottom: 10px;
	}

	p {
		font-size: var(--font-lg);
	}
</style>
