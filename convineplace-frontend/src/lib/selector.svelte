<script>
  export let selected = "#ff4500";

  const colors = [
    "#ff4500",
    "#ffa800",
    "#ffd635",
    "#00a368",
    "#7eed56",
    "#2450a4",
    "#3690ea",
    "#51e9f4",
    "#811e9f",
    "#b44ac0",
    "#ff99aa",
    "#9c6926",
    "#000000",
    "#898d90",
    "#d4d7d9",
    "#ffffff"
  ];
</script>

<div class="grid">
  {#each colors as color}
    <button on:click={() => (selected = color)}>
      <div
        class="color"
        class:border={color === selected}
        style="background-color: {color};"
      />
    </button>
  {/each}
</div>

<style>
  .border {
    border: solid 3px black;
  }

  .color {
    width: 40px;
    height: 40px;
    padding: 0rem;
    margin: 0.34rem;
    
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: fit-content;
    border: solid 3px black;
    padding: 1px;
    margin: 1rem;
  }
</style>
