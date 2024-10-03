<script lang="ts">
  import Detail from "../lib/Detail.svelte";
</script>

<h2>Selected Work</h2>

<Detail title="Stylitics" service="Development" index={1} link="/work/stylitics" linkText="read more">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> 
</Detail>
<Detail title="Realms" service="Design & Development" index={2} link="https://realms.house" linkText="visit">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> 
</Detail>

<style>
  h2 {
    font-family: "Basheq", serif;
    font-size: clamp(2rem, calc(2rem + 5vw), 6rem);
    font-weight: 300;
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
</style>
