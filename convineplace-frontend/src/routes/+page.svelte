<script>
  import Pixel from "$lib/pixel.svelte";
  let canvas = [];

  function populateCanvas() {
    for (let i = 0; i < 100; i++) {
      canvas.push("green");
    }
    console.log(canvas);
  }
  populateCanvas();
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
    width: 200px;
  }
</style>
