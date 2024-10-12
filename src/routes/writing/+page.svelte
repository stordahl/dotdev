<script lang="ts">
	import type { Post } from '$lib/types';
	import { formatDateToMonthYear, roman } from '$lib/utils';

	type Props = {
		data: {
			posts: Post[];
		};
	};
	const { data }: Props = $props();

  let vw = $state(0);
  let useShortDate = $derived(vw <= 500);
</script>

<svelte:window bind:innerWidth={vw} />

<h1>Writing</h1>

<section>
	<ul class="posts">
		{#each data.posts as post, index}
			<li class="post" style:--marker={`"${roman(index + 1)}."`}>
				<a href="/writing/{post.slug}" class="title">
					<span class="title">{post.title}</span>
					<span class="date">{formatDateToMonthYear(post.date, useShortDate)}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	h1 {
		font-size: var(--font-size-large);
		text-align: center;
		margin: 1.5rem 0;
	}

	ul {
		padding: 0;
	}

	li {
		border-top: 1px solid var(--orange);
		list-style: none;
		position: relative;
		display: flex;
		align-items: center;
    gap: 10px;
		font-size: clamp(1rem, calc(1rem + 1vw), 1.5rem);
		a {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--white);
			padding: 2rem 0;
			border: none;
			.title {
				max-width: 75%;
			}
      .date {
        text-align: right;
        width: min-content;
        @media screen and (min-width: 550px) {
         width: max-content;
        }
      }
		}
		&:before {
			position: absolute;
			content: var(--marker);
			width: 100px;
			display: block;
			font-family: 'Basheq', serif;
			font-size: clamp(4rem, calc(4rem + 2vw), 6rem);
			color: var(--orange);
			opacity: 20%;
		}
	}
</style>
