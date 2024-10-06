<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	<h1>{$page.status}</h1>
	<p>{$page.error?.message}</p>
</div>

<style>
	div {
		padding: 50px 0;
	}

	h1,
	p {
		text-align: center;
	}

	h1 {
		font-size: 3rem;
	}

	p {
		font-size: 2rem;
	}
</style>
