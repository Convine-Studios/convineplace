<script>
	import { colors, selectedColor as selected, hoveredPixelX, hoveredPixelY } from '$lib/states.js';
</script>

<div class="flex flex-col">
	<div class="grid">
		{#each $colors as color}
			<button on:click={() => ($selected = color)}>
				<div class="color" class:border={color === $selected} style="background-color: {color};" />
			</button>
		{/each}
	</div>
	<p class="place-self-center font-bold">X: {$hoveredPixelX} Y: {$hoveredPixelY}</p>
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
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(8, 1fr);
		width: fit-content;
		border: solid 3px black;
		padding: 1px;
		margin: 1rem;
	}
</style>
