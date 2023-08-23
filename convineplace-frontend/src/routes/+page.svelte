<script>
	import Devmenu from '$lib/devmenu.svelte';
	import Selector from '$lib/selector.svelte';
	import Canvas from '$lib/canvas.svelte';
	import Navbar from '$lib/navbar.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { canvas as canvasStore, loading } from '$lib/states.js';
	import { supabase } from '$lib/supabase.js';

	function toggle() {
		loading.update((current) => !current);
	}
</script>

<div class="container">
	<Navbar />
	<div class="game-container">
		<Canvas />
		<div class="">
			<Selector />
		</div>
	</div>
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: row;
	}
</style>
