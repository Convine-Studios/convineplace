<script>
	import { Input, Label, Helper, Button, Checkbox, A, Modal } from 'flowbite-svelte';

	import { supabaseFunction } from '$lib/supabase.js';

	import { loginModal } from '$lib/states';

	const { login } = supabaseFunction();

	let email = '';
	let password = '';
</script>

<Button on:click={() => ($loginModal = true)} color="alternative">Login</Button>

<Modal title="Login" bind:open={$loginModal} outsideclose>
	<form>
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address</Label>
			<Input type="email" id="email" placeholder="prob@gmail.com" required bind:value={email} />
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Password</Label>
			<Input type="password" id="password" placeholder="•••••••••" required bind:value={password} />
		</div>
		<Button
			on:click={() => {
				try {
					login(email, password);
				} catch (error) {
					//console.log('Error while logging in', error);
				}
			}}
		>
			Login
		</Button>
	</form>
</Modal>
