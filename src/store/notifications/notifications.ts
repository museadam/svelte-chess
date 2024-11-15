import { writable, derived } from 'svelte/store';
import type { Notification } from '$types/notifications';

const TIMEOUT = 3000;

function createNotificationStore(timeout?: number) {
	const _notifications = writable<Notification[]>([]);

	function send(message: string, type = 'default', timeout: number) {
		_notifications.update((state) => {
			return [...state, { id: id(), type, message, timeout }];
		});
	}

	const timers: Array<NodeJS.Timeout> = [];

	const notifications = derived(_notifications, ($_notifications, set) => {
		set($_notifications);
		if ($_notifications.length > 0) {
			const timer = setTimeout(() => {
				_notifications.update((state) => {
					state.shift();
					return state;
				});
			}, $_notifications[0].timeout);
			timers.push(timer);
			return () => {
				clearTimeout(timer);
			};
		}
	});
	function deleteNotification(index: number) {
		_notifications.update((state) => {
			state.shift();
			timers.shift();
			return state;
		});
	}
	const { subscribe } = notifications;

	return {
		subscribe,
		send,
		delete: (index: number) => deleteNotification(index),
		default: (msg: string, timeout: number) => send(msg, 'default', timeout),
		danger: (msg: string, timeout: number) => send(msg, 'danger', timeout),
		warning: (msg: string, timeout: number) => send(msg, 'warning', timeout),
		info: (msg: string, timeout: number) => send(msg, 'info', timeout),
		success: (msg: string, timeout: number) => send(msg, 'success', timeout)
	};
}

function id() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

export const notifications = createNotificationStore();
