<script lang="ts">
	import Detail from '$lib/Detail.svelte';
	import Seo from '$lib/Seo.svelte';

	const content = [
		{
			content:
				'In Q2 of 2024, I was thinking about two specific problems my team was trying to solve - client specific style themes for our white label products, and a/b testing component styles. The real problem for us was that loading more than one stylesheet on every client site would balloon our CDN egress, and thus cost. The solution I designed to solve this problem made use of a Cloudflare worker that could dynamically generate CSS files made up of existing pre-built files. Our products can construct a request to this worker, and based on the parameters of that request, receive a dyamically generated stylesheet that includes all the disperate styles needed for the particular experience. We deployed this system in Q3 2024, and it has been handling millions of requests a month ever since.',
			title: 'Dynamic CSS at the Edge',
			link: '/writing/dynamic-styles-at-the-edge',
			linkText: 'read more'
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
				'In Q4 2023 I began designing our shared component library that would power all of our products. The goal was not to build a true design system, but a library that could provide common UI functionality while still being easily stylable by consumers. I chose SvelteKit to build the library as it would allow us to build a Storybook-like sandbox to develop components in, and has a handy CLI for building libraries. The library has expanded greatly and is now being used in all of our products.',
			title: 'Svelte Component Library',
			link: 'https://web-assets.stylitics.com/ui/latest/index.html',
			linkText: 'check it out'
		}
	];
</script>

<Seo title="Stylitics | Jacob Stordahl" description="A look at my work for Stylitics" />

<section>
	<h1>Stylitics</h1>
	<p>
		<a href="https://stylitics.com">Stylitics</a> is an e-commerce tech company that provides end to end
		solutions for product bundling, product data enrichment, and more recently AI powered product photography.
		In January 2022, I joined the Experiences Team at Stylitics where I helped build a number of Third
		Party JavaScript widgets that provide user experiences on top of the product bundling content produced
		by our platform. Aside from directly contributing to the widget UIs, most of my contributions have
		been related to codebase architecture, tooling and infrastructure that supports the team.
	</p>

	<p>
		In December of 2025, I transitioned to a new team to support our AI Image platform as the
		founding engineer. Since joining, my contributions have been broad from migrating the
		create-react-app frontend to Vite, Tanstack, Tailwind and shadcn, to implementing version
		systems for image generation prompts and auth/user role permissions.
	</p>

	<h2>Projects</h2>
	{#each content as { content: _content, link, linkText, title }}
		<Detail {link} {linkText} {title}>
			<p>{_content}</p>
		</Detail>
	{/each}
</section>

<style>
	section {
		max-width: 800px;
		margin: auto;
	}
</style>
