<script>
  import Pixel from "$lib/pixel.svelte";
  import Selector from "$lib/selector.svelte";

  let canvas = [];
  let selected = "#ff4500";
  let room;

  import * as Colyseus from "colyseus.js";
  import { onMount } from "svelte";

  var client = new Colyseus.Client("ws://localhost:2567");

  client
    .joinOrCreate("room")
    .then((roomObj) => {
      room = roomObj;
      console.log(room.sessionId, "joined", room.name);
      listenToMessage();
    })
    .catch((e) => {
      console.log("JOIN ERROR", e);
    });

  function listenToMessage() {
    room.onMessage("pixel", ({ id, selected }) => {
      console.log("Received color", id, selected);
      canvas[id] = selected;
    });
  }

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

  function populateCanvas() {
    for (let i = 0; i < 100; i++) {
      canvas.push("white");
    }
    console.log(canvas);
  }
  populateCanvas();

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function assignColor(id) {
    room.send("pixel", { id, selected });
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
