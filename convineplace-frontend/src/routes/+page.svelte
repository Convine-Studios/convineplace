<script>
	import Devmenu from '$lib/devmenu.svelte';
	import Selector from '$lib/selector.svelte';
	import Canvas from '$lib/canvas.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { canvas as canvasStore } from '$lib/states.js';
	import { supabase } from '$lib/supabase.js';
</script>

<Devmenu />

<h1>Place</h1>
<div class="container">
	<Canvas />
	<div class="">
		<Selector />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
	}
</style>
