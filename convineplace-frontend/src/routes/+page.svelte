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
{#each canvas as pixel}
  <div class="grid">
    <Pixel color={pixel} />
  </div>
{/each}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    gap: 0p;
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>
