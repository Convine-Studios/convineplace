<script>
	import { supabaseFunction } from '$lib/supabase.js';
	import { Button, Modal, Tabs, TabItem, Input, Spinner, Popover, Badge } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { websocket } from '$lib/websocket.js';
	import {
		colors,
		settings,
		toastSettings,
		canvasElement,
		userSearchResult,
		loadingAdmin,
		uuidSearchResult
	} from '$lib/states.js';
	import toast from 'svelte-french-toast';

	const { initWebSocket, sendMessage } = websocket();
	const { fetchSettings, sendCanvas, searchUser, toggleBan, toggleAdmin, searchUUID } =
		supabaseFunction();
	let lastScreenshot = 0;

	const handleScreenshot = () => {
		if (Date.now() - lastScreenshot < 60000) {
			toast.error('Please wait before sending another screenshot', toastSettings);
			lastScreenshot = Date.now();
			return;
		}
		lastScreenshot = Date.now();
		const canvas = $canvasElement;
		sendCanvas(canvas);
	};

	let devModal = false;

	let timer = 0;

	let userSearch = '';
	let uuidSearch = '';
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
		<TabItem open>
			<div slot="title" class="flex items-center gap-2">
				<Icon name="user-circle-solid" size="sm" />
				Users
			</div>
			<div class="h-96 grid grid-cols-2 gap-2">
				<div class=" justify-between">
					Username:
					<div class="flex gap-4">
						<Input bind:value={userSearch} class="w-72" />
						<Button on:click={searchUser(userSearch)} class="">Search</Button>
					</div>
					<hr class="m-4" />
					{#if $loadingAdmin}
						<Spinner class="place-self-center" />
					{:else if !$userSearchResult}
						<div class="text-center m-24">Search for a user to be displayed here.</div>
					{:else}
						<h1 class="font-bold text-2xl content-center">
							{$userSearchResult.username}
							{#if $userSearchResult.status_banned}
								<Badge class="" large color="red">BANNED</Badge>
							{/if}
							{#if $userSearchResult.status_admin}
								<Badge large color="purple">ADMIN</Badge>
							{/if}
						</h1>
						<p>
							ID: {$userSearchResult.profile_id}
						</p>
						<p class="font-md">
							Username: {$userSearchResult.username}
						</p>
						<p class="font-md">
							USER ID: {$userSearchResult.user_id}
						</p>
						<p class="font-md">
							Pixels placed: {$userSearchResult.pixels_placed}
						</p>
						<div class="my-5">
							{#if $userSearchResult.status_banned}
								<Button class="w-24" id="unban">Unban</Button>
								<Popover
									class="w-min text-sm font-light "
									title="You sure?"
									triggeredBy="#unban"
									trigger="click"
								>
									<Button class="w-32" on:click={toggleBan($userSearchResult.profile_id)}
										>Confirm</Button
									>
								</Popover>
								<Button disabled class="w-32" color="red">Make Admin</Button>
							{:else}
								<Button class="w-24" id="ban">Ban</Button>
								<Popover
									class="w-min text-sm font-light place-content-center"
									title="You sure?"
									triggeredBy="#ban"
									trigger="click"
								>
									<Button class="w-32" on:click={toggleBan($userSearchResult.profile_id)}>
										Confirm
									</Button>
								</Popover>
							{/if}

							{#if !$userSearchResult.status_banned}
								{#if $userSearchResult.status_admin}
									<Button class="w-36" id="revoke">Revoke Admin</Button>
									<Popover
										class="w-min text-sm font-light "
										title="You sure?"
										triggeredBy="#revoke"
										trigger="click"
									>
										<Button class="w-32" on:click={toggleAdmin($userSearchResult.profile_id)}>
											Confirm
										</Button>
									</Popover>
								{:else}
									<Button class="w-36" id="make">Make Admin</Button>
									<Popover
										class="w-min text-sm font-light "
										title="You sure?"
										triggeredBy="#make"
										trigger="click"
									>
										<Button class="w-32" on:click={toggleAdmin($userSearchResult.profile_id)}>
											Confirm
										</Button>
									</Popover>
								{/if}
							{/if}
							<Button
								color="alternative"
								on:click={() => {
									uuidSearch = $userSearchResult.user_id;
									searchUUID(uuidSearch);
								}}>Open UUID</Button
							>
						</div>
					{/if}
				</div>
				<div class="">
					UUID:
					<div class="flex gap-4">
						<Input bind:value={uuidSearch} class="w-72" />
						<Button on:click={searchUUID(uuidSearch)} class="">Search</Button>
					</div>
					<hr class="m-4" />
					{#if $loadingAdmin}
						<Spinner class="place-self-center" />
					{:else if !$uuidSearchResult}
						<div class="text-center m-24">Search for a uuid to be displayed here.</div>
					{:else}
						<h1 class="font-bold text-xl content-center">
							{$uuidSearchResult.id}
						</h1>
						<p class="font-md">Email: {$uuidSearchResult.email}</p>
						<p class="font-md">Created at: {$uuidSearchResult.created_at}</p>
						<p class="font-md">Last changed: {$uuidSearchResult.updated_at}</p>
						<p class="font-md">Last online: {$uuidSearchResult.last_sign_in_at}</p>
						<p class="font-md">Role: {$uuidSearchResult.role}</p>
					{/if}
				</div>
			</div>
		</TabItem>
		<TabItem>
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
