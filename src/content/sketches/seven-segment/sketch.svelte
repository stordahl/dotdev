<script lang="ts">
  type SevenSegmentParts = "a" | "b" | "c" | "d" | "e" | "f" | "g";
  type NumberMap = Map<number, Array<SevenSegmentParts>>;

  const numberMap: NumberMap = new Map([
    [0, ["a", "b", "c", "d", "e", "f"]],
    [1, ["b", "c"]],
    [2, ["a", "b", "d", "e", "g"]],
    [3, ["a", "b", "c", "d", "g"]],
    [4, ["b", "c", "f", "g"]],
    [5, ["a", "c", "d", "f", "g"]],
    [6, ["a", "c", "d", "e", "f", "g"]],
    [7, ["a", "b", "c"]],
    [8, ["a", "b", "c", "d", "e", "f", "g"]],
    [9, ["a", "b", "c", "d", "f", "g"]],
  ]);

  let timeArray = $state([0, 0, 0, 0, 0, 0]);

  function updateTime() {
    const now = new Date();
    timeArray = [
      Math.floor(now.getHours() / 10),
      now.getHours() % 10,
      Math.floor(now.getMinutes() / 10),
      now.getMinutes() % 10,
      Math.floor(now.getSeconds() / 10),
      now.getSeconds() % 10
    ];
  }

  updateTime();
  const timeInterval = setInterval(updateTime, 1000);

  $effect(() => {
    return () => clearInterval(timeInterval);
  });
</script>

<div class="clock">
  {#each timeArray as t, index}
    {@const segments = numberMap.get(t)?.join(" ")}
    <div class="number {segments}">
      <div class="a-inner"></div>
      <div class="b-inner"></div>
      <div class="c-inner"></div>
      <div class="d-inner"></div>
      <div class="e-inner"></div>
      <div class="f-inner"></div>
      <div class="g-inner"></div>
    </div>
    {#if [1,3].includes(index)}
      <div class="colon">
        <div></div>
        <div></div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .clock {
    --number-bg: var(--white);
    --short: min(1vw, 10px);
    --long: min(5vw, 55px);
    --skew: skew(-8deg);
    display: flex;
    gap: 15px;
  }

  .colon {
    width: var(--short);
    transform: var(--skew);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }

  .colon div {
    background: var(--number-bg);
    width: var(--short);
    height: var(--short);
  }

  .number {
    width: calc(calc(var(--short) * 2) + var(--long));
    height: calc(calc(var(--short) * 3) + calc(var(--long) * 2));
    display: grid;
    grid-template-columns: var(--short) var(--long) var(--short);
    grid-template-rows: var(--short) var(--long) var(--short) var(--long) var(--short);
    grid-template-areas: 
      "empty1 a empty2"   
      "f empty3 b" 
      "empty4 g empty5"
      "e empty6 c"
      "empty7 d empty8";
    gap: 1px;
    transform: var(--skew);
  }

  .number > div {
    background: var(--grey);
    border-radius: 1px;
  }

  .a-inner { grid-area: a; }
  .b-inner { grid-area: b; }
  .c-inner { grid-area: c; }
  .d-inner { grid-area: d; }
  .e-inner { grid-area: e; }
  .f-inner { grid-area: f; }
  .g-inner { grid-area: g; }

  .number.a .a-inner, 
  .number.b .b-inner,
  .number.c .c-inner,
  .number.d .d-inner,
  .number.e .e-inner,
  .number.f .f-inner,
  .number.g .g-inner
  {
    background: var(--number-bg); 
  }
</style>
