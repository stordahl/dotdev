<script lang="ts">
	import Detail from '$lib/Detail.svelte';
	import Seo from '$lib/Seo.svelte';

	const content = [
		{
			content:
				'In Q2 of 2024, I was thinking about two specific problems my team was trying to solve - client specific style themes for our white label products, and a/b testing component styles. The real problem for us was that loading more than one stylesheet on every client site would balloon our CDN egress, and thus cost. The solution I designed to solve this problem made use of a Cloudflare worker that could dynamically generate CSS files made up of existing pre-built files. Our products can construct a request to this worker, and based on the parameters of that request, receive a dyamically generated stylesheet that includes all the disperate styles needed for the particular experience. We deployed this system in Q3 2024, and have rolled it out to a few clients.',
			title: 'Dynamic CSS at the Edge'
		},
		{
			content:
				'In Q3 of 2023, I was tasked with designing a system that would allow my team to monitor run-time errors from our many Third-Party JavaScript applications. Our suite of products are all client-side rendered widgets that require some configuration to render properly. This paradigm limits our implicit visibility into the run time of our applications, across the many websites they are running within. To solve this, I built a simple cloud function for ingesting events, and a client SDK for integration with our various products.',
			title: 'Error Monitoring Service',
			link: '/writing/third-party-errors',
			linkText: 'read more'
		},
		{
			content:
				'In Q4 2023 I began designing our shared component library that would power all of our products. The goal was not to build a true design system, but a library that could provide common UI functionality while still being easily stylable by consumers. I chose SvelteKit to build the library as it would allow us to build a Storybook-like sandbox to develop components in, and has a handy CLI for building libraries. The library has expanded greatly and is now being used (to some extent) in all of our products.',
			title: 'Svelte Component Library',
			link: 'https://web-assets.stylitics.com/ui/latest/index.html',
			linkText: 'check it out'
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
