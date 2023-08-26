<script>
	import {
		loggedIn,
		loading,
		toastSettings,
		canvasElement,
		canvas as canvasStore,
		selectedColor,
		timeLastScreenshot,
		isAdmin
	} from '$lib/states.js';
	import { Spinner, Button } from 'flowbite-svelte';
	import toast from 'svelte-french-toast';
	import { onMount, afterUpdate } from 'svelte';
	import { supabaseFunction } from '$lib/supabase.js';
	import { canvasFunction } from '$lib/canvas.js';

	const { loadCanvas, subscribeToCanvasChanges, updatePixel } = canvasFunction();

	const drawCanvas = () => {
		console.count('draw canvas');
		if (!$canvasElement) return 'canvas element not there';
		const ctx = $canvasElement.getContext('2d');
		const canvasData = $canvasStore;

		for (const [id, color] of Object.entries(canvasData)) {
			const x = id % 50;
			const y = Math.floor(id / 50);
			ctx.fillStyle = color;
			ctx.fillRect(x * 20, y * 20, 20, 20);
		}
	};

	const assignColor = async (event) => {
		if (!$loggedIn) {
			toast.error('You need to be logged in to place a pixel', {
				duration: 3000,
				position: 'top-right'
			});
			return;
		}

		const since = Date.now() - $timeLastScreenshot;
		//console.log(since);

		if (!$isAdmin && since < 60000) {
			let until = 60 - since / 1000;
			until = Math.round(until);
			toast.error('You can place the next pixel in ' + until, toastSettings);
			return;
		}
		const rect = $canvasElement.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / 20);
		const y = Math.floor((event.clientY - rect.top) / 20);
		const id = y * 50 + x;
		//console.log('Adding color', id, $selectedColor);
		$canvasStore[id] = $selectedColor;
		updatePixel(id, $selectedColor);
		$timeLastScreenshot = Date.now();
	};

	afterUpdate(() => {
		if ($canvasElement) drawCanvas();
	});
	onMount(async () => {
		await loadCanvas();
		drawCanvas();
		await subscribeToCanvasChanges();
	});
</script>

{#if $loading}
	<div class="placeholder flex place-content-center place-items-center">
		<Spinner size={16} />
	</div>
{:else}
	<canvas
		id="canvas"
		class="canvas"
		bind:this={$canvasElement}
		width="1000"
		height="1000"
		on:click={assignColor}
	/>
{/if}

<style>
	.canvas {
		border: solid 3px black;
		padding: 1px;
		margin: 1rem;
	}

	.placeholder {
		width: 1000px;
		height: 1000px;
	}
</style>
