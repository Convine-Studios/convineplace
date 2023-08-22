<script>
  export let selected = "red";

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
    "black",
    "white",
  ];
</script>

<div class="">
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
    padding: 1rem;
    margin: 1rem;
  }
</style>
