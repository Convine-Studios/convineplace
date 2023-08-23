<script>
	import {
		Navbar,
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
	import Register from '$lib/register.svelte';
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
	<div class="flex md:order-2 gap-2">
		<Devmenu />
		<Login />
		<Register />
	</div>
	<div class="flex items-center md:order-2">
		<Avatar
			id="avatar-menu"
			src="https://cdn.discordapp.com/attachments/436874647787667456/498254921443966976/IMG_20180115_111548140_BURST000_COVER_TOP.jpg"
		/>
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Navbar</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
</Navbar>
