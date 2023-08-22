<script>
  import Pixel from "$lib/pixel.svelte";
  import Selector from "$lib/selector.svelte";
  import { createClient } from "@supabase/supabase-js";

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  let canvas = Array(100).fill("white");
  let selected = "blue";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const channel = supabase.channel("room-1");

  channel
    .on("broadcast", { event: "pixel" }, (payload) => {
      console.log("Received payload", payload);
      if (
        payload &&
        payload.payload.id !== undefined &&
        payload.payload.selected !== undefined
      ) {
        console.log(
          "Received color",
          payload.payload.id,
          payload.payload.selected
        );
        canvas[payload.payload.id] = payload.payload.selected;
      }
    })
    .subscribe();

  function assignColor(id) {
    channel.send({
      type: "broadcast",
      event: "pixel",
      payload: {
        id,
        selected,
      },
    });
    console.log("Setting color", id, selected);
    canvas[id] = selected;
  }
</script>

Place
<div class="grid">
  {#each canvas as pixel, id}
    <button on:click={() => assignColor(id)}>
      <Pixel color={pixel} />
    </button>
  {/each}
</div>

<div class="">
  <Selector bind:selected />
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
