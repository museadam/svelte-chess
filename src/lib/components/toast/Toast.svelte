<script lang="ts">
	// import { flip } from 'svelte/animate';
	import { confetti } from '@neoconfetti/svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from '$store/notifications/notifications';
	import type { Notification } from '$types/notifications';

	let {
		themes = {
			danger: '#E26D69',
			success: '#84C991',
			warning: '#f0ad4e',
			info: '#5bc0de',
			default: '#aaaaaa'
		}
	} = $props();

	let n = $state($notifications as Notification[]);
	$effect(() => {
		n = $notifications as Notification[];
	});
</script>

<div data-testid="notification" class="notifications">
	{#each n as notification, notificationIndex (notification.id)}
		<alert
			id={notification.type}
			class="toast"
			style="background: {themes[notification.type]};"
			transition:fly={{ y: 30 }}
		>
			<div class="notification-container">
				{#if notification.type === 'success'}
					<div>
						<div use:confetti></div>
					</div>
				{/if}
				<span class="hover:cursor-default">{notification.message}</span>
				<span
					class="hover:cursor-pointer xButton"
					onclick={() => notifications.delete(notificationIndex)}
					onkeypress={(e) => {
						if (e.key === 'Esc') {
							notifications.delete(notificationIndex);
						}
					}}
					role="button"
					tabindex="0"
				>
					&#x2715
				</span>
			</div>
			<!-- {#if notification.icon}<i class={notification.icon} />{/if} -->
		</alert>
	{/each}
</div>

<style>
	.xButton {
		z-index: 9999;
	}
	.notifications {
		max-width: fit-content;
		position: fixed;
		top: 30px;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0;
		z-index: 9998;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.toast {
		flex: 0 0 auto;
		margin-bottom: 10px;
	}

	.notification-container {
		padding: 10px;
		display: block;
		color: white;
		font-weight: 500;
	}
</style>
