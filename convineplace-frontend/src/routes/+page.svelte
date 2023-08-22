<script>
  import Pixel from "$lib/pixel.svelte";
  let canvas = [];

  let colors = [
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

  function populateCanvas() {
    for (let i = 0; i < 100; i++) {
      canvas.push(getRandomColor());
    }
    console.log(canvas);
  }
  populateCanvas();

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }
</script>

Place
<div class="grid">
  {#each canvas as pixel}
    <Pixel color={pixel} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    width: fit-content;
    border: solid 3px black;
    padding: 5px;
    margin: 1rem;
  }
</style>
