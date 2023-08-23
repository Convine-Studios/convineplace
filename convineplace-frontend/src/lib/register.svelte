<script>
	import { Button, Modal } from 'flowbite-svelte';
	let registereModal = false;

	function handleRegister() {
		console.log('Registering...');
		registereModal = false;
	}
</script>

<Button on:click={() => (registereModal = true)}>Register</Button>

<Modal title="Terms of Service" bind:open={registereModal} autoclose outsideclose>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		With less than a month to go before the European Union enacts new consumer privacy laws for its
		citizens, companies around the world are updating their terms of service agreements to comply.
	</p>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25
		and is meant to ensure a common set of data rights in the European Union. It requires
		organizations to notify users as soon as possible of high-risk data breaches that could
		personally affect them.
	</p>
	<svelte:fragment slot="footer">
		<Button on:click={handleRegister()}>I accept</Button>
	</svelte:fragment>
</Modal>
