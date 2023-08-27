<script>
	import { Input, Label, Helper, Button, Checkbox, A, Modal } from 'flowbite-svelte';
	import { signupModal } from '$lib/states.js';
	import { supabaseFunction } from '$lib/supabase.js';

	let username = '';
	let email = '';
	let password = '';
	let confirmPasswort = '';

	const { signup } = supabaseFunction();
</script>

<Button on:click={() => ($signupModal = true)}>Signup</Button>

<Modal title="Terms of Service" bind:open={$signupModal} outsideclose>
	<form>
		<div class="mb-6">
			<Label for="email" class="mb-2">Username</Label>
			<Input type="email" id="username" placeholder="duck69" required bind:value={username} />
		</div>
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
					signup(email, password, username);
				} catch (error) {
					//console.log('Error while signing up', error);
				}
			}}
		>
			Signup
		</Button>
	</form>
</Modal>
