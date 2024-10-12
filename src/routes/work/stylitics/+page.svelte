<script lang="ts">
	import Detail from '$lib/Detail.svelte';
	import Seo from '$lib/Seo.svelte';

	const content = [
		{
			content:
				'In Q3 of 2023, while at Stylitics, I was tasked with designing a system that would allow my team to monitor run-time errors from our many Third-Party JavaScript applications. Our suite of products are all client-side rendered widgets that require some configuration to render properly. This paradigm limits our implicit visibility into the run time of our applications, across the many websites they are running within.',
			title: 'Dynamic CSS at the Edge'
		},
		{
			content:
				'In Q3 of 2023, while at Stylitics, I was tasked with designing a system that would allow my team to monitor run-time errors from our many Third-Party JavaScript applications. Our suite of products are all client-side rendered widgets that require some configuration to render properly. This paradigm limits our implicit visibility into the run time of our applications, across the many websites they are running within.',
			title: 'Error Monitoring Service',
			link: '/writing/third-party-errors',
			linkText: 'read more'
		},
		{
			content:
				'In Q3 of 2023, while at Stylitics, I was tasked with designing a system that would allow my team to monitor run-time errors from our many Third-Party JavaScript applications. Our suite of products are all client-side rendered widgets that require some configuration to render properly. This paradigm limits our implicit visibility into the run time of our applications, across the many websites they are running within.',
			title: 'Svelte Component Library',
			link: '/writing/third-party-errors',
			linkText: 'read more'
		}
	];
</script>

<Seo
	title="Stylitics | Jacob Stordahl"
	description="A look at my work for Stylitics"
	ogImage="/images/og/work.jpg"
/>

<section>
	<h1>Stylitics</h1>
	<p>
		<a href="https://stylitics.com">Stylitics</a> is an e-commerce content platform that provides an
		end to end solution for product bundling. In January 2022, I joined the Experiences Team at Stylitics
		where we build a number of Third Party JavaScript widgets that provide user experiences on top of
		the content produced by our platform. Aside from directly contributing to our products, most of my
		contributions are related to tooling and infrastructure that supports the team.
	</p>

	<h2>Projects</h2>
	{#each content as { content: _content, link, linkText, title }, index}
		<Detail index={index + 1} {link} {linkText} {title} --detail-font-size="clamp(2rem, 4vw, 3rem)">
			<p>{_content}</p>
		</Detail>
	{/each}

	<h3>Other contributions</h3>
	<ul class="list">
		<li>Championed git based deployment strategy</li>
		<li>Built and Deployed Shop the Set, a product specifically for Swim/Intimates</li>
		<li>Formalized patterns for deploying serverless services to serve the team</li>
		<li>Migrated our build system from Rollup & custom plugins to Vite</li>
		<li>Contributed to planning and implementation of our gradual shift to TypeScript</li>
		<li>Contributed to the architecture of our shared libraries</li>
		<li>Migrated our large monorepo to pnpm + workspaces</li>
		<li>Contributed to our migration of unit testing from Mocha to Vitest</li>
	</ul>
</section>

<style>
	section {
		max-width: 800px;
		margin: auto;
	}

	h1 {
		font-size: var(--font-size-large);
		text-align: center;
		margin: 1.5rem 0;
	}

	h2 {
		font-size: clamp(2rem, calc(2rem + 3vw), 4rem);
		text-align: center;
		padding: 3rem 0 2rem;
	}

	h3 {
		font-size: clamp(1.5rem, calc(1.5rem + 2vw), 3rem);
		padding: 3rem 0 2rem;
		text-align: center;
	}

	p {
		max-width: 700px;
		margin: auto;
	}

	.list {
		display: grid;
		grid-template-columns: repeat(auto-fill, 200px);
		justify-content: space-around;
		gap: 10px;
	}

	li {
		font-size: clamp(1rem, calc(1rem + 1vw), 1.35rem);
	}
</style>
