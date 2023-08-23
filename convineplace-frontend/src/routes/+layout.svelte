<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { loading } from '$lib/states.js';
</script>

<Toaster />
<div class="flex flex-row class:loading={$loading}">
	<slot><!-- optional fallback --></slot>
</div>

<style>
	.loading {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
