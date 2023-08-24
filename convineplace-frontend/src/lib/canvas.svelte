<script>
	import { onMount, afterUpdate } from 'svelte';
	import { canvas as canvasStore, selectedColor } from '$lib/states.js';
	import { supabase } from '$lib/supabase.js';
	import { canvasFunction } from '$lib/canvas.js';

	const { loadCanvas, subscribeToCanvasChanges, updatePixel } = canvasFunction();

	let canvasElement;

	const drawCanvas = () => {
		const ctx = canvasElement.getContext('2d');
		const canvasData = $canvasStore;

		for (const [id, color] of Object.entries(canvasData)) {
			const x = id % 50;
			const y = Math.floor(id / 50);
			ctx.fillStyle = color;
			ctx.fillRect(x * 20, y * 20, 20, 20);
		}
	};

	const assignColor = async (event) => {
		const rect = canvasElement.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / 20);
		const y = Math.floor((event.clientY - rect.top) / 20);
		const id = y * 50 + x;

		updatePixel(id, $selectedColor);

		if (error) {
			console.error('Error updating pixel', error);
			return;
		}

		canvasStore.update((currentCanvas) => {
			currentCanvas[id] = selectedColor;
			return { ...currentCanvas };
		});
	};

	afterUpdate(drawCanvas);
	onMount(async () => {
		await loadCanvas();
		await subscribeToCanvasChanges();
		drawCanvas();
	});
</script>

<canvas
	class="canvas"
	bind:this={canvasElement}
	width="1000"
	height="1000"
	on:click={assignColor}
/>

<style>
	.canvas {
		border: solid 3px black;
		padding: 1px;
		margin: 1rem;
	}
</style>
