<script lang="ts">
	import { page } from '$app/stores';

	type Props = {
		title?: string;
		description?: string;
		keywords?: string;
		author?: string;
		canonicalUrl?: string;
		ogTitle?: string;
		ogDescription?: string;
		ogImage?: string;
		twitterCard?: string;
		twitterSite?: string;
		twitterCreator?: string;
	};

	const baseUrl = $derived($page.url.href);

	// Define props for SEO component
	let {
		title = 'Jacob Stordahl',
		description = 'Design Engineer, Web Developer, and recovering artist',
		keywords = 'web developer, software, javascript, typescript, svelte',
		author,
		//canonicalUrl,
		ogTitle,
		ogDescription,
		ogImage = '/images/og/base.jpg',
		twitterCard = 'summary_large_image',
		twitterSite,
		twitterCreator = '@stordahldotdev'
	}: Props = $props();

	// Compute the full canonical URL
	//const fullCanonicalUrl = $derived(canonicalUrl ? `${baseUrl}${canonicalUrl}` : '');

	// Compute the full OG image URL
	const fullOgImageUrl = $derived(ogImage ? `${baseUrl}${ogImage}` : '');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	{#if author}
		<meta name="author" content={author} />
	{/if}
	<!--{#if fullCanonicalUrl}
    <link rel="canonical" href={fullCanonicalUrl} />
  {/if}-->

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={baseUrl} />
	<meta property="og:title" content={ogTitle || title} />
	<meta property="og:description" content={ogDescription || description} />
	{#if fullOgImageUrl}
		<meta property="og:image" content={fullOgImageUrl} />
	{/if}

	<!-- Twitter -->
	<meta property="twitter:card" content={twitterCard} />
	<meta property="twitter:url" content={baseUrl} />
	<meta property="twitter:title" content={ogTitle || title} />
	<meta property="twitter:description" content={ogDescription || description} />
	{#if fullOgImageUrl}
		<meta property="twitter:image" content={fullOgImageUrl} />
	{/if}
	{#if twitterSite}
		<meta name="twitter:site" content={twitterSite} />
	{/if}
	{#if twitterCreator}
		<meta name="twitter:creator" content={twitterCreator} />
	{/if}
</svelte:head>
