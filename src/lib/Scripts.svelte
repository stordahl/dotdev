<script lang="ts">
  import { browser } from "$app/environment";
	import { onMount } from "svelte";

  onMount(() => {
    // @ts-expect-error counter scale on window
    if(import.meta.env.PROD && window.counterscale) {
      // @ts-expect-error counter scale on window
      window.counterscale = {
        q: [["set", "siteId", "dotdev-analytics"], ["trackPageview"]],
      };
    }
  })
</script>

{#if browser && import.meta.env.PROD}
  <script
    id="counterscale-script"
    src="https://counterscale.stordahldev.workers.dev/tracker.js"
    defer
  ></script>
{/if}
