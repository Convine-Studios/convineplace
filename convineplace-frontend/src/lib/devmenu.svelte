<script>
	import { Button, Modal, Tabs, TabItem } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { websocket } from '$lib/websocket.js';

	const { initWebSocket, sendMessage } = websocket();

	let devModal = true;
</script>

<Button on:click={() => (devModal = true)}>Admin Menu</Button>

<Modal bind:open={devModal} size="lg" outsideclose>
	<script>
		import { Tabs, TabItem } from 'flowbite-svelte';
		import { Icon } from 'flowbite-svelte-icons';
	</script>

	<Tabs style="underline">
		<TabItem open>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="grid-solid" size="sm" />
				Dashboard
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Dashboard:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="user-circle-solid" size="sm" />
				Users
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Profile:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="adjustments-vertical-solid" size="sm" />
				Settings
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Settings:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="adjustments-vertical-solid" size="sm" />
				Websocket
			</div>
			<div class="">
				<Button on:click={() => initWebSocket()}>Connect</Button>
				<Button on:click={() => sendMessage('Test')}>Send</Button>
			</div>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="clipboard-solid" size="sm" />
				Stats
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Pixels placed: </b>
			</p>
		</TabItem>
	</Tabs>
</Modal>
