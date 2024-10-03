<script lang="ts">
	import type { Snippet } from "svelte";
	import { slide } from 'svelte/transition';
  import { roman } from "./utils"
	import ArrowUpRight from "./icons/ArrowUpRight.svelte";

  type Props = {
    children: Snippet;
    index: number;
    service: string;
    title: string;
    link: string;
    linkText: string;
  }
  let { children, index, link, linkText, service, title }: Props = $props();

  let open = $state(false);
</script>

<details 
  ontoggle={() => open = !open}
  style:--marker={`"${roman(index)}."`}
  style:--squiggle={`url("/images/squiggle/${Math.floor(Math.random() * 10) + 1}.svg")`}
  style:border-top={index === 1 ? "2px solid var(--orange)" : "none"}
>
  <summary><span class="title"><span class="title-text">{title}</span><span class="title-squiggle"></span></span><span class="service">{service}</span></summary>
  {#if open}
    <div class="content" transition:slide>
      <div class="content-inner">
        {@render children()}
      </div>
      <a href={link}>
        {linkText}
        <ArrowUpRight />
      </a>
    </div>
  {/if}
</details>

<style>
  details {
    border-bottom: 2px solid var(--orange);
    font-family: "Basheq", serif;
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
    opacity: 100%;
  }

  summary {
    font-size: clamp(3rem, calc(3rem + 2vw), 5rem);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    
    .title {
      position: relative;
      display: flex;
      align-items: center;
    }
  
    .title:before {
      content: var(--marker);
      width: 100px;
      display: block;
      font-size: clamp(4rem, calc(4rem + 2vw), 6rem);
      color: var(--orange);
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
      opacity: 0;
      transition: opacity 0.2s ease-in-out 0s;
      z-index: 1; 
    }


    .service {
      font-family: "Fraunces", serif;
      font-size: clamp(1rem, calc(1rem + 1vw), 2rem);
      justify-self: flex-end;
    }
  }

  details .content {
    padding-left: 100px;
    font-size: clamp(1rem, calc(1rem + 1vw), 1.5rem);
    font-family: "Fraunces", serif;
    font-weight: 300;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .content-inner {
      max-width: 70%;
    }
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


  details summary::-webkit-details-marker { display:none; }
</style>
