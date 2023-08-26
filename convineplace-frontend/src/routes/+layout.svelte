<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { loading } from '$lib/states.js';
	import { Spinner } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>c/place</title>
</svelte:head>

<Toaster />
<div class="flex flex-row">
	<slot><!-- optional fallback --></slot>
</div>
