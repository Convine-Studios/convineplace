<script>
	import { supabaseFunction } from '$lib/supabase.js';
	import { Button, Modal, Tabs, TabItem, Input } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { websocket } from '$lib/websocket.js';
	import { colors, settings, toastSettings, canvasElement } from '$lib/states.js';
	import toast from 'svelte-french-toast';

	const { initWebSocket, sendMessage } = websocket();
	const { supabase, fetchSettings, sendCanvas } = supabaseFunction();

	const handleScreenshot = () => {
		const canvas = $canvasElement;
		sendCanvas(canvas);
	};

	let devModal = false;

	let timer = 0;
</script>

<Button on:click={() => (devModal = true)} color="alternative">Admin Menu</Button>

<Modal bind:open={devModal} size="lg" outsideclose>
	<Tabs style="underline">
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="grid-solid" size="sm" />
				Dashboard
			</div>
			<div class="h-96">
				<Button on:click={handleScreenshot}>Screenshot canvas</Button>
			</div>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="user-circle-solid" size="sm" />
				Users
			</div>
			<div class="h-96">User</div>
		</TabItem>
		<TabItem open>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="adjustments-vertical-solid" size="sm" />
				Settings
			</div>
			<div class="h-96">
				<Button
					on:click={() => {
						try {
							fetchSettings();
							timer = $settings[0].value;
							//console.log($settings);
							toast.success('Fetched Settings', toastSettings);
						} catch (error) {
							//console.log(error);
							toast.error(error, toastSettings);
							toast.error('Failed to fetch settings', toastSettings);
						}
					}}
				>
					Fetch settings
				</Button>
				<Button>Save Settings</Button> <br />
				<p class="flex flex-row place-items-center m-2 text-lg">
					Timer
					<Input class="w-42 ml-3" bind:value={timer} size="sm" />
				</p>
			</div>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="adjustments-vertical-solid" size="sm" />
				Websocket
			</div>
			<div class="h-96">
				<Button on:click={() => initWebSocket()}>Connect</Button>
				<Button on:click={() => sendMessage('Test')}>Send</Button>
			</div>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="clipboard-solid" size="sm" />
				Stats
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400 h-96">
				<b>Pixels placed: </b>
			</p>
		</TabItem>
		<TabItem>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="clipboard-solid" size="sm" />
				Colors
			</div>
			<div class="h-96">Co</div>
		</TabItem>
	</Tabs>
</Modal>
