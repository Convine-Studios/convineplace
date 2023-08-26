<script>
	import { supabaseFunction } from '$lib/supabase.js';
	import {
		Navbar,
		Button,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
	import Devmenu from '$lib/devmenu.svelte';
	import Login from '$lib/login.svelte';
	import Signup from '$lib/signup.svelte';
	import { loggedIn, isAdmin } from './states';

	const { login, getUser, supabase, logout } = supabaseFunction();

	const checkIfAdmin = () => {
		const user = getUser();
		if (!!user) {
			return user.profile.status_admin;
		}
		return false;
	}
	
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img
			src="https://cdn.discordapp.com/attachments/436874647787667456/498254921443966976/IMG_20180115_111548140_BURST000_COVER_TOP.jpg"
			class="mr-3 h-6 sm:h-9"
			alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">c/Place</span>
	</NavBrand>
	<div class="flex md:order-2 gap-2 place-content-end">
		{#if $isAdmin}
		<Devmenu />
		{/if}

		{#if $loggedIn}
		<Button on:click={() => logout()}>Logout</Button>
		{:else}
		<Login />
		<Signup />
		{/if} 
	</div>
	<div class="flex items-center md:order-2">
		<Avatar
			id="avatar-menu"
			src="https://cdn.discordapp.com/attachments/436874647787667456/498254921443966976/IMG_20180115_111548140_BURST000_COVER_TOP.jpg"
		/>
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
</Navbar>
