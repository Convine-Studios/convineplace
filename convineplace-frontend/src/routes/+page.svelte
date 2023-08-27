<script>
	import Devmenu from '$lib/devmenu.svelte';
	import Selector from '$lib/selector.svelte';
	import Canvas from '$lib/canvas.svelte';
	import Navbar from '$lib/navbar.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { canvas as canvasStore, loading, loggedIn } from '$lib/states.js';
	import { supabaseFunction } from '$lib/supabase.js';

	const { supabase, onLogin } = supabaseFunction();

	onMount(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN' && !$loggedIn) {
				$loggedIn = true;
				//console.log('logged in');
				try {
					onLogin();
				} catch (error) {
					//console.log(error);
				}
			}
			if (event === 'SIGNED_OUT') {
				$loggedIn = false;
				//console.log('Logged out');
			}
		});
	});
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
