<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { loading } from '$lib/states.js';
	import { Spinner } from 'flowbite-svelte';
</script>

<Toaster />
<div class="flex flex-row">
	<slot><!-- optional fallback --></slot>
</div>