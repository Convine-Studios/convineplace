<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { loading } from '$lib/states.js';
	import { Spinner } from 'flowbite-svelte';

	src="/background.svg"
</script>

<Toaster />
<div class="flex flex-row">
	<slot><!-- optional fallback --></slot>
</div>
{#if $loading}
	<div class="loading flex place-content-center place-items-center">
		<p class="loading-text text-3xl">Loading</p>
		<Spinner size={16} />
	</div>
{/if}

<style>
	.loading {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		pointer-events: none;
		height: 100vh;
		width: 100vw;
		background: url(src);
		background-size: cover;
		color: white;
		font-size: larger;
		gap: 3rem;
	}
</style>
