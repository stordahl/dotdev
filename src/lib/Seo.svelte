<script lang="ts">
	import { page } from '$app/state';

	type Props = {
		title?: string;
		description?: string;
		keywords?: string;
		author?: string;
		canonicalUrl?: string;
		ogTitle?: string;
		ogDescription?: string;
	};

	const baseUrl = $derived(page.url.origin);

	let {
		title = 'Jacob Stordahl',
		description = 'Design Engineer, Web Developer, and recovering artist',
		keywords = 'web developer, software, javascript, typescript, svelte',
		author,
		ogTitle,
		ogDescription
	}: Props = $props();

	const ogImage = '/images/og.jpg';

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
</svelte:head>
