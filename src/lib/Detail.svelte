<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { roman } from './utils';
	import ArrowUpRight from './icons/ArrowUpRight.svelte';

	type Props = {
		children: Snippet;
		index: number;
		service?: string | undefined;
		title: string;
		link: string | undefined;
		linkText: string | undefined;
	};
	let { children, index, link, linkText, service, title }: Props = $props();

	let open = $state(false);
</script>

<details
	ontoggle={() => (open = !open)}
	style:--marker={`"${roman(index)}."`}
	style:--squiggle={`url("/images/squiggle/${Math.floor(Math.random() * 10) + 1}.svg")`}
	style:border-top={index === 1 ? '2px solid var(--orange)' : 'none'}
>
	<summary>
    <span class="title">
      <span class="title-text">{title}</span>
      <span class="title-squiggle"></span>
    </span>
    {#if Boolean(service)}
      <span class="service">{service}</span>
    {/if}
  </summary>
	{#if open}
		<div class="content" transition:slide>
			<div class="content-inner">
				{@render children()}
			</div>
      {#if link && linkText}
			<a href={link}>
				{linkText}
				{#if link[0] !== '/'}
					<ArrowUpRight />
				{/if}
			</a>
      {/if}
		</div>
	{/if}
</details>

<style>
	details {
		border-bottom: 2px solid var(--orange);
		font-family: 'Basheq', serif;
		padding-bottom: 0.8rem;
		transition: padding-bottom 0.2s ease-in-out 0s;
	}

	details:hover,
	details[open] {
		cursor: pointer;
	}

	details[open] {
		padding-bottom: 2rem;
	}

	details:hover .title-squiggle,
	details[open] .title-squiggle {
		opacity: 75%;
	}

	summary {
		font-size: var(--detail-font-size, clamp(3rem, calc(3rem + 2vw), 5rem));
		position: relative;
		display: flex;
    flex-direction: column;
		align-items: center;
		user-select: none;
    min-height: 75px;
    &:has(.service) {
      justify-content: space-between;
    }

		.title {
			position: relative;
			display: flex;
			align-items: center;
      align-self: flex-start;
		}

		.title:before {
			content: var(--marker);
			width: 100px;
			display: block;
			font-size: clamp(3rem, calc(3rem + 2vw), 5rem);
			color: var(--orange);
      position: absolute;
      z-index: 0;
      opacity: 20%;
		}

		.title-text {
			z-index: 2;
		}

		.title-squiggle {
			position: absolute;
			height: 100%;
			width: calc(100% - 100px);
			top: 0;
			left: 100px;
			background-image: var(--squiggle);
			background-repeat: no-repeat;
			background-position: center;
      background-size: contain;
			opacity: 0;
			transition: opacity 0.2s ease-in-out 0s;
			z-index: 1;
		}

		.service {
			font-family: 'Fraunces', serif;
			font-size: clamp(1rem, calc(1rem + 1vw), 2rem);
      text-align: right;
			justify-self: flex-end;
      align-self: flex-end;
		}
	}

	details .content {
		font-size: clamp(1rem, calc(1rem + 1vw), 1.5rem);
		font-family: 'Fraunces', serif;
		font-weight: 300;
		display: flex;
    flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
    gap: 15px;
		a {
			font-size: clamp(1.2rem, calc(1.2rem + 1vw), 2rem);
			border: none;
			color: var(--white);
			display: flex;
			gap: 5px;
			align-items: center;
			&:after {
				background-color: var(--white);
			}
		}
	}

	details summary::-webkit-details-marker {
		display: none;
	}

  @media screen and (min-width: 678px) {
    details .content {
      padding-left: 100px;
      flex-direction: row;
      .content-inner {
			  max-width: 70%;
		  }
    }
    
    summary {
      flex-direction: row;
      .title:before {
        position: unset;
        z-index: 1;
        opacity: 100%;
      }
      .service {
        align-self: center;
      }
    }
  }
</style>
