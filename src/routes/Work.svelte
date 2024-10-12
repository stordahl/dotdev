<script lang="ts">
	import Detail from '../lib/Detail.svelte';

	const workItems = [
		{
			title: "Stylitics",
			service: "Development",
			link: "/work/stylitics",
			linkText: "read more",
			description: "In January 2022, I joined the Experiences Team at Stylitics where we build a number of Third Party JavaScript widgets that provide user experiences on top of the content produced by our platform. Aside from directly contributing to our products, most of my contributions are related to tooling and infrastructure that supports the team."
		},
		{
			title: "Realms",
			service: "Design & Development",
			link: "https://realms.house",
			linkText: "visit",
			description: "Realms is a Minneapolis based Entertainment company that hosts dance parties around the Twin Cities. I worked with the Realms team to build a custom SvelteKit website powered by Sanity for content management. The site also integrates with Realms existing ticketing provider to allow customers to buy tickets without leaving the site."
		},
		{
			title: "Karla Kratz",
			service: "Development",
			link: "https://www.karlakratz.com/",
			linkText: "visit",
			description: "Karla Kratz is a poet based in Pennsylvania. I connected with Karla's son Andy, who was looking for a Developer to build the site he designed. We worked together to build out a Sanity backend to power the site, and then implemented Andy's design as a SvelteKit website."
		},
		{
			title: "Evergreen",
			service: "Development",
			link: "https://evergreenfitness.net/",
			linkText: "visit",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{
			title: "Standup",
			service: "Development",
			link: "https://github.com/stordahl/standup",
			linkText: "view source",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		}
	];
</script>

<h2>Selected Work</h2>

{#each workItems as item, index}
	<Detail
		title={item.title}
		service={item.service}
		index={index + 1}
		link={item.link}
		linkText={item.linkText}
	>
		<p>{item.description}</p>
	</Detail>
{/each}

<style>
	h2 {
		font-family: 'Basheq', serif;
		font-size: clamp(2rem, calc(2rem + 5vw), 6rem);
		font-weight: 300;
		text-align: center;
		margin-top: 3rem;
		margin-bottom: 2rem;
	}
</style>
